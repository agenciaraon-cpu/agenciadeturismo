import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  Shield,
  Edit,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaasPlan } from '../../types';

export const AdminSaasView: React.FC = () => {
  const { saasPlans, agency, trips, customers, travelers, showToast } = useApp();

  const [plans, setPlans] = useState<SaasPlan[]>(saasPlans);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(199);

  // Demo Multi-Tenant Agencies on platform
  const [tenants, setTenants] = useState([
    {
      id: 'horizonte-turismo-01',
      name: agency.name,
      plan: 'Plano PRO',
      mrr: 199,
      status: 'active',
      usersCount: 6,
      tripsCount: trips.length,
      travelersCount: travelers.length,
      createdAt: '2026-08-01',
    },
    {
      id: 'agencia-sol-mar',
      name: 'Sol & Mar Excursões',
      plan: 'Plano START',
      mrr: 99,
      status: 'active',
      usersCount: 2,
      tripsCount: 4,
      travelersCount: 88,
      createdAt: '2026-08-20',
    },
    {
      id: 'ecotur-aventura',
      name: 'EcoTur Brasil Aventura',
      plan: 'Plano PREMIUM',
      mrr: 399,
      status: 'active',
      usersCount: 14,
      tripsCount: 28,
      travelersCount: 420,
      createdAt: '2026-07-15',
    },
    {
      id: 'rota-das-aguas',
      name: 'Rota das Águas Viagens',
      plan: 'Plano PRO',
      mrr: 199,
      status: 'trial',
      usersCount: 3,
      tripsCount: 2,
      travelersCount: 35,
      createdAt: '2026-09-28',
    },
  ]);

  const totalMRR = tenants.reduce((sum, t) => sum + (t.status === 'active' ? t.mrr : 0), 0);
  const totalAgencies = tenants.length;
  const totalUsersPlatform = tenants.reduce((sum, t) => sum + t.usersCount, 0);

  const handleUpdatePrice = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, priceMonthly: newPrice } : p))
    );
    setEditingPlanId(null);
    showToast('Valor do plano atualizado com sucesso na plataforma!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              Painel Master Proprietário
            </span>
            <span className="text-xs text-slate-400">RAON TRAVEL SaaS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ADMIN RAON</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1">
            Gestão global de todas as agências assinantes, métricas de MRR e configuração de planos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase">MRR (Recorrência Mensal)</span>
            <p className="text-2xl font-black text-emerald-400">R$ {totalMRR.toLocaleString('pt-BR')}/mês</p>
          </div>
        </div>
      </div>

      {/* Global SaaS Platform KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agências Clientes</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalAgencies}</p>
          <p className="text-[11px] text-emerald-600 font-bold">100% ativas ou em trial</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Usuários Ativos</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalUsersPlatform}</p>
          <p className="text-[11px] text-slate-500">Operando na plataforma</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Viagens Operadas</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {tenants.reduce((s, t) => s + t.tripsCount, 0)}
          </p>
          <p className="text-[11px] text-slate-500">Pacotes criados no SaaS</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passageiros Totais</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">
            {tenants.reduce((s, t) => s + t.travelersCount, 0)}
          </p>
          <p className="text-[11px] text-slate-500">Viajantes cadastrados</p>
        </div>
      </div>

      {/* Configuração de Planos (Requisito #35: Valores configuráveis pelo admin, não fixos) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Configuração de Planos de Assinatura</h2>
          <p className="text-xs text-slate-500">
            Valores cobrados das agências de turismo. O administrador pode editar as mensalidades em tempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const isEditing = editingPlanId === plan.id;

            return (
              <div
                key={plan.id}
                className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-black text-base text-slate-900">{plan.name}</h3>
                    {plan.isPopular && (
                      <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-[10px] font-extrabold">
                        Mais Vendido
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{plan.description}</p>

                  {/* Preço Editável */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 mb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mensalidade</span>
                    {isEditing ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold">R$</span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                          className="w-24 rounded-lg border border-slate-300 p-1 text-sm font-bold"
                        />
                        <button
                          onClick={() => handleUpdatePrice(plan.id)}
                          className="rounded-lg bg-emerald-600 text-white p-1.5"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-2xl font-black text-slate-900">
                          R$ {plan.priceMonthly}
                          <span className="text-xs text-slate-400 font-normal">/mês</span>
                        </p>
                        <button
                          onClick={() => {
                            setEditingPlanId(plan.id);
                            setNewPrice(plan.priceMonthly);
                          }}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Alterar Preço
                        </button>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela de Agências Clientes */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs space-y-4 p-6">
        <h2 className="text-base font-extrabold text-slate-900">Agências Assinantes Cadastradas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
              <tr>
                <th className="p-3">Agência</th>
                <th className="p-3">Plano</th>
                <th className="p-3">MRR</th>
                <th className="p-3">Status</th>
                <th className="p-3">Usuários</th>
                <th className="p-3">Viagens</th>
                <th className="p-3">Passageiros</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{t.name}</td>
                  <td className="p-3 font-semibold text-blue-700">{t.plan}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">R$ {t.mrr}/mês</td>
                  <td className="p-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        t.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {t.status === 'active' ? 'Ativo' : 'Período de Testes'}
                    </span>
                  </td>
                  <td className="p-3">{t.usersCount} usuários</td>
                  <td className="p-3">{t.tripsCount} viagens</td>
                  <td className="p-3 font-bold text-slate-800">{t.travelersCount} pax</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
