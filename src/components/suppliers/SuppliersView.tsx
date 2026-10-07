import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  MessageSquare,
  Building,
  Mail,
  Trash2,
  Edit,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';

export const SuppliersView: React.FC = () => {
  const { suppliers, addSupplier, deleteSupplier } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState<{
    name: string;
    company: string;
    category: Supplier['category'];
    phone: string;
    whatsapp: string;
    email: string;
    serviceDescription: string;
    standardPrice: number;
    notes: string;
  }>({
    name: '',
    company: '',
    category: 'transportadora',
    phone: '',
    whatsapp: '',
    email: '',
    serviceDescription: '',
    standardPrice: 0,
    notes: '',
  });

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'transportadora', label: 'Transportadoras / Ônibus' },
    { id: 'hotel', label: 'Hotéis' },
    { id: 'pousada', label: 'Pousadas' },
    { id: 'guia', label: 'Guias de Turismo' },
    { id: 'passeios', label: 'Passeios & Lanchas' },
    { id: 'receptivo', label: 'Receptivos' },
    { id: 'seguradora', label: 'Seguradoras' },
  ];

  const filtered = suppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'todos' || s.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company) {
      alert('Nome e Razão Social são obrigatórios');
      return;
    }
    addSupplier(form);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fornecedores Homologados</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {suppliers.length} Parceiros
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Transportadoras, hotéis, pousadas, lanchas, seguradoras e guias credenciados.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>+ Novo Fornecedor</span>
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
            placeholder="Buscar por nome, empresa ou serviço..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sup) => (
          <div
            key={sup.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="rounded-lg bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {sup.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1.5">{sup.name}</h3>
                  <p className="text-xs text-slate-500">{sup.company}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Excluir ${sup.name}?`)) deleteSupplier(sup.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {sup.serviceDescription}
              </p>

              <div className="space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{sup.phone}</span>
                </p>
                {sup.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sup.email}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {sup.standardPrice ? `Média: R$ ${sup.standardPrice.toLocaleString('pt-BR')}` : 'Sob cotação'}
              </span>

              <a
                href={`https://wa.me/55${sup.whatsapp.replace(/\D/g, '')}?text=Olá,%20aqui%20é%20da%20agência%20de%20turismo.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Novo Fornecedor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">+ Cadastrar Fornecedor Homologado</h3>
            <p className="text-xs text-slate-500 mb-4">Adicione empresas parceiras de transporte, hospedagem ou receptivo.</p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Fantasia / Contato *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Translider Fretamento"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Razão Social / Empresa *</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Ex: Translider Transportes Ltda"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                >
                  <option value="transportadora">Transportadora (Ônibus/Vans)</option>
                  <option value="hotel">Hotel</option>
                  <option value="pousada">Pousada</option>
                  <option value="guia">Guia de Turismo</option>
                  <option value="passeios">Empresa de Passeios / Lanchas</option>
                  <option value="receptivo">Receptivo Local</option>
                  <option value="seguradora">Seguradora</option>
                  <option value="restaurante">Restaurante</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value, phone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="comercial@fornecedor.com"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição dos Serviços Prestados</label>
                <textarea
                  rows={2}
                  value={form.serviceDescription}
                  onChange={(e) => setForm({ ...form, serviceDescription: e.target.value })}
                  placeholder="Ex: Ônibus leito turismo com ar e Wi-Fi..."
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
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
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
