import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Plane,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { trips, reservations, installments, expenses, customers, travelers, showToast } = useApp();

  const [reportType, setReportType] = useState<'vendas' | 'financeiro' | 'operacional' | 'rentabilidade'>('vendas');

  // Export to CSV helper (Requisito #48)
  const exportToCsv = (filename: string, rows: string[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(';')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Relatório exportado para CSV com sucesso!`);
  };

  const handleExport = () => {
    if (reportType === 'vendas') {
      const headers = ['Codigo Reserva', 'Cliente', 'Viagem', 'Data', 'Passageiros', 'Valor Final', 'Status'];
      const data = reservations.map((r) => [
        r.code,
        customers.find((c) => c.id === r.customerId)?.name || '',
        trips.find((t) => t.id === r.tripId)?.name || '',
        r.createdAt.split('T')[0],
        String(r.travelerDetails.length),
        `R$ ${r.finalValue}`,
        r.status,
      ]);
      exportToCsv('relatorio_vendas_raon', [headers, ...data]);
    } else if (reportType === 'financeiro') {
      const headers = ['ID Parcela', 'Cliente', 'Viagem', 'Vencimento', 'Valor', 'Status'];
      const data = installments.map((i) => [
        i.id,
        customers.find((c) => c.id === i.customerId)?.name || '',
        trips.find((t) => t.id === i.tripId)?.name || '',
        i.dueDate,
        `R$ ${i.amount}`,
        i.status,
      ]);
      exportToCsv('relatorio_financeiro_raon', [headers, ...data]);
    } else if (reportType === 'rentabilidade') {
      const headers = ['Viagem', 'Destino', 'Receita Total', 'Custos Operacionais', 'Lucro Liquido', 'Margem'];
      const data = trips.map((t) => {
        const rev = reservations.filter((r) => r.tripId === t.id).reduce((s, r) => s + r.finalValue, 0);
        const cost = expenses.filter((e) => e.tripId === t.id).reduce((s, e) => s + e.amount, 0);
        const profit = rev - cost;
        const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) + '%' : '0%';
        return [t.name, t.destination, `R$ ${rev}`, `R$ ${cost}`, `R$ ${profit}`, margin];
      });
      exportToCsv('relatorio_rentabilidade_raon', [headers, ...data]);
    } else {
      const headers = ['Viagem', 'Capacidade', 'Ocupacao', 'Percentual', 'Status'];
      const data = trips.map((t) => {
        const booked = reservations.filter((r) => r.tripId === t.id).reduce((s, r) => s + r.travelerDetails.length, 0);
        const pct = t.capacity > 0 ? ((booked / t.capacity) * 100).toFixed(1) + '%' : '0%';
        return [t.name, String(t.capacity), String(booked), pct, t.status];
      });
      exportToCsv('relatorio_operacional_raon', [headers, ...data]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Relatórios & Inteligência</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              Exportação CSV & PDF
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Métricas de vendas, rentabilidade consolidada e ocupação operacional.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Exportar Relatório (CSV / Excel)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'vendas', label: '1. Vendas por Viagem' },
          { id: 'financeiro', label: '2. Financeiro & Inadimplência' },
          { id: 'operacional', label: '3. Operacional & Vagas' },
          { id: 'rentabilidade', label: '4. Rentabilidade & Margem' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              reportType === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Vendas */}
      {reportType === 'vendas' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Relatório de Vendas por Viagem</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-3">Viagem</th>
                  <th className="p-3">Destino</th>
                  <th className="p-3">Reservas</th>
                  <th className="p-3">Passageiros</th>
                  <th className="p-3 text-right">Faturamento Bruto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((trip) => {
                  const tripRes = reservations.filter((r) => r.tripId === trip.id && r.status !== 'cancelada');
                  const booked = tripRes.reduce((s, r) => s + r.travelerDetails.length, 0);
                  const total = tripRes.reduce((s, r) => s + r.finalValue, 0);

                  return (
                    <tr key={trip.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{trip.name}</td>
                      <td className="p-3 text-slate-600">{trip.destination}</td>
                      <td className="p-3 font-bold text-blue-700">{tripRes.length}</td>
                      <td className="p-3">{booked} passageiros</td>
                      <td className="p-3 text-right font-extrabold text-emerald-700">
                        R$ {total.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Financeiro */}
      {reportType === 'financeiro' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Relatório de Faturamento e Inadimplência</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-800">Total Recebido</span>
              <p className="text-xl font-extrabold text-emerald-900 mt-1">
                R$ {installments.filter((i) => i.status === 'pago').reduce((s, i) => s + i.amount, 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold uppercase text-blue-800">A Receber</span>
              <p className="text-xl font-extrabold text-blue-900 mt-1">
                R$ {installments.filter((i) => i.status === 'pendente').reduce((s, i) => s + i.amount, 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-[10px] font-bold uppercase text-rose-800">Em Atraso</span>
              <p className="text-xl font-extrabold text-rose-900 mt-1">
                R$ {installments.filter((i) => i.status === 'atrasado').reduce((s, i) => s + i.amount, 0).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Operacional */}
      {reportType === 'operacional' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Relatório Operacional de Ocupação</h3>
          <div className="space-y-3">
            {trips.map((t) => {
              const booked = reservations.filter((r) => r.tripId === t.id).reduce((s, r) => s + r.travelerDetails.length, 0);
              const pct = t.capacity > 0 ? ((booked / t.capacity) * 100).toFixed(1) : 0;
              return (
                <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between font-bold text-xs">
                    <span>{t.name}</span>
                    <span className="text-blue-600">{booked}/{t.capacity} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Rentabilidade */}
      {reportType === 'rentabilidade' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">Análise de Rentabilidade e Margens</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-3">Viagem</th>
                  <th className="p-3 text-right">Receita</th>
                  <th className="p-3 text-right">Custo Operacional</th>
                  <th className="p-3 text-right">Lucro Líquido</th>
                  <th className="p-3 text-right">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {trips.map((trip) => {
                  const rev = reservations.filter((r) => r.tripId === trip.id).reduce((s, r) => s + r.finalValue, 0);
                  const cost = expenses.filter((e) => e.tripId === trip.id).reduce((s, e) => s + e.amount, 0);
                  const profit = rev - cost;
                  const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : 0;

                  return (
                    <tr key={trip.id}>
                      <td className="p-3 font-bold text-slate-900">{trip.name}</td>
                      <td className="p-3 text-right text-blue-700">R$ {rev.toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-right text-rose-700">R$ {cost.toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-right font-bold text-emerald-700">R$ {profit.toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-right font-black text-slate-900">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
