import React, { useState } from 'react';
import {
  Target,
  Plus,
  ArrowRight,
  MessageSquare,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Trash2,
  MoveRight,
  Sparkles,
  Phone,
  Mail,
  Calculator,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CrmStage, Lead } from '../../types';

export const CrmView: React.FC = () => {
  const { leads, trips, addLead, updateLeadStage, convertLeadToBooking, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadForConversion, setSelectedLeadForConversion] = useState<Lead | null>(null);
  const [convertTripId, setConvertTripId] = useState<string>(trips[0]?.id || '');

  // Form State
  const [form, setForm] = useState<{
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
    source: Lead['source'];
    stage: CrmStage;
    tripInterest: string;
    estimatedValue: number;
    assignedTo: string;
    notes: string;
  }>({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    source: 'whatsapp',
    stage: 'novo_lead',
    tripInterest: 'Porto Seguro',
    estimatedValue: 1890,
    assignedTo: 'Rodrigo Santoro',
    notes: '',
  });

  const columns: { id: CrmStage; label: string; color: string }[] = [
    { id: 'novo_lead', label: '1. Novo Lead', color: 'border-blue-400 bg-blue-50/30' },
    { id: 'contato', label: '2. Contato Feito', color: 'border-cyan-400 bg-cyan-50/30' },
    { id: 'interessado', label: '3. Interessado', color: 'border-indigo-400 bg-indigo-50/30' },
    { id: 'orcamento', label: '4. Orçamento', color: 'border-purple-400 bg-purple-50/30' },
    { id: 'negociacao', label: '5. Negociação', color: 'border-amber-400 bg-amber-50/30' },
    { id: 'pagamento', label: '6. Pagamento', color: 'border-orange-400 bg-orange-50/30' },
    { id: 'venda', label: '7. Venda Concluída', color: 'border-emerald-400 bg-emerald-50/30' },
    { id: 'pos_venda', label: '8. Pós-Venda', color: 'border-slate-400 bg-slate-50/30' },
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('Nome e telefone são obrigatórios');
      return;
    }
    addLead(form);
    setIsModalOpen(false);
  };

  const handleConfirmConversion = () => {
    if (!selectedLeadForConversion || !convertTripId) return;
    convertLeadToBooking(selectedLeadForConversion.id, convertTripId);
    setSelectedLeadForConversion(null);
  };

  // Move lead to next stage
  const moveNext = (lead: Lead) => {
    const currentIndex = columns.findIndex((c) => c.id === lead.stage);
    if (currentIndex < columns.length - 1) {
      updateLeadStage(lead.id, columns[currentIndex + 1].id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CRM & Funil de Vendas</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {leads.length} Oportunidades
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Do primeiro contato via WhatsApp até o pós-venda. Converta leads em reservas com 1 clique!
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>+ Novo Lead</span>
        </button>
      </div>

      {/* Kanban Board (Requisito #24: 8 Colunas) */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.id);
          const colTotalValue = colLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

          return (
            <div
              key={col.id}
              className={`min-w-68 max-w-68 rounded-2xl border ${col.color} p-3 flex flex-col justify-between shrink-0 bg-white/70 shadow-2xs`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">{col.label}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      R$ {colTotalValue.toLocaleString('pt-BR')} ({colLeads.length})
                    </p>
                  </div>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                    {colLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 min-h-60 max-h-[65vh] overflow-y-auto pr-1">
                  {colLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 italic">
                      Nenhum lead nesta etapa
                    </div>
                  ) : (
                    colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{lead.name}</h4>
                            <span className="text-[10px] font-semibold text-blue-700">
                              {lead.tripInterest || 'Interesse geral'}
                            </span>
                          </div>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 uppercase">
                            {lead.source}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" /> {lead.phone}
                          </p>
                          {lead.estimatedValue && (
                            <p className="font-extrabold text-emerald-700">
                              R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>

                        {lead.notes && (
                          <p className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            {lead.notes}
                          </p>
                        )}

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          <a
                            href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}?text=Olá,%20*${encodeURIComponent(
                              lead.name
                            )}*!%20Tudo%20bem?%20Aqui%20é%20da%20agência%20sobre%20seu%20interesse%20em%20*${encodeURIComponent(
                              lead.tripInterest || 'nossas viagens'
                            )}*.`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Conversar no WhatsApp"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </a>

                          {/* Quick Convert Button (Regra de Ouro #52) */}
                          {lead.stage !== 'venda' && (
                            <button
                              onClick={() => {
                                setSelectedLeadForConversion(lead);
                              }}
                              className="rounded-lg bg-blue-50 text-blue-700 px-2 py-1 text-[10px] font-bold hover:bg-blue-100"
                              title="Converter este lead em cliente e emitir reserva"
                            >
                              Converter
                            </button>
                          )}

                          {/* Move to next stage */}
                          {col.id !== 'pos_venda' && (
                            <button
                              onClick={() => moveNext(lead)}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                              title="Avançar etapa"
                            >
                              <MoveRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Novo Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">+ Cadastrar Oportunidade / Lead</h3>
            <p className="text-xs text-slate-500 mb-4">Adicione um novo contato interessado para o funil comercial.</p>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Lead *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Amanda Fonseca"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Canal de Origem</label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram Direct</option>
                    <option value="site">Formulário do Site</option>
                    <option value="indicacao">Indicação</option>
                    <option value="google">Google / Anúncios</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Viagem de Interesse</label>
                  <input
                    type="text"
                    value={form.tripInterest}
                    onChange={(e) => setForm({ ...form, tripInterest: e.target.value })}
                    placeholder="Ex: Porto Seguro ou Capitólio"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={form.estimatedValue}
                    onChange={(e) => setForm({ ...form, estimatedValue: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações do Contato</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Ex: Perguntou se parcela em até 4x no boleto."
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Salvar no Funil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Conversão Rápida de Lead para Venda (Regra de Ouro #52) */}
      {selectedLeadForConversion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Converter Lead em Cliente & Reserva Automática
            </h3>
            <p className="text-xs text-slate-600">
              O sistema cadastrará <b>{selectedLeadForConversion.name}</b> como cliente, criará o viajante e emitirá a
              reserva na viagem escolhida sem redigitação manual.
            </p>

            <div>
              <label className="block font-bold text-xs text-slate-700 mb-1">Selecione a Viagem:</label>
              <select
                value={convertTripId}
                onChange={(e) => setConvertTripId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (R$ {t.price.toLocaleString('pt-BR')})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedLeadForConversion(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmConversion}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Confirmar Conversão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
