import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  User,
  Users,
  Plane,
  BookmarkCheck,
  Truck,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    customers,
    travelers,
    trips,
    reservations,
    suppliers,
    setCurrentView,
    setSelectedTripId,
    setSelectedTravelerId,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const clean = query.trim().toLowerCase();

  const matchedCustomers = clean
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(clean) ||
          c.cpf.includes(clean) ||
          c.email.toLowerCase().includes(clean) ||
          c.phone.includes(clean)
      ).slice(0, 4)
    : [];

  const matchedTravelers = clean
    ? travelers.filter(
        (t) =>
          t.name.toLowerCase().includes(clean) ||
          t.cpf.includes(clean) ||
          t.documentNumber.includes(clean)
      ).slice(0, 4)
    : [];

  const matchedTrips = clean
    ? trips.filter(
        (t) =>
          t.name.toLowerCase().includes(clean) ||
          t.destination.toLowerCase().includes(clean) ||
          t.category.toLowerCase().includes(clean)
      ).slice(0, 4)
    : [];

  const matchedReservations = clean
    ? reservations.filter(
        (r) =>
          r.code.toLowerCase().includes(clean) ||
          r.status.toLowerCase().includes(clean)
      ).slice(0, 4)
    : [];

  const matchedSuppliers = clean
    ? suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(clean) ||
          s.company.toLowerCase().includes(clean) ||
          s.category.toLowerCase().includes(clean)
      ).slice(0, 3)
    : [];

  const hasResults =
    matchedCustomers.length > 0 ||
    matchedTravelers.length > 0 ||
    matchedTrips.length > 0 ||
    matchedReservations.length > 0 ||
    matchedSuppliers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar clientes, viajantes, viagens, reservas, fornecedores..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs">Exemplo: digite "João", "Porto Seguro", "RES-1001" ou "translider".</p>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-600">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Tente pesquisar por nome, CPF ou código da reserva.</p>
            </div>
          )}

          {/* Customers Section */}
          {matchedCustomers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <User className="h-3.5 w-3.5" />
                <span>Clientes (Compradores)</span>
              </div>
              <div className="space-y-1">
                {matchedCustomers.map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => {
                      setCurrentView('customers');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-blue-50/70 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{cust.name}</p>
                      <p className="text-[11px] text-slate-500">CPF: {cust.cpf} • {cust.phone} • {cust.city}/{cust.state}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Travelers Section */}
          {matchedTravelers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Users className="h-3.5 w-3.5" />
                <span>Viajantes (Passageiros)</span>
              </div>
              <div className="space-y-1">
                {matchedTravelers.map((trav) => (
                  <button
                    key={trav.id}
                    onClick={() => {
                      setSelectedTravelerId(trav.id);
                      setCurrentView('travelers');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-cyan-50/70 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-cyan-800">{trav.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {trav.documentType}: {trav.documentNumber} • Emergência: {trav.emergencyContact} ({trav.emergencyPhone})
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-cyan-700" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trips Section */}
          {matchedTrips.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Plane className="h-3.5 w-3.5" />
                <span>Viagens & Pacotes</span>
              </div>
              <div className="space-y-1">
                {matchedTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => {
                      setSelectedTripId(trip.id);
                      setCurrentView('trips');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={trip.imageUrl} alt={trip.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{trip.name}</p>
                        <p className="text-[11px] text-slate-500">{trip.destination} • Saída: {trip.departureDate} • R$ {trip.price.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reservations Section */}
          {matchedReservations.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <BookmarkCheck className="h-3.5 w-3.5" />
                <span>Reservas</span>
              </div>
              <div className="space-y-1">
                {matchedReservations.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      setCurrentView('reservations');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Reserva {res.code}</p>
                      <p className="text-[11px] text-slate-500">
                        Total: R$ {res.finalValue.toLocaleString('pt-BR')} • {res.travelerDetails.length} passageiro(s) • Status: {res.status}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suppliers Section */}
          {matchedSuppliers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                <Truck className="h-3.5 w-3.5" />
                <span>Fornecedores</span>
              </div>
              <div className="space-y-1">
                {matchedSuppliers.map((sup) => (
                  <button
                    key={sup.id}
                    onClick={() => {
                      setCurrentView('suppliers');
                      setIsGlobalSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 text-left transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{sup.name}</p>
                      <p className="text-[11px] text-slate-500">{sup.company} • {sup.category} • {sup.phone}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
