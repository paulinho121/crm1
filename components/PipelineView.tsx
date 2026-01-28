
import React, { useState } from 'react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';
import AddDealModal from './AddDealModal';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MoreVertical, DollarSign, Clock, Plus } from 'lucide-react';
import { Deal } from '../types';

const SortableDealCard = ({ deal, clientName }: { deal: Deal, clientName: string, key?: string }) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg hover:border-zinc-700 cursor-grab active:cursor-grabbing transition-all group/card"
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{clientName}</p>
        <button className="text-zinc-600 hover:text-zinc-400 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <MoreVertical size={14} />
        </button>
      </div>
      <h4 className="text-sm font-semibold mb-3 leading-tight">{deal.title}</h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 rounded-lg border border-zinc-800">
          <span className="text-xs font-bold text-zinc-100">${deal.value.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
          <Calendar size={12} />
          {new Date(deal.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <img key={i} src={`https://picsum.photos/seed/${deal.id + i}/32`} className="w-6 h-6 rounded-full border-2 border-zinc-900" alt="team" />
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
          {deal.probability}% {t('prob')}
        </div>
      </div>
    </div>
  );
};

const DroppableStage = ({ stage, stageDeals, getClientName, openAddModal, t }: any) => {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-zinc-900/30 border border-zinc-900 rounded-2xl p-3 space-y-4 overflow-y-auto no-scrollbar group-hover:bg-zinc-900/50 transition-colors min-h-[150px]"
    >
      {stageDeals.map((deal: any) => (
        <SortableDealCard key={deal.id} deal={deal} clientName={getClientName(deal.clientId)} />
      ))}
      <button
        onClick={() => openAddModal(stage.id)}
        className="w-full py-2.5 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={14} /> {t('add_opportunity')}
      </button>
    </div>
  );
};

const PipelineView: React.FC = () => {
  const { t } = useTranslation();
  const { deals, stages, clients, setDeals, moveDeal } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.name || 'Unknown';

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeDealId = active.id as string;
    const overId = over.id as string;

    const activeDeal = deals.find(d => d.id === activeDealId);
    if (!activeDeal) return;

    const isOverAStage = stages.some(s => s.id === overId);

    if (isOverAStage) {
      if (activeDeal.stageId !== overId) {
        moveDeal(activeDealId, overId);
      }
    } else {
      const overDeal = deals.find(d => d.id === overId);
      if (overDeal && activeDeal.stageId !== overDeal.stageId) {
        moveDeal(activeDealId, overDeal.stageId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeIndex = deals.findIndex(d => d.id === active.id);
      const overIndex = deals.findIndex(d => d.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        setDeals(arrayMove(deals, activeIndex, overIndex));
      }
    }
    setActiveId(null);
  };

  const openAddModal = (stageId?: string) => {
    setSelectedStageId(stageId);
    setIsAddModalOpen(true);
  };

  const totalPipelineValue = deals.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/40">
        <div>
          <h1 className="text-2xl font-bold">{t('pipeline')}</h1>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <DollarSign size={12} className="text-emerald-500" />
              <span>{t('pipeline_value')}: <strong>${totalPipelineValue.toLocaleString()}</strong></span>
            </div>
            <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Clock size={12} className="text-blue-500" />
              <span>{t('avg_cycle')}: <strong>24 {t('days')}</strong></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button className="px-4 py-1.5 text-xs font-semibold bg-zinc-800 text-white rounded-lg shadow-sm">{t('board')}</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300">{t('list')}</button>
          </div>
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            <Plus size={14} /> {t('add_opportunity')}
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-8 flex gap-6 no-scrollbar">
          {stages.sort((a, b) => a.order - b.order).map(stage => {
            const stageDeals = deals.filter(d => d.stageId === stage.id);
            const stageTotal = stageDeals.reduce((acc, d) => acc + d.value, 0);

            return (
              <div key={stage.id} className="min-w-[320px] w-[320px] flex flex-col group">
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></div>
                    <h3 className="font-bold text-sm tracking-wide uppercase text-zinc-400">{t(stage.id)}</h3>
                    <span className="bg-zinc-900 px-2 py-0.5 rounded-full text-[10px] text-zinc-500 font-bold border border-zinc-800">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-500">{stageTotal ? `$${stageTotal.toLocaleString()}` : '$0'}</span>
                </div>

                <SortableContext
                  id={stage.id}
                  items={stageDeals.map(d => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <DroppableStage
                    stage={stage}
                    stageDeals={stageDeals}
                    getClientName={getClientName}
                    openAddModal={openAddModal}
                    t={t}
                  />
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-zinc-900 border border-indigo-500/50 p-4 rounded-xl shadow-2xl rotate-3 scale-105 pointer-events-none">
              <h4 className="text-sm font-semibold">{deals.find(d => d.id === activeId)?.title}</h4>
              <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase">
                ${deals.find(d => d.id === activeId)?.value.toLocaleString()}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddDealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialStageId={selectedStageId}
      />
    </div>
  );
};

export default PipelineView;

