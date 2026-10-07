import React, { useState } from 'react';
import {
  BookmarkCheck,
  Plus,
  Search,
  DollarSign,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  ChevronRight,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReservationStatus } from '../../types';

export const ReservationsView: React.FC = () => {
  const {
    reservations,
    customers,
    travelers,
    trips,
    installments,
    addReservation,
    updateReservationStatus,
    generateContractForReservation,
    setCurrentView,
    setSelectedTripId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Reservation Form State
  const [formData, setFormData] = useState<{
    customerId: string;
    tripId: string;
    selectedTravelerIds: string[];
    discount: number;
    paymentMethod: 'pix' | 'cartao_credito' | 'boleto' | 'transferencia' | 'dinheiro';
    installmentCount: number;
    notes: string;
  }>({
    customerId: customers[0]?.id || '',
    tripId: trips[0]?.id || '',
    selectedTravelerIds: [],
    discount: 0,
    paymentMethod: 'pix',
    installmentCount: 1,
    notes: '',
  });

  const selectedTrip = trips.find((t) => t.id === formData.tripId) || trips[0];
  const unitPrice = selectedTrip ? selectedTrip.price : 0;
  const travelersCount = formData.selectedTravelerIds.length;
  const subtotal = unitPrice * travelersCount;
  const finalPrice = Math.max(0, subtotal - formData.discount);

  // Available travelers for the selected customer
  const customerTravelers = travelers.filter((t) => t.customerId === formData.customerId);

  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.selectedTravelerIds.length === 0) {
      alert('Selecione pelo menos 1 viajante para esta reserva.');
      return;
    }

    addReservation({
      customerId: formData.customerId,
      tripId: formData.tripId,
      travelerIds: formData.selectedTravelerIds,
      totalValue: subtotal,
      discount: formData.discount,
      finalValue: finalPrice,
      paymentMethod: formData.paymentMethod,
      installmentCount: formData.installmentCount,
      notes: formData.notes,
    });

    setIsModalOpen(false);
  };

  const filteredReservations = reservations.filter((r) => {
    const cust = customers.find((c) => c.id === r.customerId);
    const trip = trips.find((t) => t.id === r.tripId);
    const matchSearch =
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      cust?.name.toLowerCase().includes(search.toLowerCase()) ||
      trip?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === 'todos' || r.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const statusBadges: Record<ReservationStatus, { label: string; color: string }> = {
    pre_reserva: { label: 'Pré-Reserva', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    aguardando_pagamento: { label: 'Aguardando Pagamento', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    confirmada: { label: 'Confirmada', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    parcialmente_paga: { label: 'Parcialmente Paga', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    paga: { label: 'Paga 100%', color: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold' },
    cancelada: { label: 'Cancelada', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    lista_espera: { label: 'Lista de Espera', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reservas & Vendas</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {reservations.length} reservas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestão unificada de vendas, passageiros vinculados, parcelamento financeiro e contratos.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              customerId: customers[0]?.id || '',
              tripId: trips[0]?.id || '',
              selectedTravelerIds: [],
              discount: 0,
              paymentMethod: 'pix',
              installmentCount: 1,
              notes: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>+ NOVA RESERVA</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código (ex: RES-1001), cliente ou destino..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['todos', 'paga', 'confirmada', 'parcialmente_paga', 'aguardando_pagamento', 'lista_espera'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'todos' ? 'Todos' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-3.5">Código</th>
                <th className="p-3.5">Cliente Comprador</th>
                <th className="p-3.5">Viagem / Destino</th>
                <th className="p-3.5">Passageiros</th>
                <th className="p-3.5">Valor Final</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ações Operacionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.map((res) => {
                const cust = customers.find((c) => c.id === res.customerId);
                const trip = trips.find((t) => t.id === res.tripId);
                const resInstallments = installments.filter((i) => i.reservationId === res.id);
                const paidCount = resInstallments.filter((i) => i.status === 'pago').length;

                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-700">{res.code}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{cust?.name || 'Cliente'}</p>
                      <p className="text-[11px] text-slate-500">{cust?.phone}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="font-medium text-slate-800">{trip?.name}</p>
                      <p className="text-[11px] text-slate-500">Saída: {trip?.departureDate}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">{res.travelerDetails.length} viajante(s)</span>
                      <div className="flex gap-1 mt-0.5">
                        {res.travelerDetails.map((td, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600"
                            title={`Assento: ${td.seatNumber || 'Não atribuído'}`}
                          >
                            {td.seatNumber || 'S/A'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-extrabold text-slate-900">
                        R$ {res.finalValue.toLocaleString('pt-BR')}
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase">
                        {paidCount}/{resInstallments.length} parcelas pagas ({res.paymentMethod})
                      </p>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-extrabold border ${
                          statusBadges[res.status]?.color || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {statusBadges[res.status]?.label || res.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            generateContractForReservation(res.id);
                            setCurrentView('contracts');
                          }}
                          className="rounded-lg bg-slate-100 text-slate-700 px-2 py-1 text-[11px] font-bold hover:bg-slate-200"
                          title="Gerar e assinar contrato"
                        >
                          Contrato
                        </button>
                        <a
                          href={`https://wa.me/55${cust?.whatsapp?.replace(/\D/g, '') || ''}?text=Olá,%20*${encodeURIComponent(
                            cust?.name || 'Cliente'
                          )}*!%20Sua%20reserva%20*${res.code}*%20para%20*${encodeURIComponent(
                            trip?.name || ''
                          )}*%20está%20confirmada!`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-emerald-600 text-white px-2 py-1 text-[11px] font-bold hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Reserva */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">+ Nova Reserva / Venda</h3>
                <p className="text-xs text-slate-500">Selecione o comprador, a viagem e vincule os passageiros.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="space-y-4 text-xs">
              {/* Seleção do Cliente e Viagem */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cliente Comprador (Pagador) *</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) =>
                      setFormData({ ...formData, customerId: e.target.value, selectedTravelerIds: [] })
                    }
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (CPF {c.cpf})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Viagem / Saída *</label>
                  <select
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-medium"
                  >
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (R$ {t.price.toLocaleString('pt-BR')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seleção de Viajantes do Cliente (Requisito #10: Um comprador para vários passageiros) */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-blue-900">
                    Selecione os Passageiros ({formData.selectedTravelerIds.length} selecionados):
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('travelers')}
                    className="text-[11px] font-bold text-blue-700 hover:underline"
                  >
                    + Novo Viajante
                  </button>
                </div>

                {customerTravelers.length === 0 ? (
                  <p className="text-[11px] text-slate-500 italic">
                    Nenhum viajante vinculado a este comprador ainda. Adicione passageiros no cadastro.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {customerTravelers.map((t) => {
                      const isChecked = formData.selectedTravelerIds.includes(t.id);
                      return (
                        <label
                          key={t.id}
                          className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-slate-200 cursor-pointer hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedTravelerIds: [...formData.selectedTravelerIds, t.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedTravelerIds: formData.selectedTravelerIds.filter((id) => id !== t.id),
                                });
                              }
                            }}
                            className="rounded h-4 w-4 text-blue-600"
                          />
                          <span className="font-bold text-slate-800">{t.name}</span>
                          <span className="text-[11px] text-slate-500">
                            (Doc: {t.documentType} {t.documentNumber})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Condições Financeiras: Desconto, Parcelas, Forma de Pagamento (Requisito #14) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="transferencia">Transferência</option>
                    <option value="dinheiro">Dinheiro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nº de Parcelas</label>
                  <select
                    value={formData.installmentCount}
                    onChange={(e) => setFormData({ ...formData, installmentCount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2"
                  >
                    <option value={1}>1x (À vista)</option>
                    <option value={2}>2x</option>
                    <option value={3}>3x</option>
                    <option value={4}>4x</option>
                    <option value={5}>5x</option>
                    <option value={6}>6x</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Desconto (R$)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 font-bold"
                  />
                </div>
              </div>

              {/* Resumo do Cálculo Automático */}
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-xs text-emerald-800">
                    {travelersCount} passageiro(s) x R$ {unitPrice.toLocaleString('pt-BR')} - R${' '}
                    {formData.discount.toLocaleString('pt-BR')} desc.
                  </span>
                  <p className="text-xl font-extrabold text-emerald-900">
                    Total Final: R$ {finalPrice.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="text-right text-emerald-800 font-bold text-xs">
                  {formData.installmentCount > 1
                    ? `${formData.installmentCount}x de R$ ${(finalPrice / formData.installmentCount).toFixed(2)}`
                    : 'Pagamento à vista'}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Confirmar Reserva e Gerar Faturas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
