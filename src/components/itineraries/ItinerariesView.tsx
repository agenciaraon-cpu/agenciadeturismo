import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Save,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TripDay } from '../../types';

export const ItinerariesView: React.FC = () => {
  const { trips, itineraries, saveTripItinerary, showToast, selectedTripId } = useApp();

  const [activeTripId, setActiveTripId] = useState<string>(selectedTripId || trips[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const trip = trips.find((t) => t.id === activeTripId) || trips[0];
  const currentDays: TripDay[] = itineraries[trip?.id || ''] || [];

  const handleGenerateAi = async () => {
    setIsGenerating(true);
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
        showToast('Roteiro completo gerado pelo RAON IA!');
      }
    } catch {
      showToast('Falha na geração de IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddDay = () => {
    const newDayNumber = currentDays.length + 1;
    const newDay: TripDay = {
      id: `day-${Date.now()}`,
      dayNumber: newDayNumber,
      title: `Dia ${newDayNumber} - Programação`,
      activities: [
        {
          id: `act-${Date.now()}`,
          time: '08:00',
          title: 'Café da manhã e saída',
          description: 'Ponto de encontro no lobby do hotel',
        },
      ],
    };
    saveTripItinerary(trip.id, [...currentDays, newDay]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Roteiros Dia a Dia</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              Visível no Portal do Viajante
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monte a programação visual com horários, descrições e paradas fotográficas.
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
            onClick={handleGenerateAi}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-cyan-700 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Gerando...' : 'Gerar com RAON IA'}</span>
          </button>

          <button
            onClick={handleAddDay}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>+ Adicionar Dia</span>
          </button>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{trip?.name}</h2>
          <p className="text-xs text-slate-500">Destino: {trip?.destination} • {currentDays.length} dias programados</p>
        </div>

        {currentDays.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-dashed border-slate-300 rounded-2xl">
            <Calendar className="mx-auto h-10 w-10 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-600">Nenhum roteiro cadastrado para esta viagem.</p>
            <button
              onClick={handleGenerateAi}
              className="mt-3 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              Gerar Roteiro Completo com Inteligência Artificial
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {currentDays.map((day) => (
              <div key={day.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-xs">
                      {day.dayNumber}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{day.title}</h3>
                  </div>
                  {day.date && <span className="text-xs text-slate-500 font-mono">{day.date}</span>}
                </div>

                <div className="space-y-2.5">
                  {day.activities.map((act) => (
                    <div
                      key={act.id}
                      className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs text-xs"
                    >
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700 font-mono shrink-0">
                        {act.time}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{act.title}</p>
                        <p className="text-slate-600 mt-0.5">{act.description}</p>
                        {act.location && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-cyan-600" /> {act.location}
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
    </div>
  );
};
