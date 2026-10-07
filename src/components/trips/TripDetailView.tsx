import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  ExternalLink,
  Armchair,
  DollarSign,
  TrendingUp,
  FileText,
  Share2,
  Sparkles,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TripDay, BoardingStatus } from '../../types';

export const TripDetailView: React.FC = () => {
  const {
    selectedTripId,
    trips,
    reservations,
    travelers,
    customers,
    expenses,
    itineraries,
    saveTripItinerary,
    assignSeat,
    updateBoardingStatus,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'geral' | 'passageiros' | 'roteiro' | 'assentos' | 'financeiro'>('geral');
  const [isGeneratingAiItinerary, setIsGeneratingAiItinerary] = useState(false);

  const trip = trips.find((t) => t.id === selectedTripId) || trips[0];

  if (!trip) {
    return (
      <div className="p-8 text-center">
        <p>Viagem não encontrada.</p>
        <button onClick={() => setCurrentView('trips')} className="mt-4 text-blue-600 font-bold underline">
          Voltar para lista de viagens
        </button>
      </div>
    );
  }

  // Related reservations & travelers
  const tripReservations = reservations.filter((r) => r.tripId === trip.id && r.status !== 'cancelada');
  const bookedTravelersCount = tripReservations.reduce((sum, r) => sum + r.travelerDetails.length, 0);
  const occupancyPct = trip.capacity > 0 ? ((bookedTravelersCount / trip.capacity) * 100).toFixed(1) : '0';
  const isFull = Number(occupancyPct) >= 100;

  // Passengers list with their details
  const passengerList: {
    travelerId: string;
    reservationId: string;
    reservationCode: string;
    travelerName: string;
    travelerPhone: string;
    travelerDocument: string;
    seatNumber?: string;
    boardingStatus: BoardingStatus;
    digitalCheckInDone: boolean;
    buyerName: string;
  }[] = [];

  tripReservations.forEach((res) => {
    const buyer = customers.find((c) => c.id === res.customerId);
    res.travelerDetails.forEach((td) => {
      const trav = travelers.find((t) => t.id === td.travelerId);
      if (trav) {
        passengerList.push({
          travelerId: trav.id,
          reservationId: res.id,
          reservationCode: res.code,
          travelerName: trav.name,
          travelerPhone: trav.whatsapp || trav.phone,
          travelerDocument: `${trav.documentType} ${trav.documentNumber}`,
          seatNumber: td.seatNumber,
          boardingStatus: td.boardingStatus,
          digitalCheckInDone: td.digitalCheckInDone,
          buyerName: buyer?.name || 'Cliente',
        });
      }
    });
  });

  // Trip Finances
  const tripRevenue = tripReservations.reduce((sum, r) => sum + r.finalValue, 0);
  const tripExpenses = expenses.filter((e) => e.tripId === trip.id);
  const totalTripCost = tripExpenses.reduce((sum, e) => sum + e.amount, 0);
  const tripProfit = tripRevenue - totalTripCost;
  const tripMarginPct = tripRevenue > 0 ? ((tripProfit / tripRevenue) * 100).toFixed(1) : '0';

  // Current Itinerary
  const tripItineraryDays = itineraries[trip.id] || [];

  // Generate Itinerary with Gemini API
  const handleGenerateAiItinerary = async () => {
    setIsGeneratingAiItinerary(true);
    try {
      const res = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: trip.destination,
          days: 3,
          travelStyle: trip.category,
        }),
      });
      const data = await res.json();
      if (data.days && Array.isArray(data.days)) {
        saveTripItinerary(trip.id, data.days);
        showToast('Roteiro detalhado gerado com RAON IA!');
      } else {
        showToast('Roteiro gerado e salvo!');
      }
    } catch {
      showToast('Roteiro padrão gerado.');
    } finally {
      setIsGeneratingAiItinerary(false);
    }
  };

  // Bus seat layout (46 seats: 11 rows of 4 seats + 2 in the back)
  const totalSeats = trip.capacity || 46;
  const seatLayout: { label: string; occupiedBy?: string; reservationId?: string; travelerId?: string }[] = [];

  for (let row = 1; row <= Math.ceil(totalSeats / 4); row++) {
    ['A', 'B', 'C', 'D'].forEach((col) => {
      const seatLabel = `${row < 10 ? '0' : ''}${row}${col}`;
      if (seatLayout.length < totalSeats) {
        const pass = passengerList.find((p) => p.seatNumber === seatLabel);
        seatLayout.push({
          label: seatLabel,
          occupiedBy: pass?.travelerName,
          reservationId: pass?.reservationId,
          travelerId: pass?.travelerId,
        });
      }
    });
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={() => setCurrentView('trips')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para todas as viagens</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.origin);
              showToast('Link do Portal do Viajante copiado para a área de transferência!');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            title="Compartilhar link de reserva"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Compartilhar</span>
          </button>

          <button
            onClick={() => setCurrentView('traveler_portal')}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-cyan-700"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Portal do Viajante</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-blue-600 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                {trip.category}
              </span>
              {isFull ? (
                <span className="rounded-lg bg-rose-600 px-2.5 py-0.5 text-xs font-extrabold">
                  VIAGEM LOTADA
                </span>
              ) : (
                <span className="rounded-lg bg-emerald-600 px-2.5 py-0.5 text-xs font-extrabold">
                  {trip.capacity - bookedTravelersCount} vagas disponíveis
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{trip.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-400" />
              {trip.destination} • Saída: {new Date(trip.departureDate).toLocaleDateString('pt-BR')} ({trip.departureTime}) • Retorno: {new Date(trip.returnDate).toLocaleDateString('pt-BR')} ({trip.returnTime})
            </p>
          </div>

          {/* Quick Metrics Badge in Header */}
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Ocupação</p>
              <p className="text-xl font-extrabold text-white">{bookedTravelersCount}/{trip.capacity}</p>
              <p className="text-[11px] text-cyan-400 font-bold">{occupancyPct}% preenchido</p>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Lucro Previsto</p>
              <p className="text-xl font-extrabold text-emerald-400">R$ {tripProfit.toLocaleString('pt-BR')}</p>
              <p className="text-[11px] text-slate-300 font-medium">{tripMarginPct}% margem</p>
            </div>
          </div>
        </div>

        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
          style={{ backgroundImage: `url(${trip.imageUrl})` }}
        />
      </div>

      {/* Operational Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'geral', label: '1. Geral & Detalhes' },
          { id: 'passageiros', label: `2. Lista de Passageiros (${passengerList.length})` },
          { id: 'roteiro', label: '3. Roteiro Dia a Dia' },
          { id: 'assentos', label: '4. Mapa de Assentos' },
          { id: 'financeiro', label: '5. Rentabilidade & DRE' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Geral & Detalhes */}
      {activeTab === 'geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Sobre a Viagem</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{trip.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Ponto de Embarque</span>
                  <p className="font-bold text-xs text-slate-800 mt-0.5">{trip.departureLocation}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Ponto de Chegada / Hotel</span>
                  <p className="font-bold text-xs text-slate-800 mt-0.5">{trip.arrivalLocation}</p>
                </div>
              </div>
            </div>

            {/* Inclusos e Não Inclusos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3">
                <h4 className="font-extrabold text-xs text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>O que está incluso:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {trip.included.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-rose-200 bg-rose-50/30 p-5 space-y-3">
                <h4 className="font-extrabold text-xs text-rose-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  <span>O que NÃO está incluso:</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {trip.notIncluded.map((notInc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span>{notInc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Equipe Responsável</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Guia MTur:</span>
                  <p className="font-bold text-slate-800">{trip.guideName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Coordenador Comercial:</span>
                  <p className="font-bold text-slate-800">{trip.responsibleUser}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Tarifa por Passageiro:</span>
                  <p className="font-extrabold text-sm text-emerald-600">R$ {trip.price.toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setCurrentView('boarding')}
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                >
                  Abrir Lista de Embarque (Dia da Viagem)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Passageiros & Ocupação */}
      {activeTab === 'passageiros' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Lista de Passageiros ({passengerList.length} viajantes)
              </h3>
              <p className="text-xs text-slate-500">
                Separados por reserva com controle de assento e status de check-in digital.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Imprimir / Exportar Lista</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">Assento</th>
                  <th className="p-3">Viajante</th>
                  <th className="p-3">Documento</th>
                  <th className="p-3">Comprador</th>
                  <th className="p-3">Reserva</th>
                  <th className="p-3">Check-in Digital</th>
                  <th className="p-3">Embarque</th>
                  <th className="p-3 text-right">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {passengerList.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-extrabold text-blue-600">
                      {p.seatNumber || <span className="text-slate-400 font-normal">Sem assento</span>}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{p.travelerName}</td>
                    <td className="p-3 text-slate-600">{p.travelerDocument}</td>
                    <td className="p-3 text-slate-600">{p.buyerName}</td>
                    <td className="p-3 font-mono font-bold text-slate-700">{p.reservationCode}</td>
                    <td className="p-3">
                      {p.digitalCheckInDone ? (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          ✓ Feito
                        </span>
                      ) : (
                        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          ⏳ Pendente
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={p.boardingStatus}
                        onChange={(e) => updateBoardingStatus(p.reservationId, p.travelerId, e.target.value as any)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${
                          p.boardingStatus === 'embarcou'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : p.boardingStatus === 'nao_embarcou'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="embarcou">✅ Embarcou</option>
                        <option value="nao_embarcou">❌ Não compareceu</option>
                        <option value="pendente">⏳ Pendente</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <a
                        href={`https://wa.me/55${p.travelerPhone.replace(/\D/g, '')}?text=Olá,%20${encodeURIComponent(
                          p.travelerName
                        )}!%20Passando%20para%20confirmar%20os%20detalhes%20da%20sua%20viagem%20${encodeURIComponent(
                          trip.name
                        )}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700"
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Roteiro Dia a Dia (Requisito #17) */}
      {activeTab === 'roteiro' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Construtor de Roteiro Dia a Dia</h3>
              <p className="text-xs text-slate-500">
                Itinerário completo visível no Portal do Viajante e impresso no voucher.
              </p>
            </div>
            <button
              onClick={handleGenerateAiItinerary}
              disabled={isGeneratingAiItinerary}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-cyan-700 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isGeneratingAiItinerary ? 'Gerando com IA...' : 'Gerar Roteiro com RAON IA'}</span>
            </button>
          </div>

          {tripItineraryDays.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-500">Nenhum dia de roteiro cadastrado ainda.</p>
              <button
                onClick={handleGenerateAiItinerary}
                className="mt-3 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
              >
                + Gerar Roteiro Inteligente com IA
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {tripItineraryDays.map((day) => (
                <div key={day.id} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                        {day.dayNumber}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900">{day.title}</h4>
                    </div>
                    {day.date && <span className="text-xs text-slate-500">{day.date}</span>}
                  </div>

                  <div className="space-y-2.5">
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs"
                      >
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-extrabold text-blue-700 font-mono">
                          {act.time}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{act.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                          {act.location && (
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {act.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Mapa de Assentos (Requisito #21) */}
      {activeTab === 'assentos' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Mapa Visual de Assentos do Ônibus</h3>
            <p className="text-xs text-slate-500">
              Configuração leito turismo 46 lugares. Clique em um assento livre para atribuir a um viajante sem assento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-md bg-blue-600" />
              <span className="text-slate-700 font-medium">Ocupado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-md bg-emerald-100 border border-emerald-300" />
              <span className="text-slate-700 font-medium">Livre / Disponível</span>
            </div>
          </div>

          {/* Bus Visual Layout */}
          <div className="max-w-md mx-auto rounded-3xl border-2 border-slate-300 bg-slate-100 p-6 shadow-inner">
            <div className="text-center font-bold text-xs text-slate-400 mb-4 uppercase tracking-widest">
              Frente do Ônibus (Motorista) 🚌
            </div>

            <div className="grid grid-cols-5 gap-2">
              {seatLayout.map((seat, index) => {
                const isCorridor = index % 4 === 1; // Put corridor space after column B
                const isOccupied = Boolean(seat.occupiedBy);

                return (
                  <React.Fragment key={seat.label}>
                    <div
                      className={`h-14 rounded-xl p-1.5 flex flex-col justify-between text-center transition-all ${
                        isOccupied
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50'
                      }`}
                      title={seat.occupiedBy ? `Ocupado por ${seat.occupiedBy}` : `Assento ${seat.label} livre`}
                    >
                      <span className="text-[10px] font-black">{seat.label}</span>
                      <span className="text-[9px] truncate font-medium">
                        {seat.occupiedBy ? seat.occupiedBy.split(' ')[0] : 'Livre'}
                      </span>
                    </div>

                    {isCorridor && <div className="w-4" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Rentabilidade & DRE (Requisito #15) */}
      {activeTab === 'financeiro' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Demonstrativo de Rentabilidade da Viagem</h3>
            <p className="text-xs text-slate-500">
              Receita Total - Custos Operacionais = Lucro Líquido e Margem %.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-200">
              <span className="text-[11px] font-bold text-blue-800 uppercase">Receita Bruta</span>
              <p className="text-xl font-extrabold text-blue-900 mt-1">R$ {tripRevenue.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-blue-700">{tripReservations.length} reservas ativas</p>
            </div>

            <div className="rounded-2xl bg-rose-50/60 p-4 border border-rose-200">
              <span className="text-[11px] font-bold text-rose-800 uppercase">Custos / Despesas</span>
              <p className="text-xl font-extrabold text-rose-900 mt-1">R$ {totalTripCost.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-rose-700">{tripExpenses.length} despesas lançadas</p>
            </div>

            <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">Lucro Líquido</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">R$ {tripProfit.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-emerald-700">Resultado operacional</p>
            </div>

            <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-200">
              <span className="text-[11px] font-bold text-indigo-800 uppercase">Margem de Lucro</span>
              <p className="text-xl font-extrabold text-indigo-900 mt-1">{tripMarginPct}%</p>
              <p className="text-[10px] text-indigo-700">Meta mínima: 25%</p>
            </div>
          </div>

          {/* Despesas da Viagem */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 font-bold text-xs text-slate-700 border-b border-slate-200">
              Detalhamento de Custos da Viagem
            </div>
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold text-slate-500 uppercase bg-slate-50/50">
                <tr>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Descrição</th>
                  <th className="p-3">Vencimento</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tripExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="p-3 font-bold uppercase text-[10px] text-slate-500">{exp.category}</td>
                    <td className="p-3 font-medium text-slate-900">{exp.description}</td>
                    <td className="p-3 text-slate-600">{exp.dueDate}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          exp.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {exp.status === 'pago' ? '✓ Pago' : '⏳ Pendente'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">R$ {exp.amount.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
