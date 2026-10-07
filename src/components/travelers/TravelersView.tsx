import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Phone,
  Mail,
  FileText,
  Calendar,
  Eye,
  Shield,
  Edit,
  MapPin,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Traveler, Customer } from '../../types';

export const TravelersView: React.FC = () => {
  const {
    travelers,
    customers,
    reservations,
    trips,
    documents,
    contracts,
    addTraveler,
    updateTraveler,
    addCustomer,
    selectedTravelerId,
    setSelectedTravelerId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'viajantes' | 'clientes'>('viajantes');
  const [search, setSearch] = useState('');
  const [isNewTravelerModalOpen, setIsNewTravelerModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  // New Traveler Form
  const [travForm, setTravForm] = useState({
    customerId: customers[0]?.id || '',
    name: '',
    cpf: '',
    rg: '',
    birthDate: '1995-01-01',
    phone: '',
    whatsapp: '',
    email: '',
    documentType: 'RG' as 'RG' | 'CPF' | 'Passaporte' | 'CNH',
    documentNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    healthObservations: '',
    dietaryRestrictions: '',
  });

  // New Customer Form
  const [custForm, setCustForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: 'São Paulo',
    state: 'SP',
    notes: '',
  });

  // Active traveler for 360° Profile Drawer
  const activeTraveler = travelers.find((t) => t.id === selectedTravelerId);
  const buyerForActive = customers.find((c) => c.id === activeTraveler?.customerId);

  // Filtered lists
  const filteredTravelers = travelers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.cpf.includes(search) ||
      t.documentNumber.includes(search) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleCreateTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travForm.name || !travForm.documentNumber) {
      alert('Nome e número do documento são obrigatórios');
      return;
    }
    const created = addTraveler(travForm);
    setIsNewTravelerModalOpen(false);
    setSelectedTravelerId(created.id);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.name || !custForm.cpf) {
      alert('Nome e CPF são obrigatórios');
      return;
    }
    addCustomer(custForm);
    setIsNewCustomerModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Viajantes & Clientes</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {travelers.length} Passageiros • {customers.length} Compradores
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Diferenciação clara entre quem compra (Cliente) e quem viaja (Viajante), com histórico 360°.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'viajantes' ? (
            <button
              onClick={() => setIsNewTravelerModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>+ Novo Viajante</span>
            </button>
          ) : (
            <button
              onClick={() => setIsNewCustomerModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>+ Novo Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Viajantes vs Clientes (Requisito #10) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('viajantes')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'viajantes'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Viajantes (Passageiros que embarcam)</span>
          </button>
          <button
            onClick={() => setActiveTab('clientes')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'clientes'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Clientes (Contratantes / Pagadores)</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Buscar por nome ou CPF...`}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tab Content: VIAJANTES */}
      {activeTab === 'viajantes' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3.5">Nome do Viajante</th>
                  <th className="p-3.5">Documento</th>
                  <th className="p-3.5">Comprador Responsável</th>
                  <th className="p-3.5">Contato de Emergência</th>
                  <th className="p-3.5">Viagens Vinculadas</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTravelers.map((trav) => {
                  const buyer = customers.find((c) => c.id === trav.customerId);
                  const myReservations = reservations.filter((r) =>
                    r.travelerDetails.some((td) => td.travelerId === trav.id)
                  );

                  return (
                    <tr key={trav.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                            {trav.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{trav.name}</p>
                            <p className="text-[11px] text-slate-500">Nasc: {trav.birthDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono font-semibold text-slate-800">
                          {trav.documentType} {trav.documentNumber}
                        </span>
                        <p className="text-[11px] text-slate-500">CPF: {trav.cpf}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-900">{buyer?.name || 'Próprio viajante'}</span>
                        <p className="text-[11px] text-slate-500">{buyer?.phone || ''}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-slate-800">{trav.emergencyContact}</p>
                        <p className="text-[11px] text-slate-500">{trav.emergencyPhone}</p>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                          {myReservations.length} viagem(ns)
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTravelerId(trav.id)}
                            className="flex items-center gap-1 rounded-lg bg-blue-50 text-blue-700 px-2.5 py-1 text-xs font-bold hover:bg-blue-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Perfil 360°</span>
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

      {/* Tab Content: CLIENTES (Compradores) */}
      {activeTab === 'clientes' && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3.5">Nome do Cliente</th>
                  <th className="p-3.5">CPF</th>
                  <th className="p-3.5">Telefone / WhatsApp</th>
                  <th className="p-3.5">Cidade/UF</th>
                  <th className="p-3.5">Total de Reservas</th>
                  <th className="p-3.5 text-right">Contato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const custRes = reservations.filter((r) => r.customerId === cust.id);
                  const totalSpent = custRes.reduce((sum, r) => sum + r.finalValue, 0);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                            {cust.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{cust.name}</p>
                            <p className="text-[11px] text-slate-500">{cust.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700">{cust.cpf}</td>
                      <td className="p-3.5 text-slate-700">{cust.phone}</td>
                      <td className="p-3.5 text-slate-700">{cust.city}/{cust.state}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900">{custRes.length} reservas</span>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          R$ {totalSpent.toLocaleString('pt-BR')} investidos
                        </p>
                      </td>
                      <td className="p-3.5 text-right">
                        <a
                          href={`https://wa.me/55${cust.whatsapp?.replace(/\D/g, '') || ''}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Perfil 360° do Viajante (Drawer Modal - Requisito #11) */}
      {activeTraveler && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs">
          <div className="h-full w-full max-w-xl bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  Perfil 360° do Viajante
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">{activeTraveler.name}</h2>
              </div>
              <button
                onClick={() => setSelectedTravelerId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Dados Pessoais */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Dados Pessoais</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">CPF:</span> <span className="font-medium">{activeTraveler.cpf}</span>
                </div>
                <div>
                  <span className="text-slate-400">Documento:</span>{' '}
                  <span className="font-medium">{activeTraveler.documentType} {activeTraveler.documentNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400">Nascimento:</span> <span className="font-medium">{activeTraveler.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">WhatsApp:</span> <span className="font-medium">{activeTraveler.whatsapp}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Contato Emergência:</span>{' '}
                  <span className="font-bold text-slate-800">{activeTraveler.emergencyContact} ({activeTraveler.emergencyPhone})</span>
                </div>
                {activeTraveler.healthObservations && (
                  <div className="col-span-2 text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    ⚠️ <b>Saúde / Alergias:</b> {activeTraveler.healthObservations}
                  </div>
                )}
              </div>
            </div>

            {/* Viagens & Reservas do Viajante */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Viagens & Reservas</h4>
              <div className="space-y-2">
                {reservations
                  .filter((r) => r.travelerDetails.some((td) => td.travelerId === activeTraveler.id))
                  .map((res) => {
                    const trip = trips.find((t) => t.id === res.tripId);
                    const td = res.travelerDetails.find((d) => d.travelerId === activeTraveler.id);

                    return (
                      <div key={res.id} className="rounded-xl border border-slate-200 p-3 bg-white space-y-1 text-xs">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-blue-700">{trip?.name}</span>
                          <span className="font-mono text-slate-500">{res.code}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Data: {trip?.departureDate} • Assento: <b className="text-slate-900">{td?.seatNumber || 'Não atribuído'}</b>
                        </p>
                        <div className="flex gap-2 pt-1">
                          <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[10px] font-bold">
                            Check-in: {td?.digitalCheckInDone ? 'Realizado' : 'Pendente'}
                          </span>
                          <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold">
                            Status: {td?.boardingStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Documentos Anexados */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Documentos & Comprovantes</h4>
              <div className="space-y-2 text-xs">
                {documents
                  .filter((d) => d.travelerId === activeTraveler.id)
                  .map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-800">{doc.title}</p>
                        <span className="text-[10px] text-slate-400 uppercase">{doc.type}</span>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          doc.status === 'recebido'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Novo Viajante */}
      {isNewTravelerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">+ Cadastrar Novo Viajante (Passageiro)</h3>
            <p className="text-xs text-slate-500 mb-4">Insira os dados do passageiro para embarque e seguro MTur.</p>

            <form onSubmit={handleCreateTraveler} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cliente Comprador Responsável</label>
                <select
                  value={travForm.customerId}
                  onChange={(e) => setTravForm({ ...travForm, customerId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (CPF {c.cpf})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={travForm.name}
                  onChange={(e) => setTravForm({ ...travForm, name: e.target.value })}
                  placeholder="Nome do passageiro"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Documento</label>
                  <select
                    value={travForm.documentType}
                    onChange={(e) => setTravForm({ ...travForm, documentType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="RG">RG</option>
                    <option value="CPF">CPF</option>
                    <option value="Passaporte">Passaporte</option>
                    <option value="CNH">CNH</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número do Documento *</label>
                  <input
                    type="text"
                    required
                    value={travForm.documentNumber}
                    onChange={(e) => setTravForm({ ...travForm, documentNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={travForm.birthDate}
                    onChange={(e) => setTravForm({ ...travForm, birthDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={travForm.whatsapp}
                    onChange={(e) => setTravForm({ ...travForm, whatsapp: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contato de Emergência</label>
                  <input
                    type="text"
                    value={travForm.emergencyContact}
                    onChange={(e) => setTravForm({ ...travForm, emergencyContact: e.target.value })}
                    placeholder="Nome e parentesco"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone de Emergência</label>
                  <input
                    type="text"
                    value={travForm.emergencyPhone}
                    onChange={(e) => setTravForm({ ...travForm, emergencyPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewTravelerModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Cadastrar Viajante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Novo Cliente */}
      {isNewCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">+ Cadastrar Novo Cliente (Comprador)</h3>
            <p className="text-xs text-slate-500 mb-4">Pessoa física ou jurídica responsável pelos contratos e faturas.</p>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={custForm.cpf}
                    onChange={(e) => setCustForm({ ...custForm, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp *</label>
                  <input
                    type="text"
                    value={custForm.whatsapp}
                    onChange={(e) => setCustForm({ ...custForm, whatsapp: e.target.value })}
                    placeholder="(11) 98765-4321"
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={custForm.email}
                  onChange={(e) => setCustForm({ ...custForm, email: e.target.value })}
                  placeholder="cliente@email.com"
                  className="w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={custForm.city}
                    onChange={(e) => setCustForm({ ...custForm, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado</label>
                  <input
                    type="text"
                    value={custForm.state}
                    onChange={(e) => setCustForm({ ...custForm, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Cadastrar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
