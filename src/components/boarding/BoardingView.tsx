import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  Search,
  Users,
  MapPin,
  Calendar,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BoardingStatus } from '../../types';

export const BoardingView: React.FC = () => {
  const { trips, reservations, travelers, updateBoardingStatus, selectedTripId, setSelectedTripId } = useApp();

  const [activeTripId, setActiveTripId] = useState<string>(selectedTripId || trips[0]?.id || '');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const currentTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // Passengers list
  const tripReservations = reservations.filter((r) => r.tripId === currentTrip?.id && r.status !== 'cancelada');

  const passengers: {
    travelerId: string;
    reservationId: string;
    reservationCode: string;
    name: string;
    seatNumber?: string;
    phone: string;
    document: string;
    boardingStatus: BoardingStatus;
    boardingLocation?: string;
  }[] = [];

  tripReservations.forEach((res) => {
    res.travelerDetails.forEach((td) => {
      const trav = travelers.find((t) => t.id === td.travelerId);
      if (trav) {
        passengers.push({
          travelerId: trav.id,
          reservationId: res.id,
          reservationCode: res.code,
          name: trav.name,
          seatNumber: td.seatNumber,
          phone: trav.whatsapp || trav.phone,
          document: `${trav.documentType} ${trav.documentNumber}`,
          boardingStatus: td.boardingStatus,
          boardingLocation: td.boardingLocation || currentTrip?.departureLocation,
        });
      }
    });
  });

  // Sort by seat number or name
  passengers.sort((a, b) => (a.seatNumber || 'ZZ').localeCompare(b.seatNumber || 'ZZ'));

  // Counters
  const totalPassengers = passengers.length;
  const boardedCount = passengers.filter((p) => p.boardingStatus === 'embarcou').length;
  const missingCount = passengers.filter((p) => p.boardingStatus === 'nao_embarcou').length;
  const pendingCount = passengers.filter((p) => p.boardingStatus === 'pendente').length;
  const progressPct = totalPassengers > 0 ? ((boardedCount / totalPassengers) * 100).toFixed(0) : '0';

  // Filters
  const filtered = passengers.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.seatNumber && p.seatNumber.toLowerCase().includes(search.toLowerCase())) ||
      p.document.includes(search);
    const matchStatus = filterStatus === 'todos' || p.boardingStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lista de Embarque Operacional</h1>
            <span className="rounded-full bg-cyan-100 text-cyan-800 px-2.5 py-0.5 text-xs font-bold">
              Mobile-Friendly (Para o Guia)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Controle de presença no ponto de encontro e conferência de assentos em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeTripId}
            onChange={(e) => setActiveTripId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir Lista</span>
          </button>
        </div>
      </div>

      {/* Trip Information Card & Realtime Boarding Progress */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Viagem Selecionada</span>
            <h2 className="text-lg font-black text-slate-900">{currentTrip?.name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              Embarque: {currentTrip?.departureLocation} • Saída: {currentTrip?.departureTime}
            </p>
          </div>

          {/* Live Counter Widget */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase">Embarcados</span>
              <p className="text-xl font-black text-emerald-600">{boardedCount}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] text-amber-700 font-bold uppercase">Pendentes</span>
              <p className="text-xl font-black text-amber-600">{pendingCount}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Total</span>
              <p className="text-xl font-black text-slate-800">{totalPassengers}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-slate-700">{boardedCount} de {totalPassengers} passageiros no ônibus</span>
            <span className="text-blue-600">{progressPct}% pronto</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por passageiro, assento (ex: 01A) ou documento..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'pendente', label: '⏳ Pendentes' },
            { id: 'embarcou', label: '✅ Embarcados' },
            { id: 'nao_embarcou', label: '❌ Não compareceu' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                filterStatus === st.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-Friendly Passenger Boarding Cards */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            Nenhum passageiro encontrado com os filtros atuais.
          </div>
        ) : (
          filtered.map((p, index) => (
            <div
              key={p.travelerId}
              className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${
                p.boardingStatus === 'embarcou'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : p.boardingStatus === 'nao_embarcou'
                  ? 'border-rose-200 bg-rose-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-mono text-sm font-black shadow-xs ${
                    p.seatNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                  title={p.seatNumber ? `Assento ${p.seatNumber}` : 'Sem assento atribuído'}
                >
                  {p.seatNumber || 'S/A'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{p.name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Doc: {p.document} • Reserva: <span className="font-mono">{p.reservationCode}</span>
                  </p>
                </div>
              </div>

              {/* Status Action Buttons (Requisito #20: 1 toque no celular) */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* WhatsApp button to quickly reach delayed passenger */}
                <a
                  href={`https://wa.me/55${p.phone.replace(/\D/g, '')}?text=Olá,%20*${encodeURIComponent(
                    p.name
                  )}*!%20Estamos%20no%20ponto%20de%20embarque%20para%20a%20viagem%20*${encodeURIComponent(
                    currentTrip?.name || ''
                  )}*.%20Você%20já%20está%20chegando?`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  title="Falar no WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </a>

                {/* Status Toggle Buttons */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  <button
                    onClick={() => updateBoardingStatus(p.reservationId, p.travelerId, 'embarcou')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      p.boardingStatus === 'embarcou'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    ✅ Embarcou
                  </button>

                  <button
                    onClick={() => updateBoardingStatus(p.reservationId, p.travelerId, 'pendente')}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                      p.boardingStatus === 'pendente'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    ⏳ Pendente
                  </button>

                  <button
                    onClick={() => updateBoardingStatus(p.reservationId, p.travelerId, 'nao_embarcou')}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                      p.boardingStatus === 'nao_embarcou'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white'
                    }`}
                  >
                    ❌ Não veio
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
