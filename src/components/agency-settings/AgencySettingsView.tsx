import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  Instagram,
  Globe,
  Save,
  CheckCircle,
  Shield,
  Palette,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AgencySettingsView: React.FC = () => {
  const { agency, updateAgency } = useApp();

  const [form, setForm] = useState({
    name: agency.name,
    cnpj: agency.cnpj,
    phone: agency.phone,
    whatsapp: agency.whatsapp,
    email: agency.email,
    address: agency.address,
    city: agency.city,
    state: agency.state,
    instagram: agency.instagram,
    website: agency.website,
    primaryColor: agency.primaryColor,
    termsAndPolicies: agency.termsAndPolicies,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgency(form);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configurações da Agência</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Identidade visual, dados fiscais, contatos e políticas exibidas no Portal do Viajante e Contratos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identidade Visual & Marca */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Marca & Identidade Visual</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome da Agência de Turismo *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">CNPJ / Cadastro Cadastur *</label>
              <input
                type="text"
                required
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Contatos & Redes */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Contatos de Atendimento ao Passageiro</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Telefone Comercial</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp de Suporte *</label>
              <input
                type="text"
                required
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">E-mail Oficial</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram</label>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website Oficial</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Endereço & Políticas */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Endereço & Políticas de Viagem</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Endereço da Sede</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cidade / UF</label>
              <input
                type="text"
                value={`${form.city}/${form.state}`}
                onChange={(e) => {
                  const parts = e.target.value.split('/');
                  setForm({ ...form, city: parts[0] || '', state: parts[1] || '' });
                }}
                className="w-full rounded-xl border border-slate-200 p-2.5"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">
              Políticas de Cancelamento e Reembolso Padrão (Exibidas no Portal e Contrato)
            </label>
            <textarea
              rows={3}
              value={form.termsAndPolicies}
              onChange={(e) => setForm({ ...form, termsAndPolicies: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-2.5"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-98"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Configurações da Agência</span>
          </button>
        </div>
      </form>
    </div>
  );
};
