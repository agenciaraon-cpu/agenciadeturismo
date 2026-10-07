import React from 'react';
import {
  TrendingUp,
  Plane,
  Users,
  BookmarkCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Sparkles,
  Calendar,
  ExternalLink,
  ChevronRight,
  Wallet,
  DollarSign,
  ArrowDownRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    trips,
    customers,
    travelers,
    reservations,
    installments,
    expenses,
    documents,
    contracts,
    setCurrentView,
    setSelectedTripId,
  } = useApp();

  // Metrics Calculations
  const activeTrips = trips.filter((t) => t.status === 'aberta' || t.status === 'lotada' || t.status === 'em_andamento');
  const totalReservations = reservations.filter((r) => r.status !== 'cancelada').length;
  const totalTravelers = travelers.length;

  const totalRevenue = reservations
    .filter((r) => r.status !== 'cancelada')
    .reduce((sum, r) => sum + r.finalValue, 0);

  const receivedAmount = installments
    .filter((i) => i.status === 'pago')
    .reduce((sum, i) => sum + (i.paidAmount || i.amount), 0);

  const pendingAmount = installments
    .filter((i) => i.status === 'pendente')
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueInstallments = installments.filter((i) => i.status === 'atrasado');
  const overdueAmount = overdueInstallments.reduce((sum, i) => sum + i.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const estimatedProfit = Math.max(0, totalRevenue - totalExpenses);
  const profitMarginPct = totalRevenue > 0 ? ((estimatedProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Pending Items
  const pendingDocs = documents.filter((d) => d.status === 'pendente' || d.status === 'recusado');
  const unsignedContracts = contracts.filter((c) => !c.signed);
  const incompleteReservations = reservations.filter((r) => r.status === 'aguardando_pagamento');

  // Attention Items
  const upcomingDueDateInstallments = installments.filter((i) => {
    if (i.status !== 'pendente') return false;
    const diffDays = Math.ceil((new Date(i.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  const highOccupancyTrips = trips.filter((t) => {
    const booked = reservations
      .filter((r) => r.tripId === t.id && r.status !== 'cancelada')
      .reduce((sum, r) => sum + r.travelerDetails.length, 0);
    const pct = t.capacity > 0 ? (booked / t.capacity) * 100 : 0;
    return pct >= 80;
  });

  // Completed Items
  const fullyPaidReservations = reservations.filter((r) => r.status === 'paga').length;
  const verifiedDocs = documents.filter((d) => d.status === 'recebido').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-xs">
                Painel Geral da Agência
              </span>
              <span className="text-xs text-slate-300">Atualizado em tempo real</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, equipe! Operação 100% pronta.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Venda, organize, cobre, opere e acompanhe todas as suas viagens em um único lugar, sem planilhas ou cadernos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentView('trips')}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 shadow-md hover:bg-slate-50 transition-all active:scale-98"
            >
              <Plus className="h-4 w-4 text-blue-600" />
              <span>+ Nova Viagem</span>
            </button>
            <button
              onClick={() => setCurrentView('reservations')}
              className="flex items-center gap-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 border border-blue-400/30 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all active:scale-98"
            >
              <BookmarkCheck className="h-4 w-4" />
              <span>+ Nova Reserva</span>
            </button>
            <button
              onClick={() => setCurrentView('ai')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md transition-all active:scale-98"
            >
              <Sparkles className="h-4 w-4" />
              <span>RAON IA Copilot</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* KPI 1: Viagens Ativas */}
        <div
          onClick={() => setCurrentView('trips')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Viagens Ativas</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Plane className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{activeTrips.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">{trips.length} no catálogo geral</p>
        </div>

        {/* KPI 2: Reservas & Passageiros */}
        <div
          onClick={() => setCurrentView('reservations')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-cyan-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reservas / Viajantes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{totalReservations} / {totalTravelers}</div>
          <p className="text-[11px] text-cyan-700 font-semibold mt-1">{customers.length} clientes compradores</p>
        </div>

        {/* KPI 3: Faturamento Total */}
        <div
          onClick={() => setCurrentView('finance')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Faturamento</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">R$ {totalRevenue.toLocaleString('pt-BR')}</div>
          <p className="text-[11px] text-slate-500 mt-1">Total vendido</p>
        </div>

        {/* KPI 4: Recebido vs A Receber */}
        <div
          onClick={() => setCurrentView('finance')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-amber-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Recebido / A Receber</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-slate-900">
            <span className="text-emerald-600">R$ {receivedAmount.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-400 font-medium"> / R$ {pendingAmount.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{installments.filter((i) => i.status === 'pago').length} parcelas pagas</p>
        </div>

        {/* KPI 5: Lucro Estimado & Margem */}
        <div
          onClick={() => setCurrentView('finance')}
          className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Lucro & Margem</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-700">R$ {estimatedProfit.toLocaleString('pt-BR')}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
              {profitMarginPct}% Margem
            </span>
          </div>
        </div>
      </div>

      {/* Central de Pendências (Requisito Crítico #5) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Central de Pendências</h2>
              <p className="text-xs text-slate-500">Triagem inteligente de prioridades operacionais da agência</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 🔴 Urgente */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">🔴 Urgente</h3>
              </div>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                {overdueInstallments.length + pendingDocs.length + unsignedContracts.length} ações
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {overdueInstallments.length > 0 ? (
                <div
                  onClick={() => setCurrentView('finance')}
                  className="cursor-pointer rounded-xl bg-white p-3 border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all"
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-rose-900">{overdueInstallments.length} parcelas em atraso</p>
                    <span className="text-[10px] font-bold text-rose-700">R$ {overdueAmount.toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">Ex: Parcela do cliente Renato Guimarães vencida.</p>
                  <button className="mt-2 text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1">
                    Cobrar no WhatsApp <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              ) : null}

              {pendingDocs.length > 0 ? (
                <div
                  onClick={() => setCurrentView('documents')}
                  className="cursor-pointer rounded-xl bg-white p-3 border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all"
                >
                  <p className="font-bold text-rose-900">{pendingDocs.length} documentos pendentes/recusados</p>
                  <p className="text-[11px] text-slate-600 mt-1">Viajantes precisam enviar RG para apólice e lista MTur.</p>
                  <button className="mt-2 text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1">
                    Ver documentos pendentes <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              ) : null}

              {unsignedContracts.length > 0 ? (
                <div
                  onClick={() => setCurrentView('contracts')}
                  className="cursor-pointer rounded-xl bg-white p-3 border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all"
                >
                  <p className="font-bold text-rose-900">{unsignedContracts.length} contrato(s) aguardando assinatura</p>
                  <p className="text-[11px] text-slate-600 mt-1">Disponibilize o link digital para o contratante.</p>
                </div>
              ) : null}
            </div>
          </div>

          {/* 🟡 Atenção */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">🟡 Atenção</h3>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                {upcomingDueDateInstallments.length + highOccupancyTrips.length} itens
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {upcomingDueDateInstallments.length > 0 && (
                <div
                  onClick={() => setCurrentView('finance')}
                  className="cursor-pointer rounded-xl bg-white p-3 border border-amber-200/70 shadow-2xs hover:shadow-xs transition-all"
                >
                  <p className="font-bold text-amber-900">{upcomingDueDateInstallments.length} parcelas vencendo em 7 dias</p>
                  <p className="text-[11px] text-slate-600 mt-1">Total a vencer: R$ {upcomingDueDateInstallments.reduce((s, i) => s + i.amount, 0).toLocaleString('pt-BR')}.</p>
                  <span className="mt-2 inline-block text-[10px] font-semibold text-amber-800">Lembrete amigável recomendado</span>
                </div>
              )}

              {highOccupancyTrips.length > 0 && (
                <div
                  onClick={() => setCurrentView('trips')}
                  className="cursor-pointer rounded-xl bg-white p-3 border border-amber-200/70 shadow-2xs hover:shadow-xs transition-all"
                >
                  <p className="font-bold text-amber-900">{highOccupancyTrips.length} viagem(ns) com vagas quase esgotadas</p>
                  <p className="text-[11px] text-slate-600 mt-1">Ex: Capitólio (100% lotada com 6 na lista de espera).</p>
                  <span className="mt-2 inline-block text-[10px] font-semibold text-amber-800">Considere abrir 2º ônibus</span>
                </div>
              )}
            </div>
          </div>

          {/* 🟢 Concluído */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">🟢 Concluído</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                100% regular
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="rounded-xl bg-white p-3 border border-emerald-200/70 shadow-2xs">
                <p className="font-bold text-emerald-900">{fullyPaidReservations} reservas totalmente quitadas</p>
                <p className="text-[11px] text-slate-600 mt-1">Valores conferidos e baixados no financeiro.</p>
              </div>

              <div className="rounded-xl bg-white p-3 border border-emerald-200/70 shadow-2xs">
                <p className="font-bold text-emerald-900">{verifiedDocs} documentos conferidos e válidos</p>
                <p className="text-[11px] text-slate-600 mt-1">RGs e autorizações de menores aprovados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Inteligência (Requisito #33) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-blue-50/50 p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Insight RAON IA</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            Você tem R$ {pendingAmount.toLocaleString('pt-BR')} a receber nos próximos 45 dias.
          </p>
          <p className="text-xs text-slate-600 mt-1.5">
            Fluxo de caixa positivo projetado para cobrir as faturas de hospedagem e transporte das viagens de Porto Seguro e Gramado.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-amber-50/50 p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Alerta de Ocupação</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            A viagem "Capitólio" atingiu 100% das vagas ocupadas.
          </p>
          <p className="text-xs text-slate-600 mt-1.5">
            6 pessoas aguardando na lista de espera. Recomenda-se acionar a Translider para cotar um micro-ônibus extra.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-emerald-50/50 p-4.5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <TrendingUp className="h-4 w-4" />
            <span>Rentabilidade</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            Margem média da agência em {profitMarginPct}%.
          </p>
          <p className="text-xs text-slate-600 mt-1.5">
            O pacote "Porto Seguro 5 Dias" lidera o lucro com retorno líquido projetado de R$ 29.440 sobre os custos operacionais.
          </p>
        </div>
      </div>

      {/* Próximas Viagens com Controle Visual de Vagas (Requisito #8) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Próximas Viagens em Andamento</h2>
            <p className="text-xs text-slate-500">Controle operacional de capacidade, passageiros e datas</p>
          </div>
          <button
            onClick={() => setCurrentView('trips')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            Ver todas as viagens <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trips.map((trip) => {
            const bookedTravelers = reservations
              .filter((r) => r.tripId === trip.id && r.status !== 'cancelada')
              .reduce((sum, r) => sum + r.travelerDetails.length, 0);

            const occupancyPct = trip.capacity > 0 ? ((bookedTravelers / trip.capacity) * 100).toFixed(1) : '0';
            const isFull = Number(occupancyPct) >= 100;

            return (
              <div
                key={trip.id}
                onClick={() => {
                  setSelectedTripId(trip.id);
                  setCurrentView('trip_detail');
                }}
                className="cursor-pointer rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all group bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 w-full overflow-hidden">
                    <img
                      src={trip.imageUrl}
                      alt={trip.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-lg bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {trip.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      {isFull ? (
                        <span className="rounded-lg bg-rose-600 text-white px-2 py-0.5 text-[10px] font-extrabold shadow-sm">
                          VIAGEM LOTADA
                        </span>
                      ) : (
                        <span className="rounded-lg bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-extrabold shadow-sm">
                          VAGAS ABERTAS
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        Saída: {new Date(trip.departureDate).toLocaleDateString('pt-BR')} • {trip.destination}
                      </p>
                    </div>

                    {/* Visual Capacity Bar (Requisito #8) */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-slate-700">
                          {bookedTravelers} / {trip.capacity} vagas ocupadas
                        </span>
                        <span className={`font-extrabold ${isFull ? 'text-rose-600' : 'text-blue-600'}`}>
                          {occupancyPct}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isFull ? 'bg-rose-500' : Number(occupancyPct) > 75 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, Number(occupancyPct))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Valor por pessoa</span>
                    <p className="font-bold text-slate-900">R$ {trip.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Operar <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
