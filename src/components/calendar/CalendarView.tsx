import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plane,
  DollarSign,
  CheckSquare,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CalendarView: React.FC = () => {
  const { trips, installments, tasks, setCurrentView, setSelectedTripId } = useApp();

  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October 2026
  const [currentYear, setCurrentYear] = useState<number>(2026);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group events by day string YYYY-MM-DD
  const getEventsForDay = (day: number) => {
    const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const dayTrips = trips.filter((t) => t.departureDate === dayStr);
    const dayInstallments = installments.filter((i) => i.dueDate === dayStr && i.status !== 'pago');
    const dayTasks = tasks.filter((t) => t.dueDate === dayStr && t.status !== 'concluida');

    return { trips: dayTrips, installments: dayInstallments, tasks: dayTasks };
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Calendário Operacional</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              Visão Mensal & Agenda
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Datas de embarques de viagens, vencimentos de faturas a receber e prazos de tarefas da equipe.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-1.5 shadow-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-extrabold text-slate-900 min-w-32 text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-slate-400">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells before start day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-24 rounded-2xl bg-slate-50/50 p-2" />
          ))}

          {daysArray.map((day) => {
            const events = getEventsForDay(day);
            const isToday = day === 7 && currentMonth === 9 && currentYear === 2026;

            return (
              <div
                key={day}
                className={`min-h-28 rounded-2xl border p-2 flex flex-col justify-between transition-all ${
                  isToday
                    ? 'border-blue-500 bg-blue-50/20 shadow-xs'
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                      isToday ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-20 text-[10px]">
                  {/* Trips Departing */}
                  {events.trips.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTripId(t.id);
                        setCurrentView('trip_detail');
                      }}
                      className="cursor-pointer truncate rounded-md bg-blue-600 px-1.5 py-0.5 font-bold text-white shadow-2xs hover:bg-blue-700"
                      title={`Saída: ${t.name}`}
                    >
                      ✈️ {t.name}
                    </div>
                  ))}

                  {/* Overdue / Due Installments */}
                  {events.installments.map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => setCurrentView('finance')}
                      className="cursor-pointer truncate rounded-md bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900 border border-amber-200"
                      title={`Vencimento: R$ ${inst.amount}`}
                    >
                      💰 R$ {inst.amount}
                    </div>
                  ))}

                  {/* Tasks */}
                  {events.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setCurrentView('tasks')}
                      className="cursor-pointer truncate rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-700 font-medium"
                      title={task.title}
                    >
                      📋 {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
