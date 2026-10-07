import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Filter,
  Check,
  FileText,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, InstallmentStatus } from '../../types';

export const FinanceView: React.FC = () => {
  const {
    installments,
    expenses,
    customers,
    trips,
    suppliers,
    markInstallmentPaid,
    addExpense,
    markExpensePaid,
    deleteExpense,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'receber' | 'despesas' | 'dre'>('receber');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // New Expense form
  const [expenseForm, setExpenseForm] = useState<{
    category: ExpenseCategory;
    description: string;
    tripId: string;
    supplierId: string;
    amount: number;
    dueDate: string;
    status: 'pendente' | 'pago';
  }>({
    category: 'transporte',
    description: '',
    tripId: trips[0]?.id || '',
    supplierId: suppliers[0]?.id || '',
    amount: 1500,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pendente',
  });

  // Financial KPIs
  const totalReceived = installments
    .filter((i) => i.status === 'pago')
    .reduce((sum, i) => sum + (i.paidAmount || i.amount), 0);

  const totalPending = installments
    .filter((i) => i.status === 'pendente')
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueInstallments = installments.filter((i) => i.status === 'atrasado');
  const totalOverdue = overdueInstallments.reduce((sum, i) => sum + i.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = expenses.filter((e) => e.status === 'pago').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter((e) => e.status === 'pendente').reduce((sum, e) => sum + e.amount, 0);

  const totalGrossSales = totalReceived + totalPending + totalOverdue;
  const netEstimatedProfit = Math.max(0, totalGrossSales - totalExpenses);
  const netMarginPct = totalGrossSales > 0 ? ((netEstimatedProfit / totalGrossSales) * 100).toFixed(1) : '0';

  // Filtered installments
  const filteredInstallments = installments.filter((inst) => {
    const cust = customers.find((c) => c.id === inst.customerId);
    const trip = trips.find((t) => t.id === inst.tripId);
    const matchSearch =
      cust?.name.toLowerCase().includes(search.toLowerCase()) ||
      trip?.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.id.includes(search);
    const matchStatus = filterStatus === 'todos' || inst.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Filtered expenses
  const filteredExpenses = expenses.filter((e) => {
    return (
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description || expenseForm.amount <= 0) {
      alert('Descrição e valor são obrigatórios');
      return;
    }
    addExpense(expenseForm);
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financeiro & DRE</h1>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
              {netMarginPct}% Margem Geral
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Contas a receber, controle de inadimplência, despesas operacionais e rentabilidade por viagem.
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          <span>+ Nova Despesa</span>
        </button>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Recebido */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Recebido</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
            R$ {totalReceived.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Entradas confirmadas</p>
        </div>

        {/* A Receber */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">A Receber (No Prazo)</span>
          <p className="text-xl sm:text-2xl font-black text-blue-600 mt-1">
            R$ {totalPending.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Parcelas a vencer</p>
        </div>

        {/* Em Atraso */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Em Atraso (Inadimplência)</span>
          <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            R$ {totalOverdue.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-rose-700 font-semibold mt-0.5">{overdueInstallments.length} faturas vencidas</p>
        </div>

        {/* Despesas Totais */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Despesas / Custos</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            R$ {totalExpenses.toLocaleString('pt-BR')}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">R$ {paidExpenses.toLocaleString('pt-BR')} já pagos</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('receber')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'receber'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Contas a Receber (Parcelas)
          </button>
          <button
            onClick={() => setActiveTab('despesas')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'despesas'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Despesas & Fornecedores
          </button>
          <button
            onClick={() => setActiveTab('dre')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'dre'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            DRE & Rentabilidade por Viagem
          </button>
        </div>

        {activeTab === 'receber' && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente ou viagem..."
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 w-48"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700"
            >
              <option value="todos">Todos Status</option>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="atrasado">Em Atraso</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Contas a Receber */}
      {activeTab === 'receber' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Viagem</th>
                  <th className="p-3.5">Parcela</th>
                  <th className="p-3.5">Vencimento</th>
                  <th className="p-3.5">Valor</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ação / Baixa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInstallments.map((inst) => {
                  const cust = customers.find((c) => c.id === inst.customerId);
                  const trip = trips.find((t) => t.id === inst.tripId);
                  const isOverdue = inst.status === 'atrasado';
                  const isPaid = inst.status === 'pago';

                  return (
                    <tr
                      key={inst.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOverdue ? 'bg-rose-50/20' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{cust?.name || 'Cliente'}</p>
                        <p className="text-[11px] text-slate-500">{cust?.phone}</p>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">{trip?.name}</td>
                      <td className="p-3.5 font-bold text-slate-700">
                        {inst.installmentNumber}/{inst.totalInstallments}
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">
                        {new Date(inst.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900">
                        R$ {inst.amount.toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isOverdue
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isPaid ? '✓ Pago' : isOverdue ? '🔴 Em Atraso' : '⏳ Pendente'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {!isPaid ? (
                          <button
                            onClick={() => markInstallmentPaid(inst.id, 'PIX')}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs active:scale-95 transition-all"
                            title="Dar baixa no pagamento e confirmar recebimento"
                          >
                            ✓ Baixar Pagamento
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Baixado</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Despesas */}
      {activeTab === 'despesas' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3.5">Categoria</th>
                  <th className="p-3.5">Descrição</th>
                  <th className="p-3.5">Viagem Vinculada</th>
                  <th className="p-3.5">Vencimento</th>
                  <th className="p-3.5">Valor</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((e) => {
                  const trip = trips.find((t) => t.id === e.tripId);
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold uppercase text-[10px] text-slate-600">{e.category}</td>
                      <td className="p-3.5 font-bold text-slate-900">{e.description}</td>
                      <td className="p-3.5 text-slate-600">{trip?.name || 'Geral da Agência'}</td>
                      <td className="p-3.5 text-slate-700">{e.dueDate}</td>
                      <td className="p-3.5 font-extrabold text-slate-900">R$ {e.amount.toLocaleString('pt-BR')}</td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                            e.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {e.status === 'pago' ? '✓ Pago' : '⏳ Pendente'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {e.status !== 'pago' && (
                            <button
                              onClick={() => markExpensePaid(e.id)}
                              className="rounded-lg bg-slate-900 text-white px-2.5 py-1 text-[11px] font-bold hover:bg-slate-800"
                            >
                              Pagar
                            </button>
                          )}
                          <button
                            onClick={() => deleteExpense(e.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: DRE & Rentabilidade por Viagem (Requisito #15) */}
      {activeTab === 'dre' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-1">
              Demonstrativo de Resultado do Exercício (DRE por Viagem)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Compare a receita bruta vendida, os custos operacionais contratados e a margem de contribuição.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-3">Viagem</th>
                    <th className="p-3">Destino</th>
                    <th className="p-3 text-right">Receita Total</th>
                    <th className="p-3 text-right">Custo Total</th>
                    <th className="p-3 text-right">Lucro Líquido</th>
                    <th className="p-3 text-right">Margem %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {trips.map((trip) => {
                    const tripRevenue = installments
                      .filter((i) => i.tripId === trip.id)
                      .reduce((sum, i) => sum + i.amount, 0);

                    const tripCosts = expenses
                      .filter((e) => e.tripId === trip.id)
                      .reduce((sum, e) => sum + e.amount, 0);

                    const profit = tripRevenue - tripCosts;
                    const margin = tripRevenue > 0 ? ((profit / tripRevenue) * 100).toFixed(1) : '0';

                    return (
                      <tr key={trip.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{trip.name}</td>
                        <td className="p-3 text-slate-600">{trip.destination}</td>
                        <td className="p-3 text-right font-bold text-blue-700">
                          R$ {tripRevenue.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-3 text-right text-rose-700">R$ {tripCosts.toLocaleString('pt-BR')}</td>
                        <td className="p-3 text-right font-extrabold text-emerald-700">
                          R$ {profit.toLocaleString('pt-BR')}
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-black ${
                              Number(margin) >= 25
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {margin}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nova Despesa */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">+ Registrar Despesa / Custo</h3>
            <p className="text-xs text-slate-500 mb-4">Lançamento de custos operacionais com fornecedores ou taxas.</p>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                >
                  <option value="transporte">Transporte (Ônibus/Aéreo)</option>
                  <option value="hotel">Hospedagem / Pousada</option>
                  <option value="guias">Guias & Coordenadores</option>
                  <option value="alimentacao">Alimentação / Restaurantes</option>
                  <option value="marketing">Marketing & Anúncios</option>
                  <option value="taxas">Taxas & Seguros</option>
                  <option value="fornecedores">Outros Fornecedores</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Custo *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="Ex: Diárias Hotel Beira Mar"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Viagem Relacionada</label>
                <select
                  value={expenseForm.tripId}
                  onChange={(e) => setExpenseForm({ ...expenseForm, tripId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                >
                  <option value="">Geral da Agência (Sem viagem específica)</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vencimento</label>
                  <input
                    type="date"
                    value={expenseForm.dueDate}
                    onChange={(e) => setExpenseForm({ ...expenseForm, dueDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800"
                >
                  Registrar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
