export type UserRole =
  | 'admin'
  | 'gerente'
  | 'comercial'
  | 'operacional'
  | 'financeiro'
  | 'guia'
  | 'saas_owner';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo: string;
  primaryColor: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  instagram: string;
  website: string;
  cnpj: string;
  currency: string;
  timezone: string;
  termsAndPolicies: string;
  planId: string;
  planName: string;
  subscriptionStatus: 'active' | 'trial' | 'past_due';
  trialEndsAt?: string;
}

export interface SaasPlan {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  maxTripsPerMonth: number;
  maxUsers: number;
  features: string[];
  isPopular?: boolean;
}

export type TripCategory =
  | 'excursão'
  | 'passeio'
  | 'praia'
  | 'cultural'
  | 'religioso'
  | 'corporativo'
  | 'internacional'
  | 'nacional'
  | 'aventura'
  | 'outro';

export type TripStatus =
  | 'rascunho'
  | 'aberta'
  | 'lotada'
  | 'em_andamento'
  | 'concluida'
  | 'cancelada';

export interface TripActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
}

export interface TripDay {
  id: string;
  dayNumber: number;
  date?: string;
  title: string;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  tenantId: string;
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
  observations?: string;
  waitlistActive: boolean;
  busLayoutType?: 'bus44' | 'bus48' | 'van15';
  createdAt: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  cpf: string;
  rg?: string;
  email: string;
  phone: string;
  whatsapp: string;
  birthDate?: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
  createdAt: string;
}

export type BoardingStatus = 'embarcou' | 'nao_embarcou' | 'pendente';

export interface Traveler {
  id: string;
  tenantId: string;
  customerId: string; // The paying customer / purchaser
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  documentType: 'RG' | 'CPF' | 'Passaporte' | 'CNH';
  documentNumber: string;
  documentValidity?: string;
  emergencyContact: string;
  emergencyPhone: string;
  healthObservations?: string;
  dietaryRestrictions?: string;
  createdAt: string;
}

export type ReservationStatus =
  | 'pre_reserva'
  | 'aguardando_pagamento'
  | 'confirmada'
  | 'parcialmente_paga'
  | 'paga'
  | 'cancelada'
  | 'lista_espera';

export interface ReservationTravelerDetail {
  travelerId: string;
  seatNumber?: string;
  boardingLocation?: string;
  boardingStatus: BoardingStatus;
  digitalCheckInDone: boolean;
  checkInCompletedAt?: string;
}

export interface Reservation {
  id: string;
  code: string;
  tenantId: string;
  customerId: string;
  tripId: string;
  travelerDetails: ReservationTravelerDetail[];
  totalValue: number;
  discount: number;
  finalValue: number;
  paymentMethod: 'pix' | 'cartao_credito' | 'boleto' | 'transferencia' | 'dinheiro';
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
}

export type InstallmentStatus = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface PaymentInstallment {
  id: string;
  tenantId: string;
  reservationId: string;
  customerId: string;
  tripId: string;
  installmentNumber: number;
  totalInstallments: number;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  paidAt?: string;
  paidAmount?: number;
  paymentMethod?: string;
  receiptUrl?: string;
}

export type ExpenseCategory =
  | 'transporte'
  | 'hotel'
  | 'fornecedores'
  | 'guias'
  | 'alimentacao'
  | 'marketing'
  | 'taxas'
  | 'outros';

export interface Expense {
  id: string;
  tenantId: string;
  tripId?: string;
  category: ExpenseCategory;
  description: string;
  supplierId?: string;
  amount: number;
  dueDate: string;
  status: 'pendente' | 'pago';
  paidAt?: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  category:
    | 'hotel'
    | 'pousada'
    | 'transportadora'
    | 'motorista'
    | 'guia'
    | 'restaurante'
    | 'passeios'
    | 'receptivo'
    | 'seguradora'
    | 'outro';
  phone: string;
  whatsapp: string;
  email: string;
  serviceDescription: string;
  standardPrice?: number;
  notes?: string;
}

export type DocumentType =
  | 'rg'
  | 'cpf'
  | 'passaporte'
  | 'cnh'
  | 'contrato'
  | 'comprovante'
  | 'voucher'
  | 'autorizacao_menor'
  | 'outro';

export type DocumentStatus = 'recebido' | 'pendente' | 'recusado';

export interface DocumentItem {
  id: string;
  tenantId: string;
  travelerId?: string;
  customerId?: string;
  tripId?: string;
  reservationId?: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
  rejectionReason?: string;
}

export interface ContractTemplate {
  id: string;
  tenantId: string;
  title: string;
  content: string; // contains {{nome_cliente}}, {{cpf}}, {{viagem}}, {{valor}}, {{data}}, {{destino}}
  isDefault: boolean;
}

export interface ContractInstance {
  id: string;
  tenantId: string;
  reservationId: string;
  customerId: string;
  tripId: string;
  templateId: string;
  title: string;
  renderedContent: string;
  signed: boolean;
  signedAt?: string;
  signerName?: string;
  signerCpf?: string;
  signerIp?: string;
}

export type CrmStage =
  | 'novo_lead'
  | 'contato'
  | 'interessado'
  | 'orcamento'
  | 'negociacao'
  | 'pagamento'
  | 'venda'
  | 'pos_venda';

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  source: 'whatsapp' | 'instagram' | 'indicacao' | 'site' | 'facebook' | 'outro';
  stage: CrmStage;
  tripInterest?: string;
  estimatedValue?: number;
  assignedTo: string;
  notes?: string;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  serviceName: string;
  category: string;
  unitCost: number;
  unitPrice: number;
  quantity: number;
}

export interface Quote {
  id: string;
  code: string;
  tenantId: string;
  leadId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  destination: string;
  passengersCount: number;
  travelDate?: string;
  items: QuoteItem[];
  totalCost: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  marginPct: number;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'recusado';
  notes?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  priority: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_andamento' | 'concluida';
  tripId?: string;
  customerId?: string;
  description?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  tenantId: string;
  type: 'urgente' | 'atencao' | 'sucesso' | 'info';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: string;
}
