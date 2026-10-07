import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentStatus, DocumentType } from '../../types';

export const DocumentsView: React.FC = () => {
  const { documents, travelers, trips, addDocument, updateDocumentStatus } = useApp();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<{
    travelerId: string;
    tripId: string;
    title: string;
    type: DocumentType;
    status: DocumentStatus;
  }>({
    travelerId: travelers[0]?.id || '',
    tripId: trips[0]?.id || '',
    title: '',
    type: 'rg',
    status: 'recebido',
  });

  const filteredDocs = documents.filter((doc) => {
    const trav = travelers.find((t) => t.id === doc.travelerId);
    const matchSearch =
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      trav?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'todos' || doc.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      alert('Título é obrigatório');
      return;
    }
    addDocument({
      ...form,
      fileName: `${form.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      uploadedAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Central de Documentos</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {documents.length} Arquivos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            RGs, comprovantes, autorizações de menores e passaportes com triagem de conformidade.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          <span>+ Anexar Documento</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por documento ou passageiro..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'recebido', label: '✅ Recebidos' },
            { id: 'pendente', label: '⚠️ Pendentes' },
            { id: 'recusado', label: '❌ Recusados' },
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

      {/* Documents Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-3.5">Documento</th>
                <th className="p-3.5">Viajante / Passageiro</th>
                <th className="p-3.5">Viagem</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Data Anexo</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const trav = travelers.find((t) => t.id === doc.travelerId);
                const trip = trips.find((t) => t.id === doc.tripId);

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-900">{doc.title}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{doc.fileName || 'documento.pdf'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{trav?.name || 'Não vinculado'}</td>
                    <td className="p-3.5 text-slate-600">{trip?.name || 'Geral'}</td>
                    <td className="p-3.5 uppercase font-bold text-[10px] text-slate-500">{doc.type}</td>
                    <td className="p-3.5 text-slate-600">{doc.uploadedAt || 'Pendente'}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                          doc.status === 'recebido'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : doc.status === 'recusado'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {doc.status === 'recebido'
                          ? '✅ Recebido'
                          : doc.status === 'recusado'
                          ? '❌ Recusado'
                          : '⚠️ Pendente'}
                      </span>
                      {doc.rejectionReason && (
                        <p className="text-[10px] text-rose-600 mt-0.5">{doc.rejectionReason}</p>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={doc.status}
                        onChange={(e) => updateDocumentStatus(doc.id, e.target.value as any)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700"
                      >
                        <option value="recebido">Aprovar (Recebido)</option>
                        <option value="pendente">Pendente</option>
                        <option value="recusado">Recusar</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Anexar Documento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">+ Anexar Documento de Viagem</h3>
            <p className="text-xs text-slate-500 mb-4">Cadastre a via do documento do passageiro.</p>

            <form onSubmit={handleCreateDocument} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Arquivo *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: RG - Maria Silva (Frente e Verso)"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Viajante / Passageiro</label>
                <select
                  value={form.travelerId}
                  onChange={(e) => setForm({ ...form, travelerId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                >
                  {travelers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Doc: {t.documentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Documento</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="rg">RG</option>
                    <option value="cpf">CPF</option>
                    <option value="passaporte">Passaporte</option>
                    <option value="cnh">CNH</option>
                    <option value="autorizacao_menor">Autorização Menor</option>
                    <option value="comprovante">Comprovante</option>
                    <option value="voucher">Voucher</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="recebido">Recebido / Concluído</option>
                    <option value="pendente">Pendente</option>
                    <option value="recusado">Recusado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  Salvar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
