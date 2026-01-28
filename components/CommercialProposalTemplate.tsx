
import React from 'react';
import { Client, Deal } from '../types';
import { useStore } from '../store';

interface CommercialProposalTemplateProps {
    deal: Deal;
    client: Client;
    date: string;
}

const CommercialProposalTemplate: React.FC<CommercialProposalTemplateProps> = ({ deal, client, date }) => {
    const { proposalCustomization } = useStore();

    return (
        <div className="bg-white text-[9px] text-zinc-800 font-sans p-0 leading-tight">
            {/* Header / Top Bar */}
            <div className="text-center py-2">
                <h1 className="text-sm font-black text-[#00A896] tracking-[0.2em] uppercase">
                    ORDEM DE COMPRA / ORÇAMENTO
                </h1>
            </div>

            {/* Header Content */}
            <div className="px-10 py-4 flex justify-between items-center bg-[#fafafa]/50 border-b border-zinc-100">
                <div className="flex items-center gap-10">
                    {/* Styled P/MC Logo Placeholder */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 flex items-center justify-center text-[#00A896]">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14">
                                <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M15.59,7.41L14.17,6l-4.24,4.24l1.41,1.41L15.59,7.41z M11.34,15.76l-2.12-2.12l-1.41,1.41l3.54,3.54l6.36-6.36 l-1.41-1.41L11.34,15.76z" />
                            </svg>
                        </div>
                        <img src="/logo.png" alt="MCI Logo" className="h-12 object-contain" />
                    </div>

                    {/* Contact Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[7px] font-bold uppercase">
                        <div className="flex flex-col">
                            <span className="text-[#00A896]">Ceará</span>
                            <span className="text-[#002b45]">(85) 3254-4700</span>
                        </div>
                        <div className="flex flex-col border-l border-zinc-200 pl-4">
                            <span className="text-[#00A896]">Miami 🇺🇸</span>
                            <span className="text-[#002b45]">+1 (786) 925-6661</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#00A896]">Santa Catarina</span>
                            <span className="text-[#002b45]">São Paulo</span>
                        </div>
                        <div className="flex flex-col border-l border-zinc-200 pl-4">
                            <span className="text-zinc-400">Mapa Digital</span>
                            <span className="text-zinc-500 tracking-tighter">Localizações Ativas</span>
                        </div>
                    </div>
                </div>

                {/* Stylized Map Component */}
                <div className="w-32 h-20 opacity-30 flex items-center justify-center">
                    <svg viewBox="0 0 200 120" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[#002b45]">
                        <path d="M50,40 Q80,20 120,50 T180,30" strokeDasharray="2,2" />
                        <circle cx="60" cy="45" r="2" fill="#00A896" />
                        <circle cx="100" cy="55" r="2" fill="#00A896" />
                        <circle cx="140" cy="65" r="2" fill="#00A896" />
                        <circle cx="170" cy="35" r="2" fill="#00A896" />
                    </svg>
                </div>
            </div>

            {/* Brands FAixa */}
            <div className="bg-[#002b45] px-10 py-2 flex justify-between items-center">
                {proposalCustomization.brandsImage && proposalCustomization.brandsImage !== '/brands-placeholder.png' ? (
                    <img src={proposalCustomization.brandsImage} alt="Marcas Representadas" className="h-4 object-contain brightness-0 invert" />
                ) : (
                    ['Aputure', 'SCREAM', 'AMARAN', 'YC ONION', 'GODOX', 'ACCSOON', 'DZOFILM', '7ARTISANS', 'DEITY', 'SWIT'].map(brand => (
                        <span key={brand} className="text-[7px] text-zinc-100 font-black tracking-widest uppercase">{brand}</span>
                    ))
                )}
            </div>

            {/* Budget Header Meta */}
            <div className="px-10 py-3 grid grid-cols-12 bg-zinc-50 border-b border-zinc-200 text-[8px] uppercase font-bold">
                <div className="col-span-3">Nº ORÇAMENTO: <span className="text-[#00A896] ml-1">{deal.id.slice(0, 8).toUpperCase()}</span></div>
                <div className="col-span-2">DATA: <span className="text-[#002b45] ml-1">{date}</span></div>
                <div className="col-span-3">COMERCIAL: <span className="text-[#002b45] ml-1">PAULO FERNANDO</span></div>
                <div className="col-span-4 text-right">E-MAIL: <span className="text-[#002b45] ml-1">paulo.fernando@mcistore.com.br</span></div>
            </div>

            {/* Client Information Grid */}
            <div className="px-10 py-6">
                <div className="grid grid-cols-12 gap-px bg-zinc-200 border border-zinc-200 rounded-sm overflow-hidden">
                    <div className="col-span-8 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1">Cliente:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.name}</p>
                    </div>
                    <div className="col-span-4 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1">Contato:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.neighborhood || '--'}</p>
                    </div>

                    <div className="col-span-6 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1">Endereço:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.address || '--'}, {client.number || '--'}</p>
                    </div>
                    <div className="col-span-3 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1">CNPJ:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.taxId || '--'}</p>
                    </div>
                    <div className="col-span-3 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1">E-mails:</span>
                        <p className="font-bold text-zinc-600 lowercase ml-1">{client.email}</p>
                    </div>
                </div>
            </div>

            {/* Main Items Table */}
            <div className="px-10">
                <table className="w-full border-collapse border border-zinc-200">
                    <thead>
                        <tr className="bg-[#002b45] text-white text-[7px] font-black uppercase tracking-tighter">
                            <th className="p-2 border border-zinc-600 text-center w-8">ITEM</th>
                            <th className="p-2 border border-zinc-600 text-left w-12">COD</th>
                            <th className="p-2 border border-zinc-600 text-center w-8">QTD</th>
                            <th className="p-2 border border-zinc-600 text-left w-24">MODELO</th>
                            <th className="p-2 border border-zinc-600 text-left w-16">MARCA</th>
                            <th className="p-2 border border-zinc-600 text-left">ESPECIFICAÇÕES</th>
                            <th className="p-2 border border-zinc-600 text-right w-20">Unid.Vend.</th>
                            <th className="p-2 border border-zinc-600 text-right w-12">Desc.</th>
                            <th className="p-2 border border-zinc-600 text-center w-12">UND</th>
                            <th className="p-2 border border-zinc-600 text-right w-24">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-[8px] font-bold hover:bg-zinc-50">
                            <td className="p-3 border border-zinc-200 text-center text-[#00A896]">01</td>
                            <td className="p-3 border border-zinc-200 text-zinc-400">5369</td>
                            <td className="p-3 border border-zinc-200 text-center">01</td>
                            <td className="p-3 border border-zinc-200 uppercase bg-zinc-50/30">{deal.title}</td>
                            <td className="p-3 border border-zinc-200 text-zinc-400">MCI</td>
                            <td className="p-3 border border-zinc-200 text-[7px] leading-relaxed text-zinc-500 italic">
                                LED monolight com chipset BLAIR-CG avançado. Garantia de implementação de 1 ano e suporte técnico premium especializado.
                            </td>
                            <td className="p-3 border border-zinc-200 text-right">R$ {deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 border border-zinc-200 text-right text-red-500">0%</td>
                            <td className="p-3 border border-zinc-200 text-center">UN</td>
                            <td className="p-3 border border-zinc-200 text-right text-[#002b45] text-sm">R$ {deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        </tr>
                        {/* Empty Space rows for formal look */}
                        {[...Array(6)].map((_, i) => (
                            <tr key={i} className="h-8">
                                {[...Array(10)].map((_, j) => (
                                    <td key={j} className="border border-zinc-100"></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary and Footer */}
            <div className="px-10 py-8 grid grid-cols-12 gap-10">
                {/* Left Side: Payment & Observations */}
                <div className="col-span-7 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-[8px]">
                        <div>
                            <span className="text-zinc-400 font-black uppercase block mb-1">Previsão de entrega:</span>
                            <p className="font-bold text-[#002b45]">7 dias úteis</p>
                        </div>
                        <div>
                            <span className="text-zinc-400 font-black uppercase block mb-1">Condições de Pagamento:</span>
                            <p className="font-bold text-[#002b45]">À vista / Boleto / Pix</p>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm">
                        <span className="text-[#002b45] font-black uppercase text-[8px] block mb-2">Dados bancários:</span>
                        <div className="text-[8px] text-zinc-600 space-y-0.5">
                            <p className="font-bold">BANCO {proposalCustomization.bankName}</p>
                            <p>Agência: <span className="font-bold text-zinc-800">{proposalCustomization.bankAgency}</span> | Conta: <span className="font-bold text-zinc-800">{proposalCustomization.bankAccount}</span></p>
                            <p>Titular: <span className="font-bold text-zinc-800">{proposalCustomization.bankOwner}</span></p>
                            <p>Chave PIX: <span className="font-bold text-[#00A896]">{proposalCustomization.pixKey}</span></p>
                        </div>
                    </div>

                    <div>
                        <span className="text-[#002b45] font-black uppercase text-[8px] block mb-2">OBSERVAÇÕES:</span>
                        <div className="h-20 border border-dotted border-zinc-300 p-3 italic text-zinc-400 text-[7px] leading-snug">
                            Válido por 5 dias. Frete não incluso.
                            Garantia de conformidade conforme termos contratuais.
                            Pagamento em 6 boletos mediante análise de crédito.
                        </div>
                    </div>
                </div>

                {/* Right Side: Totals */}
                <div className="col-span-5 flex flex-col items-end pt-4">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-[8px] border-b border-zinc-100 pb-2">
                            <span className="text-zinc-400 font-black uppercase tracking-widest">SUBTOTAL:</span>
                            <span className="font-bold text-zinc-800">R$ {deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] border-b border-zinc-100 pb-2">
                            <span className="text-zinc-400 font-black uppercase tracking-widest">FRETE:</span>
                            <span className="font-bold text-zinc-800">R$ 0,00</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#002b45] text-white p-4 rounded-sm shadow-lg">
                            <span className="font-black uppercase tracking-[0.2em] text-[10px]">TOTAL + FRETE:</span>
                            <span className="text-xl font-bold italic tracking-tighter">R$ {deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <p className="mt-8 text-[6px] text-zinc-400 text-right italic leading-tight">
                        O documento é confidencial e de propriedade da empresa. Não pode ser copiado, mesmo que em parte, sem permissão.
                    </p>
                </div>
            </div>

            {/* Approval and Signature */}
            <div className="px-10 pb-12 mt-4 grid grid-cols-2 gap-20">
                <div className="text-center">
                    <div className="h-14 flex items-end justify-center">
                        <div className="w-full border-b border-zinc-400"></div>
                    </div>
                    <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest mt-2 block">DATA E ASSINATURA</span>
                </div>
                <div className="text-center">
                    <div className="p-2 border-2 border-dashed border-zinc-200 rounded-lg h-14 flex items-center justify-center italic text-zinc-300 text-[10px]">
                        Espace reservado para carimbo de aprovação
                    </div>
                    <span className="text-[7px] font-black text-zinc-400 uppercase tracking-widest mt-2 block">APROVAÇÃO DO CLIENTE</span>
                </div>
            </div>
        </div>
    );
};

export default CommercialProposalTemplate;
