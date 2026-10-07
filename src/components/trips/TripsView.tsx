import React, { useState } from 'react';
import {
  Plus,
  Plane,
  Search,
  Calendar,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Copy,
  Trash2,
  Edit,
  TrendingUp,
  CheckCircle,
  XCircle,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Trip, TripCategory, TripStatus } from '../../types';

export const TripsView: React.FC = () => {
  const {
    trips,
    reservations,
    expenses,
    addTrip,
    updateTrip,
    deleteTrip,
    duplicateTrip,
    setCurrentView,
    setSelectedTripId,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    destination: string;
    category: TripCategory;
    description: string;
    imageUrl: string;
    departureDate: string;
    returnDate: string;
    departureTime: string;
    returnTime: string;
    departureLocation: string;
    arrivalLocation: string;
    capacity: number;
    price: number;
    costEstimatePerPerson: number;
    responsibleUser: string;
    guideName: string;
    status: TripStatus;
    included: string[];
    notIncluded: string[];
    observations: string;
    waitlistActive: boolean;
  }>({
    name: '',
    destination: '',
    category: 'excursão',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    departureDate: '2026-11-20',
    returnDate: '2026-11-23',
    departureTime: '20:00',
    returnTime: '22:00',
    departureLocation: 'Metrô Barra Funda - São Paulo/SP',
    arrivalLocation: 'Hotel Central',
    capacity: 46,
    price: 1500,
    costEstimatePerPerson: 950,
    responsibleUser: 'Mariana Duarte',
    guideName: 'Lucas Guia',
    status: 'aberta',
    included: [
      'Transporte executivo com ar condicionado',
      'Hospedagem com café da manhã',
      'Seguro viagem contra acidentes',
      'Guia credenciado MTur',
    ],
    notIncluded: ['Almoços e bebidas', 'Despesas pessoais'],
    observations: '',
    waitlistActive: false,
  });

  const [newIncludedItem, setNewIncludedItem] = useState('');
  const [newNotIncludedItem, setNewNotIncludedItem] = useState('');

  const openNewTripModal = () => {
    setEditingTrip(null);
    setFormData({
      name: '',
      destination: '',
      category: 'excursão',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      departureDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      departureTime: '20:00',
      returnTime: '22:00',
      departureLocation: 'Metrô Barra Funda - São Paulo/SP',
      arrivalLocation: 'Hotel ou Pousada Central',
      capacity: 46,
      price: 1500,
      costEstimatePerPerson: 950,
      responsibleUser: 'Mariana Duarte',
      guideName: 'Lucas Guia',
      status: 'aberta',
      included: [
        'Transporte executivo com ar condicionado',
        'Hospedagem com café da manhã',
        'Seguro viagem MTur',
        'Guia acompanhante',
      ],
      notIncluded: ['Almoço e bebidas', 'Passeios opcionais'],
      observations: '',
      waitlistActive: false,
    });
    setIsModalOpen(true);
  };

  const openEditTripModal = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      name: trip.name,
      destination: trip.destination,
      category: trip.category,
      description: trip.description,
      imageUrl: trip.imageUrl,
      departureDate: trip.departureDate,
      returnDate: trip.returnDate,
      departureTime: trip.departureTime,
      returnTime: trip.returnTime,
      departureLocation: trip.departureLocation,
      arrivalLocation: trip.arrivalLocation,
      capacity: trip.capacity,
      price: trip.price,
      costEstimatePerPerson: trip.costEstimatePerPerson,
      responsibleUser: trip.responsibleUser,
      guideName: trip.guideName,
      status: trip.status,
      included: trip.included || [],
      notIncluded: trip.notIncluded || [],
      observations: trip.observations || '',
      waitlistActive: trip.waitlistActive || false,
    });
    setIsModalOpen(true);
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.destination) {
      alert('Por favor, preencha o nome e o destino da viagem.');
      return;
    }

    if (editingTrip) {
      updateTrip(editingTrip.id, formData);
    } else {
      addTrip(formData);
    }
    setIsModalOpen(false);
  };

  const handleAddIncluded = () => {
    if (newIncludedItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        included: [...prev.included, newIncludedItem.trim()],
      }));
      setNewIncludedItem('');
    }
  };

  const handleRemoveIncluded = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      included: prev.included.filter((_, i) => i !== idx),
    }));
  };

  const handleAddNotIncluded = () => {
    if (newNotIncludedItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        notIncluded: [...prev.notIncluded, newNotIncludedItem.trim()],
      }));
      setNewNotIncludedItem('');
    }
  };

  const handleRemoveNotIncluded = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      notIncluded: prev.notIncluded.filter((_, i) => i !== idx),
    }));
  };

  // Filter trips
  const filteredTrips = trips.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      t.guideName.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'todas' || t.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categoriesList: { id: string; label: string }[] = [
    { id: 'todas', label: 'Todas as Categorias' },
    { id: 'excursão', label: 'Excursão' },
    { id: 'passeio', label: 'Passeio' },
    { id: 'praia', label: 'Praia' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'aventura', label: 'Aventura' },
    { id: 'nacional', label: 'Nacional' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Viagens & Pacotes Turísticos</h1>
            <span className="rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-bold">
              {trips.length} cadastradas
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            O centro operacional do sistema: gerencie saídas, ocupação de vagas, itinerários e rentabilidade.
          </p>
        </div>

        <button
          onClick={openNewTripModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all active:scale-98 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>+ NOVA VIAGEM</span>
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
            placeholder="Buscar por nome da viagem, destino ou guia..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Plane className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="font-extrabold text-base text-slate-800">Você ainda não possui viagens nesta categoria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Cadastre um novo pacote turístico ou excursão para iniciar as vendas e preencher as vagas.
          </p>
          <button
            onClick={openNewTripModal}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            + Criar primeira viagem
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => {
            // Calculate Booked Travelers & Occupancy % (Requisito #8)
            const bookedTravelers = reservations
              .filter((r) => r.tripId === trip.id && r.status !== 'cancelada')
              .reduce((sum, r) => sum + r.travelerDetails.length, 0);

            const occupancyPct = trip.capacity > 0 ? ((bookedTravelers / trip.capacity) * 100).toFixed(1) : '0';
            const isFull = Number(occupancyPct) >= 100;
            const availableSeats = Math.max(0, trip.capacity - bookedTravelers);

            // Calculate Trip Finances (Requisito #15: Receita Total - Custo = Lucro e Margem %)
            const tripRevenue = reservations
              .filter((r) => r.tripId === trip.id && r.status !== 'cancelada')
              .reduce((sum, r) => sum + r.finalValue, 0);

            const tripExpenses = expenses
              .filter((e) => e.tripId === trip.id)
              .reduce((sum, e) => sum + e.amount, 0);

            const tripProfit = tripRevenue - tripExpenses;
            const tripMarginPct = tripRevenue > 0 ? ((tripProfit / tripRevenue) * 100).toFixed(1) : '0';

            return (
              <div
                key={trip.id}
                className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={trip.imageUrl}
                      alt={trip.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="rounded-lg bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {trip.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isFull ? (
                        <span className="rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md animate-pulse">
                          VIAGEM LOTADA
                        </span>
                      ) : (
                        <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-md">
                          {availableSeats} vagas restantes
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-base font-extrabold tracking-tight truncate drop-shadow-sm">{trip.name}</p>
                      <p className="text-xs text-slate-200 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-cyan-300" />
                        {trip.destination}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Dates & Times */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-2xl p-3 border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Saída</span>
                        <p className="font-bold text-slate-800">
                          {new Date(trip.departureDate).toLocaleDateString('pt-BR')} ({trip.departureTime})
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Retorno</span>
                        <p className="font-bold text-slate-800">
                          {new Date(trip.returnDate).toLocaleDateString('pt-BR')} ({trip.returnTime})
                        </p>
                      </div>
                    </div>

                    {/* Vagas & Capacidade (Requisito #8) */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-extrabold text-slate-800 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-blue-600" />
                          {bookedTravelers} / {trip.capacity} vagas ocupadas
                        </span>
                        <span className={`font-black text-sm ${isFull ? 'text-rose-600' : 'text-blue-600'}`}>
                          {occupancyPct}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 rounded-full ${
                            isFull ? 'bg-rose-500' : Number(occupancyPct) > 75 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, Number(occupancyPct))}%` }}
                        />
                      </div>
                      {trip.waitlistActive && (
                        <p className="text-[11px] font-semibold text-amber-700 mt-1 flex items-center gap-1">
                          ⚠️ Lista de espera ativada para esta viagem
                        </p>
                      )}
                    </div>

                    {/* Rentabilidade & Margem Financeira (Requisito #15) */}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                        <span>Lucro Estimado</span>
                        <span className="text-emerald-700">R$ {tripProfit.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Receita: R$ {tripRevenue.toLocaleString('pt-BR')}</span>
                        <span className="font-bold text-emerald-800">{tripMarginPct}% Margem</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-slate-100 p-4 bg-slate-50/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditTripModal(trip)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                      title="Editar viagem"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateTrip(trip.id)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors"
                      title="Duplicar pacote turístico para nova saída"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir a viagem "${trip.name}"?`)) {
                          deleteTrip(trip.id);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      title="Excluir viagem"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      setCurrentView('trip_detail');
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all"
                  >
                    <span>Operar Viagem</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Nova / Editar Viagem (Requisito #6 & #7) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {editingTrip ? 'Editar Viagem' : '+ Nova Viagem / Excursão'}
                </h2>
                <p className="text-xs text-slate-500">
                  Cadastre todos os detalhes operacionais, inclusões e financeiro do pacote.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {/* Row 1: Nome e Destino */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Viagem *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Porto Seguro All-Inclusive 5 Dias"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destino *</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Ex: Porto Seguro, BA"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 2: Categoria, Responsável, Guia */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="excursão">Excursão</option>
                    <option value="passeio">Passeio</option>
                    <option value="praia">Praia</option>
                    <option value="cultural">Cultural</option>
                    <option value="religioso">Religioso</option>
                    <option value="corporativo">Corporativo</option>
                    <option value="internacional">Internacional</option>
                    <option value="nacional">Nacional</option>
                    <option value="aventura">Aventura</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Responsável Comercial</label>
                  <input
                    type="text"
                    value={formData.responsibleUser}
                    onChange={(e) => setFormData({ ...formData, responsibleUser: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guia Credenciado</label>
                  <input
                    type="text"
                    value={formData.guideName}
                    onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Row 3: Datas e Horários */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Data Saída</label>
                  <input
                    type="date"
                    required
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Horário Saída</label>
                  <input
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Data Retorno</label>
                  <input
                    type="date"
                    required
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Horário Retorno</label>
                  <input
                    type="time"
                    value={formData.returnTime}
                    onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
                  />
                </div>
              </div>

              {/* Row 4: Locais de Embarque e Desembarque */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Local de Embarque</label>
                  <input
                    type="text"
                    value={formData.departureLocation}
                    onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                    placeholder="Ex: Metrô Barra Funda - Plataforma 06"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Local de Desembarque / Destino</label>
                  <input
                    type="text"
                    value={formData.arrivalLocation}
                    onChange={(e) => setFormData({ ...formData, arrivalLocation: e.target.value })}
                    placeholder="Ex: Hotel Beira Mar Praia"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Row 5: Capacidade, Preço e Custo */}
              <div className="grid grid-cols-3 gap-4 bg-blue-50/40 p-3.5 rounded-2xl border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacidade (Vagas) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preço Venda (R$) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.costEstimatePerPerson}
                    onChange={(e) => setFormData({ ...formData, costEstimatePerPerson: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-600"
                  />
                </div>
              </div>

              {/* Row 6: Imagem e Descrição */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Comercial</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Texto atrativo descrevendo o roteiro e diferenciais..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
                />
              </div>

              {/* Requisito #7: O que está Incluso / Não Incluso dinâmico */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Incluso */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>O que está INCLUSO:</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {formData.included.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1 text-xs border border-emerald-200/60"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIncluded(idx)}
                          className="text-rose-500 hover:text-rose-700 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newIncludedItem}
                      onChange={(e) => setNewIncludedItem(e.target.value)}
                      placeholder="+ Adicionar item incluso"
                      className="flex-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddIncluded();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddIncluded}
                      className="rounded-lg bg-emerald-600 text-white px-2 py-1 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Não Incluso */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-900">
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span>O que NÃO está incluso:</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {formData.notIncluded.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1 text-xs border border-rose-200/60"
                      >
                        <span className="truncate">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNotIncluded(idx)}
                          className="text-rose-500 hover:text-rose-700 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      value={newNotIncludedItem}
                      onChange={(e) => setNewNotIncludedItem(e.target.value)}
                      placeholder="+ Adicionar item não incluso"
                      className="flex-1 rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNotIncluded();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddNotIncluded}
                      className="rounded-lg bg-rose-600 text-white px-2 py-1 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Botões do Modal */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  {editingTrip ? 'Salvar Alterações' : 'Salvar Viagem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
