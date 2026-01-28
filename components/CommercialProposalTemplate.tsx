import React from 'react';
import { Client, ProposalItem } from '../types';
import { useStore } from '../store';

interface CommercialProposalTemplateProps {
    proposalId?: string;
    client: Client;
    items: ProposalItem[];
    subtotal: number;
    shipping: number;
    total: number;
    date: string;
}

const CommercialProposalTemplate: React.FC<CommercialProposalTemplateProps> = ({
    proposalId,
    client,
    items,
    subtotal,
    shipping,
    total,
    date
}) => {
    const { proposalCustomization } = useStore();

    return (
        <div id="proposal-template" className="bg-white text-[9px] text-zinc-800 font-sans p-0 leading-tight min-h-[1100px] flex flex-col">
            {/* 1. Official Header Banner (Full Width) */}
            <div className="w-full relative">
                <img
                    src="/header_banner.png"
                    alt="Header Banner"
                    className="w-full h-auto block"
                    style={{ display: 'block' }}
                />
            </div>

            {/* 2. Brands Banner (formerly the blue bar) */}
            {/* We now use a clean white or transparent background to avoid the 'box' look */}
            <div className="px-10 py-1 flex justify-center items-center min-h-[30px] border-b border-zinc-100">
                {proposalCustomization.brandsImage && proposalCustomization.brandsImage !== '/brands-placeholder.png' ? (
                    <img
                        src={proposalCustomization.brandsImage}
                        alt="Marcas Representadas"
                        className="h-8 w-auto max-w-full object-contain"
                    />
                ) : (
                    <div className="flex gap-4">
                        {['Aputure', 'SCREAM', 'AMARAN', 'YC ONION', 'GODOX', 'ACCSOON', 'DZOFILM', '7ARTISANS', 'DEITY', 'SWIT'].map(brand => (
                            <span key={brand} className="text-[6px] text-zinc-300 font-black tracking-widest uppercase">{brand}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Proposal Info Bar */}
            <div className="px-10 py-3 grid grid-cols-12 bg-zinc-50 border-b border-zinc-200 text-[8px] uppercase font-bold">
                <div className="col-span-3">Nº ORÇAMENTO: <span className="text-[#00A896] ml-1">{proposalId || 'DRAFT'}</span></div>
                <div className="col-span-2">DATA: <span className="text-[#002b45] ml-1">{date}</span></div>
                <div className="col-span-3">COMERCIAL: <span className="text-[#002b45] ml-1">PAULO FERNANDO</span></div>
                <div className="col-span-4 text-right">E-MAIL: <span className="text-[#002b45] ml-1">paulo.fernando@mcistore.com.br</span></div>
            </div>

            {/* 4. Client Information */}
            <div className="px-10 py-6">
                <div className="grid grid-cols-12 gap-px bg-zinc-200 border border-zinc-200 rounded-sm overflow-hidden">
                    <div className="col-span-8 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1 text-[7px]">Cliente:</span>
                        <p className="font-bold text-zinc-600 ml-1 text-xs">{client.name}</p>
                    </div>
                    <div className="col-span-4 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1 text-[7px]">Contato / Bairro:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.neighborhood || '--'}</p>
                    </div>

                    <div className="col-span-6 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1 text-[7px]">Endereço:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.address || '--'}, {client.number || '--'}</p>
                    </div>
                    <div className="col-span-3 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1 text-[7px]">CNPJ / CPF:</span>
                        <p className="font-bold text-zinc-600 ml-1">{client.taxId || '--'}</p>
                    </div>
                    <div className="col-span-3 bg-white p-3">
                        <span className="text-[#002b45] font-black uppercase inline-block mb-1 text-[7px]">E-mail:</span>
                        <p className="font-bold text-zinc-600 lowercase ml-1">{client.email}</p>
                    </div>
                </div>
            </div>

            {/* 5. Products Table */}
            <div className="px-10 flex-1">
                <table className="w-full border-collapse border border-zinc-200">
                    <thead>
                        <tr className="bg-[#002b45] text-white text-[7px] font-black uppercase tracking-tighter">
                            <th className="p-2 border border-zinc-600 text-center w-8">ITEM</th>
                            <th className="p-2 border border-zinc-600 text-left w-12">COD</th>
                            <th className="p-2 border border-zinc-600 text-center w-8">QTD</th>
                            <th className="p-2 border border-zinc-600 text-left w-24">MODELO</th>
                            <th className="p-2 border border-zinc-600 text-left w-16">MARCA</th>
                            <th className="p-2 border border-zinc-600 text-left">ESPECIFICAÇÕES</th>
                            <th className="p-2 border border-zinc-600 text-right w-20">V.UNIT</th>
                            <th className="p-2 border border-zinc-600 text-right w-12">DESC.</th>
                            <th className="p-2 border border-zinc-600 text-center w-12">UND</th>
                            <th className="p-2 border border-zinc-600 text-right w-24">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length > 0 ? items.map((item, index) => (
                            <tr key={index} className="text-[8px] font-bold hover:bg-zinc-50">
                                <td className="p-2 border border-zinc-200 text-center text-[#00A896]">{(index + 1).toString().padStart(2, '0')}</td>
                                <td className="p-2 border border-zinc-200 text-zinc-400">{item.code}</td>
                                <td className="p-2 border border-zinc-200 text-center">{item.quantity}</td>
                                <td className="p-2 border border-zinc-200 uppercase bg-zinc-50/30 text-[7px]">{item.name}</td>
                                <td className="p-2 border border-zinc-200 text-zinc-400">{item.manufacturer}</td>
                                <td className="p-2 border border-zinc-200 text-[6px] leading-tight text-zinc-500 italic max-w-[150px]">
                                    {item.description}
                                </td>
                                <td className="p-2 border border-zinc-200 text-right">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td className="p-2 border border-zinc-200 text-right text-red-500">0%</td>
                                <td className="p-2 border border-zinc-200 text-center">UN</td>
                                <td className="p-2 border border-zinc-200 text-right text-[#002b45] text-sm">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        )) : (
                            <tr className="h-8">
                                <td colSpan={10} className="border border-zinc-100 text-center text-zinc-300 italic">Adicione produtos para visualizar</td>
                            </tr>
                        )}
                        {[...Array(Math.max(0, 5 - (items?.length || 0)))].map((_, i) => (
                            <tr key={i} className="h-8">
                                {[...Array(10)].map((_, j) => (
                                    <td key={j} className="border border-zinc-100"></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 6. Footer: Observations and Totals */}
            <div className="px-10 py-8 grid grid-cols-12 gap-10 mt-auto">
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
                        <div className="h-16 border border-dotted border-zinc-300 p-3 italic text-zinc-400 text-[7px] leading-snug">
                            Válido por 5 dias. Frete não incluso.
                            Garantia de conformidade conforme termos contratuais.
                            Pagamento em 6 boletos mediante análise de crédito.
                        </div>
                    </div>
                </div>

                <div className="col-span-5 flex flex-col items-end pt-4">
                    <div className="w-full space-y-4">
                        <div className="flex justify-between items-center text-[8px] border-b border-zinc-100 pb-2">
                            <span className="text-zinc-400 font-black uppercase tracking-widest">SUBTOTAL:</span>
                            <span className="font-bold text-zinc-800">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center text-[8px] border-b border-zinc-100 pb-2">
                            <span className="text-zinc-400 font-black uppercase tracking-widest">FRETE:</span>
                            <span className="font-bold text-zinc-800">R$ {shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#002b45] text-white p-4 rounded-sm shadow-lg">
                            <span className="font-black uppercase tracking-[0.2em] text-[10px]">TOTAL + FRETE:</span>
                            <span className="text-xl font-bold italic tracking-tighter">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <p className="mt-8 text-[6px] text-zinc-400 text-right italic leading-tight">
                        O documento é confidencial e de propriedade da empresa. Não pode ser copiado, mesmo que em parte, sem permissão.
                    </p>
                </div>
            </div>

            {/* 7. Signature Section */}
            <div className="px-10 pb-8 mt-4 grid grid-cols-2 gap-20">
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
