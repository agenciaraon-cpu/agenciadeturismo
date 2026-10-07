import React, { useState } from 'react';
import {
  Armchair,
  Users,
  CheckCircle,
  AlertCircle,
  Bus,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SeatsView: React.FC = () => {
  const { trips, reservations, travelers, assignSeat, showToast, selectedTripId } = useApp();

  const [activeTripId, setActiveTripId] = useState<string>(selectedTripId || trips[0]?.id || '');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const trip = trips.find((t) => t.id === activeTripId) || trips[0];
  const tripReservations = reservations.filter((r) => r.tripId === trip?.id && r.status !== 'cancelada');

  // Passengers list with current seat
  const passengersWithSeats: {
    reservationId: string;
    travelerId: string;
    name: string;
    seatNumber?: string;
  }[] = [];

  tripReservations.forEach((res) => {
    res.travelerDetails.forEach((td) => {
      const trav = travelers.find((t) => t.id === td.travelerId);
      if (trav) {
        passengersWithSeats.push({
          reservationId: res.id,
          travelerId: trav.id,
          name: trav.name,
          seatNumber: td.seatNumber,
        });
      }
    });
  });

  const unassignedPassengers = passengersWithSeats.filter((p) => !p.seatNumber);
  const assignedPassengers = passengersWithSeats.filter((p) => Boolean(p.seatNumber));

  // Build 46 seats: 11 rows of 4 + 2 at back
  const totalSeats = trip?.capacity || 46;
  const seats: {
    label: string;
    passenger?: (typeof passengersWithSeats)[0];
  }[] = [];

  for (let row = 1; row <= Math.ceil(totalSeats / 4); row++) {
    ['A', 'B', 'C', 'D'].forEach((col) => {
      const seatLabel = `${row < 10 ? '0' : ''}${row}${col}`;
      if (seats.length < totalSeats) {
        const pass = passengersWithSeats.find((p) => p.seatNumber === seatLabel);
        seats.push({
          label: seatLabel,
          passenger: pass,
        });
      }
    });
  }

  const handleSeatClick = (seatLabel: string, isOccupied: boolean) => {
    if (isOccupied) {
      showToast(`O assento ${seatLabel} já está ocupado.`, 'info');
      return;
    }
    setSelectedSeat(seatLabel);
  };

  const handleAssignTraveler = (reservationId: string, travelerId: string) => {
    if (!selectedSeat) return;
    const ok = assignSeat(reservationId, travelerId, selectedSeat);
    if (ok) {
      setSelectedSeat(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mapa Visual de Assentos</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              Bloqueio Antiduplicidade Ativo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Distribua as poltronas dos passageiros sem risco de conflito de assentos no ônibus.
          </p>
        </div>

        <select
          value={activeTripId}
          onChange={(e) => {
            setActiveTripId(e.target.value);
            setSelectedSeat(null);
          }}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-xs"
        >
          {trips.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Bus Map */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-blue-600" />
              <h2 className="font-extrabold text-base text-slate-900">Layout do Ônibus ({totalSeats} Lugares)</h2>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="h-3.5 w-3.5 rounded bg-blue-600" /> Ocupado ({assignedPassengers.length})
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-600">
                <span className="h-3.5 w-3.5 rounded border border-emerald-400 bg-emerald-50" /> Livre (
                {totalSeats - assignedPassengers.length})
              </span>
            </div>
          </div>

          {/* Bus Container */}
          <div className="max-w-md mx-auto rounded-3xl border-2 border-slate-300 bg-slate-100 p-6 shadow-inner">
            <div className="text-center font-bold text-xs text-slate-400 mb-4 uppercase tracking-widest">
              Frente do Ônibus (Motorista) 🚌
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {seats.map((seat, index) => {
                const isCorridor = index % 4 === 1;
                const isOccupied = Boolean(seat.passenger);
                const isCurrentSelected = selectedSeat === seat.label;

                return (
                  <React.Fragment key={seat.label}>
                    <button
                      type="button"
                      onClick={() => handleSeatClick(seat.label, isOccupied)}
                      className={`h-14 rounded-xl p-1.5 flex flex-col justify-between text-center transition-all cursor-pointer ${
                        isCurrentSelected
                          ? 'bg-amber-500 text-white ring-4 ring-amber-300 scale-105'
                          : isOccupied
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50'
                      }`}
                      title={seat.passenger ? `Ocupado por ${seat.passenger.name}` : `Clique para escolher ${seat.label}`}
                    >
                      <span className="text-[10px] font-black">{seat.label}</span>
                      <span className="text-[9px] truncate font-medium">
                        {seat.passenger ? seat.passenger.name.split(' ')[0] : 'Livre'}
                      </span>
                    </button>

                    {isCorridor && <div className="w-4" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Unassigned Travelers Panel */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              Passageiros Sem Assento ({unassignedPassengers.length})
            </h3>
            <p className="text-xs text-slate-500">
              {selectedSeat
                ? `👉 Clique em um passageiro abaixo para atribuir à poltrona ${selectedSeat}.`
                : '1º Selecione uma poltrona livre no mapa ao lado.'}
            </p>

            {unassignedPassengers.length === 0 ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-center border border-emerald-200 text-emerald-800 text-xs font-bold">
                ✓ Todos os passageiros cadastrados já possuem assento!
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unassignedPassengers.map((p) => (
                  <div
                    key={p.travelerId}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <span className="text-[10px] text-slate-400">Reserva {p.reservationId}</span>
                    </div>

                    <button
                      onClick={() => handleAssignTraveler(p.reservationId, p.travelerId)}
                      disabled={!selectedSeat}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                        selectedSeat
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {selectedSeat ? `Alocar ${selectedSeat}` : 'Escolha poltrona'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
