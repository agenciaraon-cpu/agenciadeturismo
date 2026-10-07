import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';

export const TasksView: React.FC = () => {
  const { tasks, trips, customers, addTask, toggleTaskStatus, deleteTask } = useApp();

  const [filterPriority, setFilterPriority] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    assignedTo: string;
    dueDate: string;
    priority: Task['priority'];
    status: Task['status'];
    tripId: string;
    description: string;
  }>({
    title: '',
    assignedTo: 'Carlos Mendes',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'alta',
    status: 'pendente',
    tripId: trips[0]?.id || '',
    description: '',
  });

  const filtered = tasks.filter((t) => {
    return filterPriority === 'todas' || t.priority === filterPriority;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('Título da tarefa é obrigatório');
      return;
    }
    addTask(form);
    setIsModalOpen(false);
  };

  const priorityBadges = {
    alta: { label: '🔴 Alta Prioridade', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    media: { label: '🟡 Média Prioridade', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    baixa: { label: '🟢 Baixa Prioridade', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tarefas & Pendências da Equipe</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {tasks.filter((t) => t.status !== 'concluida').length} em aberto
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize pendências operacionais, cobranças e alinhamentos de guias.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>+ Nova Tarefa</span>
        </button>
      </div>

      {/* Filter by Priority */}
      <div className="flex gap-2">
        {['todas', 'alta', 'media', 'baixa'].map((pr) => (
          <button
            key={pr}
            onClick={() => setFilterPriority(pr)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors capitalize ${
              filterPriority === pr
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {pr === 'todas' ? 'Todas Prioridades' : `${pr} prioridade`}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
        {filtered.map((task) => {
          const trip = trips.find((t) => t.id === task.tripId);
          const isDone = task.status === 'concluida';

          return (
            <div
              key={task.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50 ${
                isDone ? 'bg-slate-50/50 opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleTaskStatus(task.id)}
                  className="mt-1 h-4 w-4 rounded-md text-blue-600 cursor-pointer"
                />
                <div className="space-y-1">
                  <p
                    className={`font-bold text-xs ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" /> {task.assignedTo}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" /> Prazo: {task.dueDate}
                    </span>
                    {trip && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-blue-700">{trip.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`rounded-lg px-2 py-0.5 text-[10px] font-bold border ${
                    priorityBadges[task.priority]?.color
                  }`}
                >
                  {priorityBadges[task.priority]?.label}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Nova Tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-extrabold text-slate-900">+ Nova Tarefa</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Tarefa *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Cobrar RG pendente da Maria"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prazo</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridade</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="alta">🔴 Alta</option>
                    <option value="media">🟡 Média</option>
                    <option value="baixa">🟢 Baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Viagem Relacionada</label>
                  <select
                    value={form.tripId}
                    onChange={(e) => setForm({ ...form, tripId: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="">Nenhuma</option>
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
