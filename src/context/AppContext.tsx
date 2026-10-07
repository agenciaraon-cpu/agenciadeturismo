import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Agency,
  User,
  UserRole,
  Trip,
  Customer,
  Traveler,
  Reservation,
  PaymentInstallment,
  Expense,
  Supplier,
  DocumentItem,
  ContractTemplate,
  ContractInstance,
  Lead,
  Task,
  AuditLog,
  TripDay,
  TripActivity,
  Quote,
  NotificationItem,
  BoardingStatus,
} from '../types';
import {
  DEMO_TENANT_ID,
  DEMO_AGENCY,
  DEMO_USERS,
  DEMO_TRIPS,
  DEMO_CUSTOMERS,
  DEMO_TRAVELERS,
  DEMO_RESERVATIONS,
  DEMO_INSTALLMENTS,
  DEMO_EXPENSES,
  DEMO_SUPPLIERS,
  DEMO_DOCUMENTS,
  DEMO_CONTRACT_TEMPLATE,
  DEMO_CONTRACT_INSTANCES,
  DEMO_LEADS,
  DEMO_TASKS,
  DEMO_AUDIT_LOGS,
  DEMO_ITINERARIES,
  DEMO_SAAS_PLANS,
} from '../data/demoData';

export type AppView =
  | 'dashboard'
  | 'trips'
  | 'trip_detail'
  | 'reservations'
  | 'travelers'
  | 'customers'
  | 'finance'
  | 'suppliers'
  | 'documents'
  | 'contracts'
  | 'itineraries'
  | 'boarding'
  | 'seats'
  | 'calendar'
  | 'tasks'
  | 'crm'
  | 'quotes'
  | 'communication'
  | 'ai'
  | 'reports'
  | 'settings'
  | 'admin_saas'
  | 'traveler_portal';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedTripId: string | null;
  setSelectedTripId: (id: string | null) => void;
  selectedTravelerId: string | null;
  setSelectedTravelerId: (id: string | null) => void;
  selectedReservationCode: string | null;
  setSelectedReservationCode: (code: string | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;

  // Multi-tenancy & User
  tenantId: string;
  agency: Agency;
  updateAgency: (updates: Partial<Agency>) => void;
  currentUser: User;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  users: User[];

  // Entities state
  trips: Trip[];
  customers: Customer[];
  travelers: Traveler[];
  reservations: Reservation[];
  installments: PaymentInstallment[];
  expenses: Expense[];
  suppliers: Supplier[];
  documents: DocumentItem[];
  contractTemplates: ContractTemplate[];
  contracts: ContractInstance[];
  leads: Lead[];
  tasks: Task[];
  auditLogs: AuditLog[];
  itineraries: Record<string, TripDay[]>;
  quotes: Quote[];
  saasPlans: typeof DEMO_SAAS_PLANS;

  // Actions: Trips
  addTrip: (tripData: Omit<Trip, 'id' | 'tenantId' | 'createdAt'>) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  duplicateTrip: (id: string) => void;

  // Actions: Customers & Travelers
  addCustomer: (custData: Omit<Customer, 'id' | 'tenantId' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addTraveler: (travData: Omit<Traveler, 'id' | 'tenantId' | 'createdAt'>) => Traveler;
  updateTraveler: (id: string, updates: Partial<Traveler>) => void;

  // Actions: Reservations
  addReservation: (resData: {
    customerId: string;
    tripId: string;
    travelerIds: string[];
    totalValue: number;
    discount: number;
    finalValue: number;
    paymentMethod: Reservation['paymentMethod'];
    installmentCount: number;
    notes?: string;
  }) => Reservation;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;

  // Actions: Finance
  markInstallmentPaid: (installmentId: string, paymentMethod?: string) => void;
  addExpense: (expenseData: Omit<Expense, 'id' | 'tenantId'>) => void;
  markExpensePaid: (expenseId: string) => void;
  deleteExpense: (id: string) => void;

  // Actions: Suppliers
  addSupplier: (supData: Omit<Supplier, 'id' | 'tenantId'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Actions: Itinerary
  saveTripItinerary: (tripId: string, days: TripDay[]) => void;

  // Actions: Documents
  addDocument: (docData: Omit<DocumentItem, 'id' | 'tenantId'>) => void;
  updateDocumentStatus: (id: string, status: DocumentItem['status'], rejectionReason?: string) => void;

  // Actions: Contracts
  generateContractForReservation: (reservationId: string) => ContractInstance;
  signContract: (contractId: string, signerName: string, signerCpf: string) => void;

  // Actions: Seats & Boarding
  assignSeat: (reservationId: string, travelerId: string, seatNumber: string) => boolean;
  updateBoardingStatus: (reservationId: string, travelerId: string, status: BoardingStatus) => void;
  completeDigitalCheckIn: (reservationId: string, travelerId: string, updatedData?: Partial<Traveler>) => void;

  // Actions: CRM & Leads
  addLead: (leadData: Omit<Lead, 'id' | 'tenantId' | 'createdAt'>) => void;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;
  convertLeadToBooking: (leadId: string, tripId: string) => void;

  // Actions: Tasks
  addTask: (taskData: Omit<Task, 'id' | 'tenantId'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Notifications & Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Reset to Demo Data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'raon_travel_app_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedTripId, setSelectedTripId] = useState<string | null>('trip-01');
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null);
  const [selectedReservationCode, setSelectedReservationCode] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Multi-tenancy & Current User
  const [tenantId] = useState<string>(DEMO_TENANT_ID);
  const [agency, setAgency] = useState<Agency>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_agency`);
    return saved ? JSON.parse(saved) : DEMO_AGENCY;
  });
  const [users] = useState<User[]>(DEMO_USERS);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');

  const currentUser = useMemo(() => {
    return users.find((u) => u.role === currentRole) || users[0];
  }, [users, currentRole]);

  // Main State entities
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_trips`);
    return saved ? JSON.parse(saved) : DEMO_TRIPS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : DEMO_CUSTOMERS;
  });

  const [travelers, setTravelers] = useState<Traveler[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_travelers`);
    return saved ? JSON.parse(saved) : DEMO_TRAVELERS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reservations`);
    return saved ? JSON.parse(saved) : DEMO_RESERVATIONS;
  });

  const [installments, setInstallments] = useState<PaymentInstallment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_installments`);
    return saved ? JSON.parse(saved) : DEMO_INSTALLMENTS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : DEMO_EXPENSES;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_suppliers`);
    return saved ? JSON.parse(saved) : DEMO_SUPPLIERS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_documents`);
    return saved ? JSON.parse(saved) : DEMO_DOCUMENTS;
  });

  const [contractTemplates] = useState<ContractTemplate[]>([DEMO_CONTRACT_TEMPLATE]);

  const [contracts, setContracts] = useState<ContractInstance[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contracts`);
    return saved ? JSON.parse(saved) : DEMO_CONTRACT_INSTANCES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : DEMO_LEADS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : DEMO_TASKS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : DEMO_AUDIT_LOGS;
  });

  const [itineraries, setItineraries] = useState<Record<string, TripDay[]>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_itineraries`);
    return saved ? JSON.parse(saved) : DEMO_ITINERARIES;
  });

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const saasPlans = DEMO_SAAS_PLANS;

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_agency`, JSON.stringify(agency));
  }, [agency]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_trips`, JSON.stringify(trips));
  }, [trips]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_travelers`, JSON.stringify(travelers));
  }, [travelers]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reservations`, JSON.stringify(reservations));
  }, [reservations]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_installments`, JSON.stringify(installments));
  }, [installments]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
  }, [suppliers]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_documents`, JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contracts`, JSON.stringify(contracts));
  }, [contracts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_itineraries`, JSON.stringify(itineraries));
  }, [itineraries]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper for audit logging
  const logAction = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      tenantId,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Agency updates
  const updateAgency = (updates: Partial<Agency>) => {
    setAgency((prev) => ({ ...prev, ...updates }));
    showToast('Configurações da agência salvas com sucesso!');
    logAction('Configuração', 'Atualizou dados cadastrais da agência');
  };

  // Trips CRUD
  const addTrip = (tripData: Omit<Trip, 'id' | 'tenantId' | 'createdAt'>): Trip => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
    };
    setTrips((prev) => [newTrip, ...prev]);
    showToast(`Viagem "${newTrip.name}" cadastrada!`);
    logAction('Nova Viagem', `Criou a viagem ${newTrip.name} (${newTrip.destination})`);
    return newTrip;
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Viagem atualizada com sucesso!');
    logAction('Edição de Viagem', `Atualizou a viagem ID ${id}`);
  };

  const deleteTrip = (id: string) => {
    const trip = trips.find((t) => t.id === id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    showToast(`Viagem "${trip?.name || id}" excluída.`, 'info');
    logAction('Exclusão de Viagem', `Excluiu a viagem ${trip?.name || id}`);
  };

  const duplicateTrip = (id: string) => {
    const original = trips.find((t) => t.id === id);
    if (!original) return;
    const duplicated: Trip = {
      ...original,
      id: `trip-${Date.now()}`,
      name: `${original.name} (Nova Saída)`,
      departureDate: '2026-12-15',
      returnDate: '2026-12-20',
      status: 'aberta',
      createdAt: new Date().toISOString(),
    };
    setTrips((prev) => [duplicated, ...prev]);
    showToast(`Viagem duplicada a partir do pacote "${original.name}"!`);
    logAction('Duplicação de Pacote', `Duplicou a viagem ${original.name}`);
  };

  // Customers & Travelers
  const addCustomer = (custData: Omit<Customer, 'id' | 'tenantId' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Cliente ${newCust.name} cadastrado!`);
    logAction('Novo Cliente', `Cadastrou o cliente ${newCust.name} (CPF ${newCust.cpf})`);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Dados do cliente atualizados!');
  };

  const addTraveler = (travData: Omit<Traveler, 'id' | 'tenantId' | 'createdAt'>): Traveler => {
    const newTrav: Traveler = {
      ...travData,
      id: `trav-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTravelers((prev) => [newTrav, ...prev]);
    showToast(`Viajante ${newTrav.name} registrado com sucesso!`);
    logAction('Novo Viajante', `Cadastrou viajante ${newTrav.name}`);
    return newTrav;
  };

  const updateTraveler = (id: string, updates: Partial<Traveler>) => {
    setTravelers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Dados do viajante atualizados!');
  };

  // Reservations
  const addReservation = (resData: {
    customerId: string;
    tripId: string;
    travelerIds: string[];
    totalValue: number;
    discount: number;
    finalValue: number;
    paymentMethod: Reservation['paymentMethod'];
    installmentCount: number;
    notes?: string;
  }): Reservation => {
    const resCode = `RES-${1000 + reservations.length + 1}`;
    const newResId = `res-${Date.now()}`;

    const travelerDetails = resData.travelerIds.map((travId) => ({
      travelerId: travId,
      boardingStatus: 'pendente' as BoardingStatus,
      digitalCheckInDone: false,
    }));

    const newReservation: Reservation = {
      id: newResId,
      code: resCode,
      tenantId,
      customerId: resData.customerId,
      tripId: resData.tripId,
      travelerDetails,
      totalValue: resData.totalValue,
      discount: resData.discount,
      finalValue: resData.finalValue,
      paymentMethod: resData.paymentMethod,
      status: resData.installmentCount === 1 && resData.paymentMethod === 'pix' ? 'paga' : 'confirmada',
      notes: resData.notes,
      createdAt: new Date().toISOString(),
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Generate Installments
    const count = Math.max(1, resData.installmentCount);
    const installmentAmount = Math.round((resData.finalValue / count) * 100) / 100;
    const newInstallments: PaymentInstallment[] = [];
    const today = new Date();

    for (let i = 1; i <= count; i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + (i - 1));
      const isPaidDirectly = i === 1 && resData.installmentCount === 1 && resData.paymentMethod === 'pix';

      newInstallments.push({
        id: `inst-${Date.now()}-${i}`,
        tenantId,
        reservationId: newResId,
        customerId: resData.customerId,
        tripId: resData.tripId,
        installmentNumber: i,
        totalInstallments: count,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: installmentAmount,
        status: isPaidDirectly ? 'pago' : 'pendente',
        paidAt: isPaidDirectly ? new Date().toISOString() : undefined,
        paidAmount: isPaidDirectly ? installmentAmount : undefined,
        paymentMethod: resData.paymentMethod,
      });
    }

    setInstallments((prev) => [...prev, ...newInstallments]);

    // Check if trip is full
    const trip = trips.find((t) => t.id === resData.tripId);
    if (trip) {
      const currentBooked = reservations
        .filter((r) => r.tripId === trip.id && r.status !== 'cancelada')
        .reduce((sum, r) => sum + r.travelerDetails.length, 0) + resData.travelerIds.length;

      if (currentBooked >= trip.capacity) {
        updateTrip(trip.id, { status: 'lotada' });
      }
    }

    showToast(`Reserva ${resCode} criada com sucesso para ${resData.travelerIds.length} passageiro(s)!`);
    logAction('Nova Reserva', `Criou a reserva ${resCode} com ${count} parcela(s)`);
    return newReservation;
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(`Status da reserva atualizado para "${status}".`);
    logAction('Alteração de Reserva', `Reserva ID ${id} alterada para ${status}`);
  };

  // Finance Actions
  const markInstallmentPaid = (installmentId: string, paymentMethod: string = 'PIX') => {
    setInstallments((prev) =>
      prev.map((inst) => {
        if (inst.id === installmentId) {
          return {
            ...inst,
            status: 'pago',
            paidAt: new Date().toISOString(),
            paidAmount: inst.amount,
            paymentMethod,
          };
        }
        return inst;
      })
    );

    // Update reservation status if all installments paid
    const target = installments.find((i) => i.id === installmentId);
    if (target) {
      const reservationId = target.reservationId;
      const related = installments.filter((i) => i.reservationId === reservationId);
      const remainingUnpaid = related.filter((i) => i.id !== installmentId && i.status !== 'pago');

      if (remainingUnpaid.length === 0) {
        setReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status: 'paga' } : r)));
      } else {
        setReservations((prev) => prev.map((r) => (r.id === reservationId && r.status !== 'paga' ? { ...r, status: 'parcialmente_paga' } : r)));
      }
    }

    showToast('Pagamento confirmado e registrado no financeiro!');
    logAction('Baixa Financeira', `Confirmou pagamento da parcela ${installmentId}`);
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'tenantId'>) => {
    const newExp: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      tenantId,
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast('Despesa registrada no financeiro!');
    logAction('Nova Despesa', `Cadastrou despesa: ${newExp.description} - R$ ${newExp.amount}`);
  };

  const markExpensePaid = (expenseId: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? { ...e, status: 'pago', paidAt: new Date().toISOString().split('T')[0] } : e))
    );
    showToast('Despesa marcada como paga!');
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Despesa removida.', 'info');
  };

  // Suppliers Actions
  const addSupplier = (supData: Omit<Supplier, 'id' | 'tenantId'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup-${Date.now()}`,
      tenantId,
    };
    setSuppliers((prev) => [newSup, ...prev]);
    showToast(`Fornecedor ${newSup.name} cadastrado!`);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Fornecedor atualizado!');
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    showToast('Fornecedor removido.', 'info');
  };

  // Itinerary
  const saveTripItinerary = (tripId: string, days: TripDay[]) => {
    setItineraries((prev) => ({
      ...prev,
      [tripId]: days,
    }));
    showToast('Roteiro da viagem salvo com sucesso!');
    logAction('Roteiro Atualizado', `Salvou roteiro de ${days.length} dias para viagem ID ${tripId}`);
  };

  // Documents
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'tenantId'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      tenantId,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Documento "${newDoc.title}" registrado!`);
  };

  const updateDocumentStatus = (id: string, status: DocumentItem['status'], rejectionReason?: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, rejectionReason } : d))
    );
    showToast(`Status do documento atualizado para "${status}".`);
  };

  // Contracts
  const generateContractForReservation = (reservationId: string): ContractInstance => {
    const res = reservations.find((r) => r.id === reservationId);
    const cust = customers.find((c) => c.id === res?.customerId);
    const trip = trips.find((t) => t.id === res?.tripId);
    const travs = travelers.filter((t) => res?.travelerDetails.some((d) => d.travelerId === t.id));

    const template = contractTemplates[0] || DEMO_CONTRACT_TEMPLATE;
    const travelerListText = travs.map((t, idx) => `${idx + 1}. ${t.name} (Doc: ${t.documentType} ${t.documentNumber})`).join('\n');

    let content = template.content
      .replace(/{{nome_agencia}}/g, agency.name)
      .replace(/{{cnpj_agencia}}/g, agency.cnpj)
      .replace(/{{endereco_agencia}}/g, agency.address)
      .replace(/{{nome_cliente}}/g, cust?.name || 'Cliente')
      .replace(/{{cpf}}/g, cust?.cpf || '')
      .replace(/{{cidade_cliente}}/g, `${cust?.city || 'São Paulo'}/${cust?.state || 'SP'}`)
      .replace(/{{viagem}}/g, trip?.name || 'Viagem')
      .replace(/{{destino}}/g, trip?.destination || '')
      .replace(/{{data_saida}}/g, trip?.departureDate || '')
      .replace(/{{data_retorno}}/g, trip?.returnDate || '')
      .replace(/{{valor}}/g, `R$ ${res?.finalValue.toLocaleString('pt-BR') || '0,00'}`)
      .replace(/{{codigo_reserva}}/g, res?.code || '')
      .replace(/{{lista_passageiros}}/g, travelerListText)
      .replace(/{{data_hoje}}/g, new Date().toLocaleDateString('pt-BR'));

    const newContract: ContractInstance = {
      id: `cnt-${Date.now()}`,
      tenantId,
      reservationId,
      customerId: cust?.id || '',
      tripId: trip?.id || '',
      templateId: template.id,
      title: `Contrato - ${cust?.name || 'Cliente'} (${trip?.name || 'Viagem'})`,
      renderedContent: content,
      signed: false,
    };

    setContracts((prev) => [newContract, ...prev]);
    showToast('Contrato gerado com sucesso!');
    logAction('Contrato Gerado', `Gerou minuta contratual para reserva ${res?.code}`);
    return newContract;
  };

  const signContract = (contractId: string, signerName: string, signerCpf: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              signed: true,
              signedAt: new Date().toISOString(),
              signerName,
              signerCpf,
              signerIp: '189.120.45.102',
            }
          : c
      )
    );
    showToast('Contrato assinado eletronicamente com sucesso!');
    logAction('Assinatura Digital', `Contrato ${contractId} assinado por ${signerName}`);
  };

  // Seats & Boarding
  const assignSeat = (reservationId: string, travelerId: string, seatNumber: string): boolean => {
    // Check if seat already taken in that trip
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return false;
    const tripId = res.tripId;

    const isOccupied = reservations
      .filter((r) => r.tripId === tripId && r.status !== 'cancelada')
      .some((r) =>
        r.travelerDetails.some(
          (td) => td.seatNumber === seatNumber && !(r.id === reservationId && td.travelerId === travelerId)
        )
      );

    if (isOccupied) {
      showToast(`O assento ${seatNumber} já está ocupado!`, 'error');
      return false;
    }

    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            travelerDetails: r.travelerDetails.map((td) =>
              td.travelerId === travelerId ? { ...td, seatNumber } : td
            ),
          };
        }
        return r;
      })
    );

    showToast(`Assento ${seatNumber} atribuído com sucesso!`);
    logAction('Mapa de Assentos', `Atribuiu assento ${seatNumber} para viajante ID ${travelerId}`);
    return true;
  };

  const updateBoardingStatus = (reservationId: string, travelerId: string, status: BoardingStatus) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            travelerDetails: r.travelerDetails.map((td) =>
              td.travelerId === travelerId ? { ...td, boardingStatus: status } : td
            ),
          };
        }
        return r;
      })
    );
    showToast(`Status de embarque: ${status === 'embarcou' ? '✅ Embarcou' : status === 'nao_embarcou' ? '❌ Não compareceu' : '⏳ Pendente'}`);
  };

  const completeDigitalCheckIn = (reservationId: string, travelerId: string, updatedData?: Partial<Traveler>) => {
    if (updatedData) {
      updateTraveler(travelerId, updatedData);
    }
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === reservationId) {
          return {
            ...r,
            travelerDetails: r.travelerDetails.map((td) =>
              td.travelerId === travelerId
                ? { ...td, digitalCheckInDone: true, checkInCompletedAt: new Date().toISOString() }
                : td
            ),
          };
        }
        return r;
      })
    );
    showToast('Check-in digital pré-viagem realizado com sucesso! Cartão de embarque emitido.');
  };

  // CRM Leads
  const addLead = (leadData: Omit<Lead, 'id' | 'tenantId' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);
    showToast(`Lead ${newLead.name} adicionado ao CRM!`);
  };

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    showToast('Lead movido de etapa no funil!');
  };

  const convertLeadToBooking = (leadId: string, tripId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    // Create Customer
    const newCust = addCustomer({
      name: lead.name,
      cpf: '000.000.000-00',
      email: lead.email,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      address: 'A preencher',
      city: 'São Paulo',
      state: 'SP',
      notes: `Convertido do Lead CRM (${lead.source})`,
    });

    // Create Traveler
    const newTrav = addTraveler({
      customerId: newCust.id,
      name: lead.name,
      cpf: '000.000.000-00',
      rg: 'A preencher',
      birthDate: '1990-01-01',
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      email: lead.email,
      documentType: 'RG',
      documentNumber: 'A preencher',
      emergencyContact: 'A preencher',
      emergencyPhone: lead.phone,
    });

    // Create Booking
    const trip = trips.find((t) => t.id === tripId);
    const tripPrice = trip ? trip.price : lead.estimatedValue || 1500;

    addReservation({
      customerId: newCust.id,
      tripId,
      travelerIds: [newTrav.id],
      totalValue: tripPrice,
      discount: 0,
      finalValue: tripPrice,
      paymentMethod: 'pix',
      installmentCount: 1,
      notes: `Venda gerada diretamente do lead ${lead.name}`,
    });

    // Update lead stage to venda
    updateLeadStage(leadId, 'venda');
    showToast(`Lead ${lead.name} convertido em Cliente e Reserva com sucesso!`);
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'tenantId'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      tenantId,
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Tarefa criada!');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'concluida' ? 'pendente' : 'concluida';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Tarefa removida.');
  };

  // Reset Data to Demo State
  const resetDemoData = () => {
    localStorage.clear();
    setAgency(DEMO_AGENCY);
    setTrips(DEMO_TRIPS);
    setCustomers(DEMO_CUSTOMERS);
    setTravelers(DEMO_TRAVELERS);
    setReservations(DEMO_RESERVATIONS);
    setInstallments(DEMO_INSTALLMENTS);
    setExpenses(DEMO_EXPENSES);
    setSuppliers(DEMO_SUPPLIERS);
    setDocuments(DEMO_DOCUMENTS);
    setContracts(DEMO_CONTRACT_INSTANCES);
    setLeads(DEMO_LEADS);
    setTasks(DEMO_TASKS);
    setAuditLogs(DEMO_AUDIT_LOGS);
    setItineraries(DEMO_ITINERARIES);
    showToast('Dados de demonstração restaurados para o padrão original da Horizonte Turismo!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedTripId,
        setSelectedTripId,
        selectedTravelerId,
        setSelectedTravelerId,
        selectedReservationCode,
        setSelectedReservationCode,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        tenantId,
        agency,
        updateAgency,
        currentUser,
        currentRole,
        setCurrentRole,
        users,

        trips,
        customers,
        travelers,
        reservations,
        installments,
        expenses,
        suppliers,
        documents,
        contractTemplates,
        contracts,
        leads,
        tasks,
        auditLogs,
        itineraries,
        quotes,
        saasPlans,

        addTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,

        addCustomer,
        updateCustomer,
        addTraveler,
        updateTraveler,

        addReservation,
        updateReservationStatus,

        markInstallmentPaid,
        addExpense,
        markExpensePaid,
        deleteExpense,

        addSupplier,
        updateSupplier,
        deleteSupplier,

        saveTripItinerary,

        addDocument,
        updateDocumentStatus,

        generateContractForReservation,
        signContract,

        assignSeat,
        updateBoardingStatus,
        completeDigitalCheckIn,

        addLead,
        updateLeadStage,
        convertLeadToBooking,

        addTask,
        toggleTaskStatus,
        deleteTask,

        toasts,
        showToast,
        removeToast,

        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
