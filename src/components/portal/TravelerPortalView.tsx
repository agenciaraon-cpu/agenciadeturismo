import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  MessageSquare,
  Armchair,
  Check,
  ShieldCheck,
  Download,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TravelerPortalView: React.FC = () => {
  const {
    agency,
    trips,
    reservations,
    travelers,
    customers,
    itineraries,
    completeDigitalCheckIn,
    showToast,
  } = useApp();

  // Pick default demo reservation (João Silva - Porto Seguro) or allow selecting
  const [selectedResCode, setSelectedResCode] = useState<string>('RES-1001');
  const [activeTab, setActiveTab] = useState<'viagem' | 'roteiro' | 'checkin' | 'voucher'>('viagem');

  const currentReservation = reservations.find((r) => r.code === selectedResCode) || reservations[0];
  const currentTrip = trips.find((t) => t.id === currentReservation?.tripId) || trips[0];
  const currentBuyer = customers.find((c) => c.id === currentReservation?.customerId);

  // Travelers for this reservation
  const reservationTravelers = travelers.filter((t) =>
    currentReservation?.travelerDetails.some((td) => td.travelerId === t.id)
  );

  const tripDays = itineraries[currentTrip?.id || ''] || [];

  // Digital check-in form state for first traveler
  const firstTravelerDetail = currentReservation?.travelerDetails[0];
  const firstTraveler = reservationTravelers[0];

  const [checkInDone, setCheckInDone] = useState(firstTravelerDetail?.digitalCheckInDone || false);
  const [emergencyContact, setEmergencyContact] = useState(firstTraveler?.emergencyContact || '');
  const [emergencyPhone, setEmergencyPhone] = useState(firstTraveler?.emergencyPhone || '');
  const [healthNotes, setHealthNotes] = useState(firstTraveler?.healthObservations || '');

  const handleSendCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstTraveler) return;

    completeDigitalCheckIn(currentReservation.id, firstTraveler.id, {
      emergencyContact,
      emergencyPhone,
      healthObservations: healthNotes,
    });
    setCheckInDone(true);
    showToast('Check-in digital realizado! Seu cartão de embarque está pronto.');
  };

  return (
    <div className="mx-auto max-w-xl pb-16 space-y-5">
      {/* Simulation Selector Bar */}
      <div className="rounded-2xl bg-slate-900 p-3 text-white flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-slate-300">Simulador do Portal do Viajante (Visão do Cliente)</span>
        </div>
        <select
          value={selectedResCode}
          onChange={(e) => {
            setSelectedResCode(e.target.value);
            setCheckInDone(false);
          }}
          className="rounded-lg bg-slate-800 border border-slate-700 text-xs px-2 py-1 text-white font-bold"
        >
          {reservations.map((r) => (
            <option key={r.code} value={r.code}>
              {r.code} ({customers.find((c) => c.id === r.customerId)?.name.split(' ')[0]})
            </option>
          ))}
        </select>
      </div>

      {/* Agency Custom Branding Header (Requisito #36 & #59) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-lg shadow-sm">
            {agency.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900">{agency.name}</h1>
            <p className="text-xs text-slate-500">{agency.phone} • {agency.instagram}</p>
          </div>
        </div>

        <a
          href={`https://wa.me/55${agency.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2 text-xs font-bold border border-emerald-200"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Suporte Agência</span>
        </a>
      </div>

      {/* Trip Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-6 shadow-lg">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
              Reserva {currentReservation?.code}
            </span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
              {currentReservation?.status === 'paga' ? '✓ 100% Confirmada' : 'Confirmada'}
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">{currentTrip?.name}</h2>
          <p className="text-xs text-slate-300 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-cyan-400" />
            {currentTrip?.destination}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Embarque</span>
              <b>{new Date(currentTrip?.departureDate || '').toLocaleDateString('pt-BR')} às {currentTrip?.departureTime}</b>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Retorno</span>
              <b>{new Date(currentTrip?.returnDate || '').toLocaleDateString('pt-BR')}</b>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url(${currentTrip?.imageUrl})` }}
        />
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-200/70 p-1 rounded-2xl text-xs font-bold text-center">
        {[
          { id: 'viagem', label: 'Viagem' },
          { id: 'roteiro', label: 'Roteiro' },
          { id: 'checkin', label: checkInDone ? '✓ Check-in' : 'Check-in' },
          { id: 'voucher', label: 'Voucher' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-xl py-2 transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Detalhes da Viagem */}
      {activeTab === 'viagem' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">Informações de Embarque & Hospedagem</h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-[10px] font-bold uppercase text-blue-700">Ponto de Encontro</span>
                <p className="font-extrabold text-sm text-slate-900 mt-0.5">{currentTrip?.departureLocation}</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Favor chegar com 30 minutos de antecedência munido de documento oficial com foto.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400">Hotel / Pousada</span>
                <p className="font-bold text-slate-900 mt-0.5">{currentTrip?.arrivalLocation}</p>
              </div>
            </div>

            {/* Passageiros da Reserva com seus Assentos */}
            <div className="pt-2">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-2">
                Passageiros na sua Reserva ({reservationTravelers.length})
              </h4>
              <div className="space-y-2">
                {reservationTravelers.map((trav) => {
                  const detail = currentReservation?.travelerDetails.find((d) => d.travelerId === trav.id);
                  return (
                    <div
                      key={trav.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white shadow-2xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{trav.name}</p>
                        <p className="text-[11px] text-slate-500">Doc: {trav.documentType} {trav.documentNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-lg bg-blue-50 text-blue-700 px-2 py-1 text-xs font-black">
                          Assento {detail?.seatNumber || 'A definir'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Roteiro Dia a Dia */}
      {activeTab === 'roteiro' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Programação da Viagem</h3>
          <div className="space-y-4">
            {tripDays.map((day) => (
              <div key={day.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {day.dayNumber}
                  </span>
                  <h4 className="font-extrabold text-slate-900">{day.title}</h4>
                </div>
                <div className="space-y-2 pt-1">
                  {day.activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-blue-700 text-[11px] shrink-0">{act.time}</span>
                      <div>
                        <p className="font-bold text-slate-800">{act.title}</p>
                        <p className="text-[11px] text-slate-500">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Check-in Digital Pré-Viagem (Requisito #19) */}
      {activeTab === 'checkin' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Check-in Digital Pré-Viagem</h3>
            <p className="text-xs text-slate-500">
              Confirme seus dados e contato de emergência para agilizar seu embarque.
            </p>
          </div>

          {checkInDone ? (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 text-center space-y-2">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <h4 className="font-extrabold text-emerald-900 text-sm">Check-in Realizado com Sucesso!</h4>
              <p className="text-xs text-emerald-700">
                Seus dados foram validados e seu cartão de embarque está liberado. Apresente seu documento no embarque.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendCheckIn} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Passageiro Principal</label>
                <input
                  type="text"
                  readOnly
                  value={firstTraveler?.name || ''}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contato de Emergência *</label>
                <input
                  type="text"
                  required
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Nome do parente ou amigo"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefone do Contato de Emergência *</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Restrições Alimentares ou Observações Médicas</label>
                <textarea
                  rows={2}
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="Ex: Vegetariano, alérgico a camarão, diabetes..."
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-98"
              >
                Confirmar Check-in Digital
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab: Voucher Oficial */}
      {activeTab === 'voucher' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4 text-xs shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Voucher de Viagem</span>
              <h3 className="font-extrabold text-sm text-slate-900">{currentTrip?.name}</h3>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-bold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Salvar PDF</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <p><b>Titular da Reserva:</b> {currentBuyer?.name}</p>
            <p><b>Código da Reserva:</b> {currentReservation?.code}</p>
            <p><b>Data de Embarque:</b> {currentTrip?.departureDate} às {currentTrip?.departureTime}</p>
            <p><b>Local de Embarque:</b> {currentTrip?.departureLocation}</p>
            <p><b>Passageiros:</b> {reservationTravelers.map((t) => t.name).join(', ')}</p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-[11px]">
            ✓ Apresente este voucher no celular ou impresso junto a seu documento oficial com foto.
          </div>
        </div>
      )}
    </div>
  );
};
