/**
 * RAON TRAVEL - DADOS DEMO
 * Agência de demonstração: "Agência Horizonte Turismo"
 * Todos os dados contidos neste arquivo são fictícios para simulação de operação SaaS.
 */

import {
  Agency,
  Customer,
  Traveler,
  Trip,
  TripDay,
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
  SaasPlan,
  User,
} from '../types';

export const DEMO_TENANT_ID = 'horizonte-turismo-01';

export const DEMO_AGENCY: Agency = {
  id: DEMO_TENANT_ID,
  name: 'Agência Horizonte Turismo',
  slug: 'horizonte-turismo',
  logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&h=200&q=80',
  primaryColor: '#2563EB',
  phone: '(11) 3289-4500',
  whatsapp: '11987654321',
  email: 'contato@horizonteturismo.com.br',
  address: 'Av. Paulista, 1471 - Sala 804',
  city: 'São Paulo',
  state: 'SP',
  instagram: '@horizonte.turismo',
  website: 'https://horizonteturismo.com.br',
  cnpj: '18.234.567/0001-89',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  termsAndPolicies:
    'Cancelamentos até 30 dias antes da viagem possuem reembolso de 90%. Menores de 18 anos desacompanhados necessitam de autorização com firma reconhecida.',
  planId: 'plan-pro',
  planName: 'Plano Pro',
  subscriptionStatus: 'active',
  trialEndsAt: '2026-12-31T23:59:59Z',
};

export const DEMO_USERS: User[] = [
  {
    id: 'user-01',
    tenantId: DEMO_TENANT_ID,
    name: 'Carlos Mendes',
    email: 'carlos@horizonteturismo.com.br',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
    phone: '(11) 98765-4321',
  },
  {
    id: 'user-02',
    tenantId: DEMO_TENANT_ID,
    name: 'Mariana Duarte',
    email: 'mariana@horizonteturismo.com.br',
    role: 'gerente',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    phone: '(11) 97654-3210',
  },
  {
    id: 'user-03',
    tenantId: DEMO_TENANT_ID,
    name: 'Rodrigo Santoro',
    email: 'rodrigo@horizonteturismo.com.br',
    role: 'comercial',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    phone: '(11) 96543-2109',
  },
  {
    id: 'user-04',
    tenantId: DEMO_TENANT_ID,
    name: 'Patrícia Lima',
    email: 'patricia@horizonteturismo.com.br',
    role: 'operacional',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    phone: '(11) 95432-1098',
  },
  {
    id: 'user-05',
    tenantId: DEMO_TENANT_ID,
    name: 'Fernanda Souza',
    email: 'fernanda@horizonteturismo.com.br',
    role: 'financeiro',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    phone: '(11) 94321-0987',
  },
  {
    id: 'user-06',
    tenantId: DEMO_TENANT_ID,
    name: 'Lucas Guia',
    email: 'lucas.guia@horizonteturismo.com.br',
    role: 'guia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    phone: '(11) 93210-9876',
  },
];

export const DEMO_SAAS_PLANS: SaasPlan[] = [
  {
    id: 'plan-start',
    name: 'START',
    priceMonthly: 99,
    description: 'Ideal para agências iniciantes e guias independentes.',
    maxTripsPerMonth: 5,
    maxUsers: 2,
    features: [
      'Até 5 viagens ativas',
      '2 usuários',
      'Gestão de passageiros e reservas',
      'Financeiro básico',
      'Check-in digital',
    ],
  },
  {
    id: 'plan-pro',
    name: 'PRO',
    priceMonthly: 199,
    description: 'Para agências em expansão que precisam de automação completa.',
    maxTripsPerMonth: 25,
    maxUsers: 8,
    features: [
      'Viagens ilimitadas',
      'Até 8 usuários com perfis',
      'CRM de Vendas Kanban',
      'Gestão de assentos & embarque',
      'Portal do Viajante Mobile',
      'Contratos automáticos',
      'RAON IA Integrado',
    ],
    isPopular: true,
  },
  {
    id: 'plan-premium',
    name: 'PREMIUM',
    priceMonthly: 399,
    description: 'Para grandes operadoras de turismo com múltiplos guias e filiais.',
    maxTripsPerMonth: 999,
    maxUsers: 50,
    features: [
      'Tudo do Plano Pro',
      'Usuários ilimitados',
      'Multi-filiais',
      'API WhatsApp dedicada',
      'Relatórios avançados de DRE',
      'Suporte prioritário 24/7',
    ],
  },
];

export const DEMO_TRIPS: Trip[] = [
  {
    id: 'trip-01',
    tenantId: DEMO_TENANT_ID,
    name: 'Porto Seguro & Arraial d’Ajuda 5 Dias',
    destination: 'Porto Seguro, BA',
    category: 'excursão',
    description:
      'Pacote completo incluindo hospedagem pé na areia com café da manhã, passeios pelas praias paradisíacas de Trancoso e Arraial d’Ajuda, city tour histórico e noite na Passarela do Descobrimento.',
    imageUrl:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    departureDate: '2026-11-12',
    returnDate: '2026-11-17',
    departureTime: '20:00',
    returnTime: '06:00',
    departureLocation: 'Metrô Barra Funda - Plataforma 06 (São Paulo/SP)',
    arrivalLocation: 'Hotel Beira Mar Praia - Porto Seguro/BA',
    capacity: 46,
    price: 1890,
    costEstimatePerPerson: 1250,
    responsibleUser: 'Mariana Duarte',
    guideName: 'Lucas Guia',
    status: 'aberta',
    included: [
      'Transporte rodoviário leito turismo com ar e Wi-Fi',
      'Hospedagem 4 noites com café da manhã',
      'Traslado e balsa para Arraial d’Ajuda',
      'Passeio à Praia dos Coqueiros em Trancoso',
      'Seguro viagem GTA Brasil',
      'Guia credenciado MTur acompanhante',
      'Brinde exclusivo da Horizonte Turismo',
    ],
    notIncluded: [
      'Almoços e jantares não descritos',
      'Bebidas e consumo pessoal no hotel',
      'Passeios opcionais de quadriciclo e escuna',
    ],
    observations: 'Ônibus equipado com tomadas USB em todos os assentos e serviço de bordo.',
    waitlistActive: false,
    busLayoutType: 'bus46' as any,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'trip-02',
    tenantId: DEMO_TENANT_ID,
    name: 'Capitólio & Cânions de Furnas Fim de Semana',
    destination: 'Capitólio, MG',
    category: 'aventura',
    description:
      'Fim de semana inesquecível no Mar de Minas. Passeio de lancha exclusivo pelos cânions, cachoeiras cristalinas da Lagoa Azul e Cascatinha, e almoço típico mineiro na fazenda.',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    departureDate: '2026-10-24',
    returnDate: '2026-10-26',
    departureTime: '21:30',
    returnTime: '22:00',
    departureLocation: 'Metrô Tietê - Ponto de Encontro Rua Voluntários da Pátria',
    arrivalLocation: 'Pousada Recanto dos Cânions - Capitólio/MG',
    capacity: 44,
    price: 1250,
    costEstimatePerPerson: 820,
    responsibleUser: 'Patrícia Lima',
    guideName: 'Lucas Guia',
    status: 'lotada',
    included: [
      'Transporte executivo com ar condicionado',
      '2 diárias com café da manhã mineiro',
      'Passeio privativo de lancha de 3 horas pelos Cânions',
      'Entrada para o complexo de cachoeiras',
      'Seguro aventura contra acidentes pessoais',
      'Guia de ecoturismo regional',
    ],
    notIncluded: ['Almoços e bebidas', 'Fotos subaquáticas profissionais'],
    observations: 'Viagem 100% preenchida. 6 clientes na lista de espera aguardando desistências.',
    waitlistActive: true,
    busLayoutType: 'bus44' as any,
    createdAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 'trip-03',
    tenantId: DEMO_TENANT_ID,
    name: 'Serra Gaúcha & Natal Luz de Gramado',
    destination: 'Gramado e Canela, RS',
    category: 'cultural',
    description:
      'O encanto do Natal Luz com espetáculos natalinos mágicos, visita a vinícolas premiadas no Vale dos Vinhedos, Parque Bondinhos Aéreos em Canela e fábrica de chocolate artesanal.',
    imageUrl:
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    departureDate: '2026-12-03',
    returnDate: '2026-12-08',
    departureTime: '06:00',
    returnTime: '20:00',
    departureLocation: 'Aeroporto Internacional de Guarulhos (Voo G3 1480)',
    arrivalLocation: 'Hotel Alpestre - Gramado/RS',
    capacity: 35,
    price: 2490,
    costEstimatePerPerson: 1720,
    responsibleUser: 'Carlos Mendes',
    guideName: 'Rodrigo Santoro',
    status: 'aberta',
    included: [
      'Passagem aérea ida e volta com bagagem de mão 10kg',
      'Hospedagem 5 noites em hotel 4 estrelas com café',
      'Ingresso setor bronze para o espetáculo Natal Luz',
      'Tour Gramado & Canela com almoço incluso',
      'Visita com degustação na Vinícola Miolo',
      'Seguro viagem completo',
    ],
    notIncluded: ['Despesas pessoais', 'Jantares fondues e compras'],
    observations: 'Excelente procura familiar. Ótima margem prevista.',
    waitlistActive: false,
    busLayoutType: 'bus44' as any,
    createdAt: '2026-09-10T11:00:00Z',
  },
];

export const DEMO_ITINERARIES: Record<string, TripDay[]> = {
  'trip-01': [
    {
      id: 'day-01-1',
      dayNumber: 1,
      date: '2026-11-12',
      title: 'Embarque Noturno rumo à Bahia',
      activities: [
        { id: 'act-1-1', time: '19:30', title: 'Concentração dos passageiros', description: 'Conferência de documentos e embarque de bagagens na plataforma 06.', location: 'Metrô Barra Funda' },
        { id: 'act-1-2', time: '20:00', title: 'Partida pontual do ônibus leito', description: 'Início da viagem rodoviária com serviço de bordo e paradas técnicas de alimentação.', location: 'Rodovia Fernão Dias' },
      ],
    },
    {
      id: 'day-01-2',
      dayNumber: 2,
      date: '2026-11-13',
      title: 'Chegada em Porto Seguro e Tarde Livre',
      activities: [
        { id: 'act-2-1', time: '13:00', title: 'Chegada e Check-in no Hotel', description: 'Recepção com água de coco, entrega de chaves dos quartos e almoço.', location: 'Hotel Beira Mar' },
        { id: 'act-2-2', time: '15:30', title: 'Piscina e Praia de Taperapuã', description: 'Tarde relaxante no complexo de praia com música e petiscos.', location: 'Axé Moi' },
        { id: 'act-2-3', time: '20:00', title: 'Passeio na Passarela do Descobrimento', description: 'Artesanato local, gastronomia baiana e famosa capeta de frutas.', location: 'Passarela do Álcool' },
      ],
    },
    {
      id: 'day-01-3',
      dayNumber: 3,
      date: '2026-11-14',
      title: 'Dia em Arraial d’Ajuda e Praia de Pitinga',
      activities: [
        { id: 'act-3-1', time: '08:00', title: 'Café da manhã reforçado', description: 'Buffet completo no hotel com tapiocas feitas na hora.', location: 'Restaurante do Hotel' },
        { id: 'act-3-2', time: '09:00', title: 'Travessia de Balsa para Arraial', description: 'Cruzando o Rio Buranhém em direção ao vilarejo charmoso.', location: 'Balsa Porto Seguro' },
        { id: 'act-3-3', time: '11:00', title: 'Praia do Mucugê e Pitinga', description: 'Piscinas naturais e falésias coloridas deslumbrantes.', location: 'Praia de Pitinga' },
        { id: 'act-3-4', time: '17:30', title: 'Mirante da Igreja Matriz Nossa Sra d’Ajuda', description: 'Pôr do sol panorâmico com fitinhas de promessa.', location: 'Centro Histórico de Arraial' },
      ],
    },
  ],
};

export const DEMO_CUSTOMERS: Customer[] = [
  { id: 'cust-01', tenantId: DEMO_TENANT_ID, name: 'João Carlos Silva', cpf: '123.456.789-00', email: 'joao.silva@gmail.com', phone: '(11) 98711-2233', whatsapp: '11987112233', address: 'Rua das Flores, 120, Apto 42', city: 'São Paulo', state: 'SP', createdAt: '2026-08-01' },
  { id: 'cust-02', tenantId: DEMO_TENANT_ID, name: 'Camila Albuquerque', cpf: '234.567.890-11', email: 'camila.albuquerque@hotmail.com', phone: '(11) 97622-3344', whatsapp: '11976223344', address: 'Av. Ibirapuera, 890', city: 'São Paulo', state: 'SP', createdAt: '2026-08-05' },
  { id: 'cust-03', tenantId: DEMO_TENANT_ID, name: 'Marcos Vinícius Prado', cpf: '345.678.901-22', email: 'marcos.prado@yahoo.com.br', phone: '(19) 98133-4455', whatsapp: '19981334455', address: 'Rua Barão de Jaguara, 550', city: 'Campinas', state: 'SP', createdAt: '2026-08-10' },
  { id: 'cust-04', tenantId: DEMO_TENANT_ID, name: 'Juliana Paes Ferreira', cpf: '456.789.012-33', email: 'juliana.ferreira@gmail.com', phone: '(11) 99244-5566', whatsapp: '11992445566', address: 'Alameda Santos, 1200', city: 'São Paulo', state: 'SP', createdAt: '2026-08-12' },
  { id: 'cust-05', tenantId: DEMO_TENANT_ID, name: 'Renato Guimarães', cpf: '567.890.123-44', email: 'renato.guimaraes@empresa.com.br', phone: '(11) 98355-6677', whatsapp: '11983556677', address: 'Rua Bela Cintra, 412', city: 'São Paulo', state: 'SP', createdAt: '2026-08-15' },
  { id: 'cust-06', tenantId: DEMO_TENANT_ID, name: 'Luciana Rocha', cpf: '678.901.234-55', email: 'luciana.rocha@outlook.com', phone: '(12) 99166-7788', whatsapp: '12991667788', address: 'Av. Nove de Julho, 310', city: 'São José dos Campos', state: 'SP', createdAt: '2026-08-20' },
  { id: 'cust-07', tenantId: DEMO_TENANT_ID, name: 'Felipe Augusto Santos', cpf: '789.012.345-66', email: 'felipe.santos@gmail.com', phone: '(11) 98477-8899', whatsapp: '11984778899', address: 'Rua Vergueiro, 2500', city: 'São Paulo', state: 'SP', createdAt: '2026-08-22' },
  { id: 'cust-08', tenantId: DEMO_TENANT_ID, name: 'Beatriz Vasconcelos', cpf: '890.123.456-77', email: 'beatriz.vasc@gmail.com', phone: '(11) 97588-9900', whatsapp: '11975889900', address: 'Rua Augusta, 1890', city: 'São Paulo', state: 'SP', createdAt: '2026-08-25' },
  { id: 'cust-09', tenantId: DEMO_TENANT_ID, name: 'Marcelo Brandão', cpf: '901.234.567-88', email: 'marcelo.brandao@uol.com.br', phone: '(13) 98299-0011', whatsapp: '13982990011', address: 'Av. Bartolomeu de Gusmão, 45', city: 'Santos', state: 'SP', createdAt: '2026-08-28' },
  { id: 'cust-10', tenantId: DEMO_TENANT_ID, name: 'Patrícia Antunes', cpf: '012.345.678-99', email: 'patricia.antunes@gmail.com', phone: '(11) 99611-1122', whatsapp: '11996111122', address: 'Rua Teodoro Sampaio, 800', city: 'São Paulo', state: 'SP', createdAt: '2026-09-01' },
  { id: 'cust-11', tenantId: DEMO_TENANT_ID, name: 'Thiago Nogueira', cpf: '112.233.445-56', email: 'thiago.nog@gmail.com', phone: '(11) 98122-2233', whatsapp: '11981222233', address: 'Rua Domingos de Morais, 1400', city: 'São Paulo', state: 'SP', createdAt: '2026-09-03' },
  { id: 'cust-12', tenantId: DEMO_TENANT_ID, name: 'Larissa Medeiros', cpf: '223.344.556-67', email: 'larissa.med@hotmail.com', phone: '(11) 97233-3344', whatsapp: '11972333344', address: 'Av. Rebouças, 600', city: 'São Paulo', state: 'SP', createdAt: '2026-09-05' },
  { id: 'cust-13', tenantId: DEMO_TENANT_ID, name: 'Gustavo Henrique Lima', cpf: '334.455.667-78', email: 'gustavo.hl@gmail.com', phone: '(15) 98344-4455', whatsapp: '15983444455', address: 'Rua São Bento, 400', city: 'Sorocaba', state: 'SP', createdAt: '2026-09-08' },
  { id: 'cust-14', tenantId: DEMO_TENANT_ID, name: 'Vanessa Camargo', cpf: '445.566.778-89', email: 'vanessa.camargo@globo.com', phone: '(11) 99455-5566', whatsapp: '11994555566', address: 'Rua Haddock Lobo, 1300', city: 'São Paulo', state: 'SP', createdAt: '2026-09-10' },
  { id: 'cust-15', tenantId: DEMO_TENANT_ID, name: 'Rodrigo Bastos', cpf: '556.677.889-90', email: 'rodrigo.bastos@gmail.com', phone: '(11) 98566-6677', whatsapp: '11985666677', address: 'Rua Fradique Coutinho, 720', city: 'São Paulo', state: 'SP', createdAt: '2026-09-12' },
  { id: 'cust-16', tenantId: DEMO_TENANT_ID, name: 'Daniela Miranda', cpf: '667.788.990-01', email: 'daniela.miranda@terra.com.br', phone: '(11) 97677-7788', whatsapp: '11976777788', address: 'Rua Pamplona, 950', city: 'São Paulo', state: 'SP', createdAt: '2026-09-15' },
  { id: 'cust-17', tenantId: DEMO_TENANT_ID, name: 'Alexandre Pires', cpf: '778.899.001-12', email: 'alexandre.pires@gmail.com', phone: '(19) 98788-8899', whatsapp: '19987888899', address: 'Av. Francisco Glicério, 1020', city: 'Campinas', state: 'SP', createdAt: '2026-09-18' },
  { id: 'cust-18', tenantId: DEMO_TENANT_ID, name: 'Simone Toledo', cpf: '889.900.112-23', email: 'simone.toledo@gmail.com', phone: '(11) 99899-9900', whatsapp: '11998999900', address: 'Rua Oscar Freire, 350', city: 'São Paulo', state: 'SP', createdAt: '2026-09-20' },
  { id: 'cust-19', tenantId: DEMO_TENANT_ID, name: 'André Farias', cpf: '990.011.223-34', email: 'andre.farias@gmail.com', phone: '(11) 98911-0022', whatsapp: '11989110022', address: 'Av. Brigadeiro Luis Antonio, 2100', city: 'São Paulo', state: 'SP', createdAt: '2026-09-22' },
  { id: 'cust-20', tenantId: DEMO_TENANT_ID, name: 'Helena Carvalho', cpf: '001.122.334-45', email: 'helena.carvalho@gmail.com', phone: '(11) 97122-1133', whatsapp: '11971221133', address: 'Rua Itapeva, 500', city: 'São Paulo', state: 'SP', createdAt: '2026-09-25' },
];

export const DEMO_TRAVELERS: Traveler[] = [
  // Família Silva (Comprador: cust-01)
  { id: 'trav-01', tenantId: DEMO_TENANT_ID, customerId: 'cust-01', name: 'João Carlos Silva', cpf: '123.456.789-00', rg: '34.567.890-1', birthDate: '1984-05-14', phone: '(11) 98711-2233', whatsapp: '11987112233', email: 'joao.silva@gmail.com', documentType: 'RG', documentNumber: '34.567.890-1', emergencyContact: 'Teresa Silva (Mãe)', emergencyPhone: '(11) 97111-0000', createdAt: '2026-08-01' },
  { id: 'trav-02', tenantId: DEMO_TENANT_ID, customerId: 'cust-01', name: 'Maria Eduarda Silva', cpf: '234.567.890-99', rg: '45.678.901-2', birthDate: '1987-09-22', phone: '(11) 98711-4455', whatsapp: '11987114455', email: 'maria.eduarda@gmail.com', documentType: 'RG', documentNumber: '45.678.901-2', emergencyContact: 'João Carlos Silva', emergencyPhone: '(11) 98711-2233', createdAt: '2026-08-01' },
  { id: 'trav-03', tenantId: DEMO_TENANT_ID, customerId: 'cust-01', name: 'Pedro Henrique Silva', cpf: '345.678.901-88', rg: '56.789.012-3', birthDate: '2014-03-10', phone: '(11) 98711-2233', whatsapp: '11987112233', email: 'joao.silva@gmail.com', documentType: 'RG', documentNumber: '56.789.012-3', emergencyContact: 'João Carlos Silva', emergencyPhone: '(11) 98711-2233', healthObservations: 'Alérgico a frutos do mar', createdAt: '2026-08-01' },

  // Camila & Amiga (Comprador: cust-02)
  { id: 'trav-04', tenantId: DEMO_TENANT_ID, customerId: 'cust-02', name: 'Camila Albuquerque', cpf: '234.567.890-11', rg: '29.876.543-0', birthDate: '1992-11-08', phone: '(11) 97622-3344', whatsapp: '11976223344', email: 'camila.albuquerque@hotmail.com', documentType: 'RG', documentNumber: '29.876.543-0', emergencyContact: 'Roberto Albuquerque (Pai)', emergencyPhone: '(11) 99888-7766', createdAt: '2026-08-05' },
  { id: 'trav-05', tenantId: DEMO_TENANT_ID, customerId: 'cust-02', name: 'Juliana Costa', cpf: '321.654.987-12', rg: '31.234.567-8', birthDate: '1993-02-17', phone: '(11) 98123-9988', whatsapp: '11981239988', email: 'ju.costa@gmail.com', documentType: 'RG', documentNumber: '31.234.567-8', emergencyContact: 'Camila Albuquerque', emergencyPhone: '(11) 97622-3344', createdAt: '2026-08-05' },

  // Marcos Vinícius (Comprador: cust-03)
  { id: 'trav-06', tenantId: DEMO_TENANT_ID, customerId: 'cust-03', name: 'Marcos Vinícius Prado', cpf: '345.678.901-22', rg: '42.111.222-3', birthDate: '1989-07-30', phone: '(19) 98133-4455', whatsapp: '19981334455', email: 'marcos.prado@yahoo.com.br', documentType: 'CNH', documentNumber: '05432198765', emergencyContact: 'Ana Prado (Irmã)', emergencyPhone: '(19) 98199-8877', createdAt: '2026-08-10' },
  { id: 'trav-07', tenantId: DEMO_TENANT_ID, customerId: 'cust-03', name: 'Letícia Prado', cpf: '432.109.876-54', rg: '43.222.333-4', birthDate: '1991-12-14', phone: '(19) 98133-7766', whatsapp: '19981337766', email: 'leticia.prado@gmail.com', documentType: 'RG', documentNumber: '43.222.333-4', emergencyContact: 'Marcos Prado', emergencyPhone: '(19) 98133-4455', createdAt: '2026-08-10' },

  // Juliana Paes Ferreira & Família (cust-04)
  { id: 'trav-08', tenantId: DEMO_TENANT_ID, customerId: 'cust-04', name: 'Juliana Paes Ferreira', cpf: '456.789.012-33', rg: '38.999.000-1', birthDate: '1986-04-19', phone: '(11) 99244-5566', whatsapp: '11992445566', email: 'juliana.ferreira@gmail.com', documentType: 'RG', documentNumber: '38.999.000-1', emergencyContact: 'Paulo Ferreira', emergencyPhone: '(11) 99111-2233', createdAt: '2026-08-12' },
  { id: 'trav-09', tenantId: DEMO_TENANT_ID, customerId: 'cust-04', name: 'Paulo Ferreira', cpf: '543.210.987-65', rg: '39.000.111-2', birthDate: '1985-08-05', phone: '(11) 99111-2233', whatsapp: '11991112233', email: 'paulo.ferreira@gmail.com', documentType: 'RG', documentNumber: '39.000.111-2', emergencyContact: 'Juliana Ferreira', emergencyPhone: '(11) 99244-5566', createdAt: '2026-08-12' },

  // Renato Guimarães (cust-05)
  { id: 'trav-10', tenantId: DEMO_TENANT_ID, customerId: 'cust-05', name: 'Renato Guimarães', cpf: '567.890.123-44', rg: '25.678.123-9', birthDate: '1979-01-25', phone: '(11) 98355-6677', whatsapp: '11983556677', email: 'renato.guimaraes@empresa.com.br', documentType: 'Passaporte', documentNumber: 'FJ891234', emergencyContact: 'Sandra Guimarães (Esposa)', emergencyPhone: '(11) 98111-3322', createdAt: '2026-08-15' },
  { id: 'trav-11', tenantId: DEMO_TENANT_ID, customerId: 'cust-05', name: 'Sandra Guimarães', cpf: '654.321.098-76', rg: '26.789.234-0', birthDate: '1981-10-18', phone: '(11) 98111-3322', whatsapp: '11981113322', email: 'sandra.gui@gmail.com', documentType: 'Passaporte', documentNumber: 'FJ891235', emergencyContact: 'Renato Guimarães', emergencyPhone: '(11) 98355-6677', createdAt: '2026-08-15' },

  // Luciana Rocha (cust-06)
  { id: 'trav-12', tenantId: DEMO_TENANT_ID, customerId: 'cust-06', name: 'Luciana Rocha', cpf: '678.901.234-55', rg: '35.456.789-2', birthDate: '1995-06-12', phone: '(12) 99166-7788', whatsapp: '12991667788', email: 'luciana.rocha@outlook.com', documentType: 'RG', documentNumber: '35.456.789-2', emergencyContact: 'Marina Rocha (Mãe)', emergencyPhone: '(12) 99777-6655', createdAt: '2026-08-20' },

  // Felipe Santos & Amigos (cust-07)
  { id: 'trav-13', tenantId: DEMO_TENANT_ID, customerId: 'cust-07', name: 'Felipe Augusto Santos', cpf: '789.012.345-66', rg: '44.333.222-1', birthDate: '1996-03-31', phone: '(11) 98477-8899', whatsapp: '11984778899', email: 'felipe.santos@gmail.com', documentType: 'CNH', documentNumber: '08765432100', emergencyContact: 'Claudio Santos (Pai)', emergencyPhone: '(11) 98222-1100', createdAt: '2026-08-22' },
  { id: 'trav-14', tenantId: DEMO_TENANT_ID, customerId: 'cust-07', name: 'Gabriel Alencar', cpf: '765.432.109-87', rg: '45.444.333-2', birthDate: '1997-09-09', phone: '(11) 98765-1122', whatsapp: '11987651122', email: 'gabriel.alencar@gmail.com', documentType: 'RG', documentNumber: '45.444.333-2', emergencyContact: 'Felipe Santos', emergencyPhone: '(11) 98477-8899', createdAt: '2026-08-22' },

  // Beatriz Vasconcelos (cust-08)
  { id: 'trav-15', tenantId: DEMO_TENANT_ID, customerId: 'cust-08', name: 'Beatriz Vasconcelos', cpf: '890.123.456-77', rg: '37.890.123-4', birthDate: '1990-12-05', phone: '(11) 97588-9900', whatsapp: '11975889900', email: 'beatriz.vasc@gmail.com', documentType: 'RG', documentNumber: '37.890.123-4', emergencyContact: 'Lucas Vasconcelos', emergencyPhone: '(11) 97666-5544', createdAt: '2026-08-25' },

  // Marcelo Brandão (cust-09)
  { id: 'trav-16', tenantId: DEMO_TENANT_ID, customerId: 'cust-09', name: 'Marcelo Brandão', cpf: '901.234.567-88', rg: '30.123.456-7', birthDate: '1982-08-20', phone: '(13) 98299-0011', whatsapp: '13982990011', email: 'marcelo.brandao@uol.com.br', documentType: 'RG', documentNumber: '30.123.456-7', emergencyContact: 'Carla Brandão', emergencyPhone: '(13) 98111-2200', createdAt: '2026-08-28' },
  { id: 'trav-17', tenantId: DEMO_TENANT_ID, customerId: 'cust-09', name: 'Carla Brandão', cpf: '876.543.210-98', rg: '31.234.567-0', birthDate: '1984-04-15', phone: '(13) 98111-2200', whatsapp: '13981112200', email: 'carla.brandao@gmail.com', documentType: 'RG', documentNumber: '31.234.567-0', emergencyContact: 'Marcelo Brandão', emergencyPhone: '(13) 98299-0011', createdAt: '2026-08-28' },

  // Patrícia Antunes (cust-10)
  { id: 'trav-18', tenantId: DEMO_TENANT_ID, customerId: 'cust-10', name: 'Patrícia Antunes', cpf: '012.345.678-99', rg: '41.567.890-5', birthDate: '1988-02-28', phone: '(11) 99611-1122', whatsapp: '11996111122', email: 'patricia.antunes@gmail.com', documentType: 'RG', documentNumber: '41.567.890-5', emergencyContact: 'Helena Antunes', emergencyPhone: '(11) 99555-4433', createdAt: '2026-09-01' },

  // Thiago Nogueira (cust-11)
  { id: 'trav-19', tenantId: DEMO_TENANT_ID, customerId: 'cust-11', name: 'Thiago Nogueira', cpf: '112.233.445-56', rg: '36.789.012-8', birthDate: '1993-10-10', phone: '(11) 98122-2233', whatsapp: '11981222233', email: 'thiago.nog@gmail.com', documentType: 'CNH', documentNumber: '09876543211', emergencyContact: 'Claudia Nogueira', emergencyPhone: '(11) 98222-3344', createdAt: '2026-09-03' },

  // Larissa Medeiros (cust-12)
  { id: 'trav-20', tenantId: DEMO_TENANT_ID, customerId: 'cust-12', name: 'Larissa Medeiros', cpf: '223.344.556-67', rg: '46.890.123-9', birthDate: '1994-07-07', phone: '(11) 97233-3344', whatsapp: '11972333344', email: 'larissa.med@hotmail.com', documentType: 'RG', documentNumber: '46.890.123-9', emergencyContact: 'Jorge Medeiros', emergencyPhone: '(11) 97111-4455', createdAt: '2026-09-05' },

  // Gustavo Lima & Namorada (cust-13)
  { id: 'trav-21', tenantId: DEMO_TENANT_ID, customerId: 'cust-13', name: 'Gustavo Henrique Lima', cpf: '334.455.667-78', rg: '48.901.234-0', birthDate: '1995-11-20', phone: '(15) 98344-4455', whatsapp: '15983444455', email: 'gustavo.hl@gmail.com', documentType: 'RG', documentNumber: '48.901.234-0', emergencyContact: 'Marcos Lima', emergencyPhone: '(15) 98111-0099', createdAt: '2026-09-08' },
  { id: 'trav-22', tenantId: DEMO_TENANT_ID, customerId: 'cust-13', name: 'Bruna Marquez', cpf: '987.654.321-09', rg: '49.012.345-1', birthDate: '1997-05-18', phone: '(15) 98222-3311', whatsapp: '15982223311', email: 'bruna.marquez@gmail.com', documentType: 'RG', documentNumber: '49.012.345-1', emergencyContact: 'Gustavo Lima', emergencyPhone: '(15) 98344-4455', createdAt: '2026-09-08' },

  // Vanessa Camargo (cust-14)
  { id: 'trav-23', tenantId: DEMO_TENANT_ID, customerId: 'cust-14', name: 'Vanessa Camargo', cpf: '445.566.778-89', rg: '32.123.987-6', birthDate: '1987-03-03', phone: '(11) 99455-5566', whatsapp: '11994555566', email: 'vanessa.camargo@globo.com', documentType: 'RG', documentNumber: '32.123.987-6', emergencyContact: 'Eduardo Camargo', emergencyPhone: '(11) 99333-2211', createdAt: '2026-09-10' },

  // Rodrigo Bastos (cust-15)
  { id: 'trav-24', tenantId: DEMO_TENANT_ID, customerId: 'cust-15', name: 'Rodrigo Bastos', cpf: '556.677.889-90', rg: '27.456.789-1', birthDate: '1983-09-15', phone: '(11) 98566-6677', whatsapp: '11985666677', email: 'rodrigo.bastos@gmail.com', documentType: 'RG', documentNumber: '27.456.789-1', emergencyContact: 'Lucia Bastos', emergencyPhone: '(11) 98111-5544', createdAt: '2026-09-12' },

  // Daniela Miranda (cust-16)
  { id: 'trav-25', tenantId: DEMO_TENANT_ID, customerId: 'cust-16', name: 'Daniela Miranda', cpf: '667.788.990-01', rg: '39.876.543-8', birthDate: '1991-08-08', phone: '(11) 97677-7788', whatsapp: '11976777788', email: 'daniela.miranda@terra.com.br', documentType: 'RG', documentNumber: '39.876.543-8', emergencyContact: 'Sergio Miranda', emergencyPhone: '(11) 97555-6677', createdAt: '2026-09-15' },

  // Alexandre Pires (cust-17)
  { id: 'trav-26', tenantId: DEMO_TENANT_ID, customerId: 'cust-17', name: 'Alexandre Pires', cpf: '778.899.001-12', rg: '40.987.654-9', birthDate: '1980-12-12', phone: '(19) 98788-8899', whatsapp: '19987888899', email: 'alexandre.pires@gmail.com', documentType: 'RG', documentNumber: '40.987.654-9', emergencyContact: 'Flavia Pires', emergencyPhone: '(19) 98666-5544', createdAt: '2026-09-18' },

  // Simone Toledo (cust-18)
  { id: 'trav-27', tenantId: DEMO_TENANT_ID, customerId: 'cust-18', name: 'Simone Toledo', cpf: '889.900.112-23', rg: '28.765.432-1', birthDate: '1976-06-24', phone: '(11) 99899-9900', whatsapp: '11998999900', email: 'simone.toledo@gmail.com', documentType: 'RG', documentNumber: '28.765.432-1', emergencyContact: 'Carlos Toledo', emergencyPhone: '(11) 99777-8899', createdAt: '2026-09-20' },

  // André Farias (cust-19)
  { id: 'trav-28', tenantId: DEMO_TENANT_ID, customerId: 'cust-19', name: 'André Farias', cpf: '990.011.223-34', rg: '33.876.543-2', birthDate: '1992-04-04', phone: '(11) 98911-0022', whatsapp: '11989110022', email: 'andre.farias@gmail.com', documentType: 'RG', documentNumber: '33.876.543-2', emergencyContact: 'Mariana Farias', emergencyPhone: '(11) 98888-9900', createdAt: '2026-09-22' },

  // Helena Carvalho (cust-20)
  { id: 'trav-29', tenantId: DEMO_TENANT_ID, customerId: 'cust-20', name: 'Helena Carvalho', cpf: '001.122.334-45', rg: '47.654.321-0', birthDate: '1998-10-30', phone: '(11) 97122-1133', whatsapp: '11971221133', email: 'helena.carvalho@gmail.com', documentType: 'RG', documentNumber: '47.654.321-0', emergencyContact: 'Ricardo Carvalho', emergencyPhone: '(11) 97000-1122', createdAt: '2026-09-25' },

  // Viajante 30: Acompanhante da Helena
  { id: 'trav-30', tenantId: DEMO_TENANT_ID, customerId: 'cust-20', name: 'Vitor Siqueira', cpf: '109.876.543-21', rg: '48.765.432-1', birthDate: '1996-01-14', phone: '(11) 97122-8899', whatsapp: '11971228899', email: 'vitor.siq@gmail.com', documentType: 'RG', documentNumber: '48.765.432-1', emergencyContact: 'Helena Carvalho', emergencyPhone: '(11) 97122-1133', createdAt: '2026-09-25' },
];

export const DEMO_RESERVATIONS: Reservation[] = [
  // Reserva 01: João Silva (3 passageiros para Porto Seguro)
  {
    id: 'res-01',
    code: 'RES-1001',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-01',
    tripId: 'trip-01',
    travelerDetails: [
      { travelerId: 'trav-01', seatNumber: '01A', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'embarcou', digitalCheckInDone: true, checkInCompletedAt: '2026-10-06T14:20:00Z' },
      { travelerId: 'trav-02', seatNumber: '01B', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'embarcou', digitalCheckInDone: true, checkInCompletedAt: '2026-10-06T14:22:00Z' },
      { travelerId: 'trav-03', seatNumber: '02A', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'embarcou', digitalCheckInDone: true, checkInCompletedAt: '2026-10-06T14:25:00Z' },
    ],
    totalValue: 5670,
    discount: 170,
    finalValue: 5500,
    paymentMethod: 'pix',
    status: 'paga',
    notes: 'Família viaja junta nos assentos da frente.',
    createdAt: '2026-09-02T11:00:00Z',
  },
  // Reserva 02: Camila Albuquerque (2 passageiros para Porto Seguro)
  {
    id: 'res-02',
    code: 'RES-1002',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-02',
    tripId: 'trip-01',
    travelerDetails: [
      { travelerId: 'trav-04', seatNumber: '03A', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'pendente', digitalCheckInDone: true, checkInCompletedAt: '2026-10-05T09:15:00Z' },
      { travelerId: 'trav-05', seatNumber: '03B', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'pendente', digitalCheckInDone: false },
    ],
    totalValue: 3780,
    discount: 80,
    finalValue: 3700,
    paymentMethod: 'cartao_credito',
    status: 'confirmada',
    createdAt: '2026-09-05T14:30:00Z',
  },
  // Reserva 03: Marcos Vinícius (2 passageiros para Capitólio - 100% Paga)
  {
    id: 'res-03',
    code: 'RES-1003',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-03',
    tripId: 'trip-02',
    travelerDetails: [
      { travelerId: 'trav-06', seatNumber: '05A', boardingLocation: 'Metrô Tietê', boardingStatus: 'embarcou', digitalCheckInDone: true, checkInCompletedAt: '2026-10-04T18:00:00Z' },
      { travelerId: 'trav-07', seatNumber: '05B', boardingLocation: 'Metrô Tietê', boardingStatus: 'embarcou', digitalCheckInDone: true, checkInCompletedAt: '2026-10-04T18:05:00Z' },
    ],
    totalValue: 2500,
    discount: 0,
    finalValue: 2500,
    paymentMethod: 'pix',
    status: 'paga',
    createdAt: '2026-08-20T16:00:00Z',
  },
  // Reserva 04: Juliana Ferreira (2 passageiros para Gramado)
  {
    id: 'res-04',
    code: 'RES-1004',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-04',
    tripId: 'trip-03',
    travelerDetails: [
      { travelerId: 'trav-08', seatNumber: '02A', boardingLocation: 'Aeroporto GRU', boardingStatus: 'pendente', digitalCheckInDone: true },
      { travelerId: 'trav-09', seatNumber: '02B', boardingLocation: 'Aeroporto GRU', boardingStatus: 'pendente', digitalCheckInDone: true },
    ],
    totalValue: 4980,
    discount: 180,
    finalValue: 4800,
    paymentMethod: 'cartao_credito',
    status: 'parcialmente_paga',
    createdAt: '2026-09-12T10:30:00Z',
  },
  // Reserva 05: Renato Guimarães (2 passageiros para Gramado)
  {
    id: 'res-05',
    code: 'RES-1005',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-05',
    tripId: 'trip-03',
    travelerDetails: [
      { travelerId: 'trav-10', seatNumber: '03A', boardingLocation: 'Aeroporto GRU', boardingStatus: 'pendente', digitalCheckInDone: false },
      { travelerId: 'trav-11', seatNumber: '03B', boardingLocation: 'Aeroporto GRU', boardingStatus: 'pendente', digitalCheckInDone: false },
    ],
    totalValue: 4980,
    discount: 0,
    finalValue: 4980,
    paymentMethod: 'boleto',
    status: 'aguardando_pagamento',
    notes: 'Aguardando compensação da primeira parcela.',
    createdAt: '2026-09-15T09:00:00Z',
  },
  // Reserva 06: Luciana Rocha (1 passageiro para Capitólio)
  {
    id: 'res-06',
    code: 'RES-1006',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-06',
    tripId: 'trip-02',
    travelerDetails: [
      { travelerId: 'trav-12', seatNumber: '07A', boardingLocation: 'Metrô Tietê', boardingStatus: 'pendente', digitalCheckInDone: true },
    ],
    totalValue: 1250,
    discount: 50,
    finalValue: 1200,
    paymentMethod: 'pix',
    status: 'paga',
    createdAt: '2026-08-25T11:15:00Z',
  },
  // Reserva 07: Felipe Santos (2 passageiros para Porto Seguro)
  {
    id: 'res-07',
    code: 'RES-1007',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-07',
    tripId: 'trip-01',
    travelerDetails: [
      { travelerId: 'trav-13', seatNumber: '08A', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'pendente', digitalCheckInDone: false },
      { travelerId: 'trav-14', seatNumber: '08B', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'pendente', digitalCheckInDone: false },
    ],
    totalValue: 3780,
    discount: 0,
    finalValue: 3780,
    paymentMethod: 'boleto',
    status: 'parcialmente_paga',
    createdAt: '2026-09-08T15:20:00Z',
  },
  // Reserva 08: Beatriz Vasconcelos (1 passageiro para Capitólio)
  {
    id: 'res-08',
    code: 'RES-1008',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-08',
    tripId: 'trip-02',
    travelerDetails: [
      { travelerId: 'trav-15', seatNumber: '09A', boardingLocation: 'Metrô Tietê', boardingStatus: 'pendente', digitalCheckInDone: true },
    ],
    totalValue: 1250,
    discount: 0,
    finalValue: 1250,
    paymentMethod: 'cartao_credito',
    status: 'paga',
    createdAt: '2026-08-30T17:40:00Z',
  },
  // Reserva 09: Marcelo Brandão (2 passageiros para Porto Seguro)
  {
    id: 'res-09',
    code: 'RES-1009',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-09',
    tripId: 'trip-01',
    travelerDetails: [
      { travelerId: 'trav-16', seatNumber: '10A', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'pendente', digitalCheckInDone: true },
      { travelerId: 'trav-17', seatNumber: '10B', boardingLocation: 'Metrô Barra Funda', boardingStatus: 'pendente', digitalCheckInDone: true },
    ],
    totalValue: 3780,
    discount: 80,
    finalValue: 3700,
    paymentMethod: 'pix',
    status: 'confirmada',
    createdAt: '2026-09-18T14:10:00Z',
  },
  // Reserva 10: Helena Carvalho (2 passageiros na Lista de Espera de Capitólio)
  {
    id: 'res-10',
    code: 'RES-1010',
    tenantId: DEMO_TENANT_ID,
    customerId: 'cust-20',
    tripId: 'trip-02',
    travelerDetails: [
      { travelerId: 'trav-29', boardingLocation: 'Metrô Tietê', boardingStatus: 'pendente', digitalCheckInDone: false },
      { travelerId: 'trav-30', boardingLocation: 'Metrô Tietê', boardingStatus: 'pendente', digitalCheckInDone: false },
    ],
    totalValue: 2500,
    discount: 0,
    finalValue: 2500,
    paymentMethod: 'pix',
    status: 'lista_espera',
    notes: 'Posição 1 e 2 na fila de espera caso haja desistência.',
    createdAt: '2026-09-28T10:00:00Z',
  },
];

export const DEMO_INSTALLMENTS: PaymentInstallment[] = [
  // Parcela Reserva 01 (João Silva - R$ 5.500 à vista Pix)
  { id: 'inst-01', tenantId: DEMO_TENANT_ID, reservationId: 'res-01', customerId: 'cust-01', tripId: 'trip-01', installmentNumber: 1, totalInstallments: 1, dueDate: '2026-09-02', amount: 5500, status: 'pago', paidAt: '2026-09-02T11:05:00Z', paidAmount: 5500, paymentMethod: 'PIX' },

  // Parcelas Reserva 02 (Camila - R$ 3.700 em 2x)
  { id: 'inst-02-1', tenantId: DEMO_TENANT_ID, reservationId: 'res-02', customerId: 'cust-02', tripId: 'trip-01', installmentNumber: 1, totalInstallments: 2, dueDate: '2026-09-05', amount: 1850, status: 'pago', paidAt: '2026-09-05T14:35:00Z', paidAmount: 1850, paymentMethod: 'Cartão de Crédito' },
  { id: 'inst-02-2', tenantId: DEMO_TENANT_ID, reservationId: 'res-02', customerId: 'cust-02', tripId: 'trip-01', installmentNumber: 2, totalInstallments: 2, dueDate: '2026-10-15', amount: 1850, status: 'pendente' },

  // Parcela Reserva 03 (Marcos - R$ 2.500 à vista)
  { id: 'inst-03', tenantId: DEMO_TENANT_ID, reservationId: 'res-03', customerId: 'cust-03', tripId: 'trip-02', installmentNumber: 1, totalInstallments: 1, dueDate: '2026-08-20', amount: 2500, status: 'pago', paidAt: '2026-08-20T16:10:00Z', paidAmount: 2500, paymentMethod: 'PIX' },

  // Parcelas Reserva 04 (Juliana - R$ 4.800 em 3x de R$ 1.600)
  { id: 'inst-04-1', tenantId: DEMO_TENANT_ID, reservationId: 'res-04', customerId: 'cust-04', tripId: 'trip-03', installmentNumber: 1, totalInstallments: 3, dueDate: '2026-09-12', amount: 1600, status: 'pago', paidAt: '2026-09-12T10:35:00Z', paidAmount: 1600, paymentMethod: 'Cartão de Crédito' },
  { id: 'inst-04-2', tenantId: DEMO_TENANT_ID, reservationId: 'res-04', customerId: 'cust-04', tripId: 'trip-03', installmentNumber: 2, totalInstallments: 3, dueDate: '2026-10-12', amount: 1600, status: 'pendente' },
  { id: 'inst-04-3', tenantId: DEMO_TENANT_ID, reservationId: 'res-04', customerId: 'cust-04', tripId: 'trip-03', installmentNumber: 3, totalInstallments: 3, dueDate: '2026-11-12', amount: 1600, status: 'pendente' },

  // Parcelas Reserva 05 (Renato - R$ 4.980 - Parcela 1 em ATRASO - Urgente!)
  { id: 'inst-05-1', tenantId: DEMO_TENANT_ID, reservationId: 'res-05', customerId: 'cust-05', tripId: 'trip-03', installmentNumber: 1, totalInstallments: 2, dueDate: '2026-09-25', amount: 2490, status: 'atrasado' },
  { id: 'inst-05-2', tenantId: DEMO_TENANT_ID, reservationId: 'res-05', customerId: 'cust-05', tripId: 'trip-03', installmentNumber: 2, totalInstallments: 2, dueDate: '2026-10-25', amount: 2490, status: 'pendente' },

  // Parcela Reserva 06 (Luciana - R$ 1.200 pago)
  { id: 'inst-06', tenantId: DEMO_TENANT_ID, reservationId: 'res-06', customerId: 'cust-06', tripId: 'trip-02', installmentNumber: 1, totalInstallments: 1, dueDate: '2026-08-25', amount: 1200, status: 'pago', paidAt: '2026-08-25T11:20:00Z', paidAmount: 1200, paymentMethod: 'PIX' },

  // Parcelas Reserva 07 (Felipe Santos - R$ 3.780 em 2x - Parcela 1 paga, Parcela 2 em ATRASO)
  { id: 'inst-07-1', tenantId: DEMO_TENANT_ID, reservationId: 'res-07', customerId: 'cust-07', tripId: 'trip-01', installmentNumber: 1, totalInstallments: 2, dueDate: '2026-09-08', amount: 1890, status: 'pago', paidAt: '2026-09-08T15:30:00Z', paidAmount: 1890, paymentMethod: 'Boleto' },
  { id: 'inst-07-2', tenantId: DEMO_TENANT_ID, reservationId: 'res-07', customerId: 'cust-07', tripId: 'trip-01', installmentNumber: 2, totalInstallments: 2, dueDate: '2026-10-02', amount: 1890, status: 'atrasado' },

  // Parcela Reserva 08 (Beatriz - R$ 1.250 pago)
  { id: 'inst-08', tenantId: DEMO_TENANT_ID, reservationId: 'res-08', customerId: 'cust-08', tripId: 'trip-02', installmentNumber: 1, totalInstallments: 1, dueDate: '2026-08-30', amount: 1250, status: 'pago', paidAt: '2026-08-30T17:45:00Z', paidAmount: 1250, paymentMethod: 'Cartão de Crédito' },

  // Parcelas Reserva 09 (Marcelo Brandão - R$ 3.700 em 2x)
  { id: 'inst-09-1', tenantId: DEMO_TENANT_ID, reservationId: 'res-09', customerId: 'cust-09', tripId: 'trip-01', installmentNumber: 1, totalInstallments: 2, dueDate: '2026-09-18', amount: 1850, status: 'pago', paidAt: '2026-09-18T14:15:00Z', paidAmount: 1850, paymentMethod: 'PIX' },
  { id: 'inst-09-2', tenantId: DEMO_TENANT_ID, reservationId: 'res-09', customerId: 'cust-09', tripId: 'trip-01', installmentNumber: 2, totalInstallments: 2, dueDate: '2026-10-18', amount: 1850, status: 'pendente' },
];

export const DEMO_EXPENSES: Expense[] = [
  { id: 'exp-01', tenantId: DEMO_TENANT_ID, tripId: 'trip-01', category: 'transporte', description: 'Locação Ônibus Leito Turismo 46 Lugares - Translider', supplierId: 'sup-01', amount: 16500, dueDate: '2026-11-01', status: 'pago', paidAt: '2026-10-01' },
  { id: 'exp-02', tenantId: DEMO_TENANT_ID, tripId: 'trip-01', category: 'hotel', description: 'Bloqueio de 18 apartamentos duplos/triplos Hotel Beira Mar', supplierId: 'sup-02', amount: 24800, dueDate: '2026-11-05', status: 'pendente' },
  { id: 'exp-03', tenantId: DEMO_TENANT_ID, tripId: 'trip-01', category: 'guias', description: 'Diárias Guia Credenciado e Coordenador de Viagem', supplierId: 'sup-03', amount: 3200, dueDate: '2026-11-17', status: 'pendente' },
  { id: 'exp-04', tenantId: DEMO_TENANT_ID, tripId: 'trip-02', category: 'transporte', description: 'Ônibus Executivo São Paulo x Capitólio', supplierId: 'sup-01', amount: 11200, dueDate: '2026-10-20', status: 'pago', paidAt: '2026-10-02' },
  { id: 'exp-05', tenantId: DEMO_TENANT_ID, tripId: 'trip-02', category: 'passeios', description: 'Fretamento de 3 lanchas de 15 lugares para os Cânions', supplierId: 'sup-04', amount: 7500, dueDate: '2026-10-24', status: 'pendente' },
  { id: 'exp-06', tenantId: DEMO_TENANT_ID, tripId: 'trip-02', category: 'hotel', description: 'Pousada Recanto dos Cânions (Hospedagem 44 pax)', supplierId: 'sup-05', amount: 14000, dueDate: '2026-10-23', status: 'pago', paidAt: '2026-09-30' },
  { id: 'exp-07', tenantId: DEMO_TENANT_ID, tripId: 'trip-03', category: 'transporte', description: 'Bloqueio de passagens aéreas e transfer Gramado', supplierId: 'sup-06', amount: 31500, dueDate: '2026-11-15', status: 'pendente' },
  { id: 'exp-08', tenantId: DEMO_TENANT_ID, category: 'marketing', description: 'Campanha Meta Ads Natal Luz & Verão Bahia', amount: 2800, dueDate: '2026-10-10', status: 'pago', paidAt: '2026-10-01' },
];

export const DEMO_SUPPLIERS: Supplier[] = [
  { id: 'sup-01', tenantId: DEMO_TENANT_ID, name: 'Translider Fretamento & Turismo', company: 'Translider Transportes Ltda', category: 'transportadora', phone: '(11) 3999-1200', whatsapp: '11989991200', email: 'comercial@translider.com.br', serviceDescription: 'Frota moderna de ônibus leito e semi-leito com ar, Wi-Fi e tomadas USB.', standardPrice: 16500 },
  { id: 'sup-02', tenantId: DEMO_TENANT_ID, name: 'Hotel Beira Mar Praia', company: 'Beira Mar Hotéis & Resort', category: 'hotel', phone: '(73) 3288-4400', whatsapp: '73999884400', email: 'reservas@beiramarporto.com.br', serviceDescription: 'Hotel 4 estrelas na orla de Taperapuã com piscina e restaurante próprio.', standardPrice: 380 },
  { id: 'sup-03', tenantId: DEMO_TENANT_ID, name: 'Lucas Guia de Turismo MTur', company: 'Lucas Santos Serviços Turísticos', category: 'guia', phone: '(11) 93210-9876', whatsapp: '11932109876', email: 'lucas.guia@turismo.com', serviceDescription: 'Guia regional e nacional especializado em grupos e excursões rodoviárias.', standardPrice: 400 },
  { id: 'sup-04', tenantId: DEMO_TENANT_ID, name: 'Capitólio Náutica & Lanchas', company: 'Náutica Furnas Eireli', category: 'passeios', phone: '(35) 3527-1800', whatsapp: '35998111800', email: 'contato@capitolionautica.com.br', serviceDescription: 'Passeios de lancha privativos nos cânions com marinheiros experientes e seguro náutico.' },
  { id: 'sup-05', tenantId: DEMO_TENANT_ID, name: 'Pousada Recanto dos Cânions', company: 'Pousada Recanto Ltda', category: 'pousada', phone: '(35) 3527-2200', whatsapp: '35999222200', email: 'pousadarecanto@capitolio.com', serviceDescription: 'Pousada aconchegante com piscina, café da manhã mineiro e vista panorâmica.' },
  { id: 'sup-06', tenantId: DEMO_TENANT_ID, name: 'Bancorbrás Receptivo Sul', company: 'Bancor Operações Turísticas', category: 'receptivo', phone: '(54) 3286-9000', whatsapp: '54991229000', email: 'receptivo@bancor.com.br', serviceDescription: 'Transfers in/out POA-Gramado e guias locais para os espetáculos do Natal Luz.' },
  { id: 'sup-07', tenantId: DEMO_TENANT_ID, name: 'GTA Seguro Viagem Brasil', company: 'Global Travel Assistance', category: 'seguradora', phone: '(11) 3150-4500', whatsapp: '11981504500', email: 'emissao@gta.com.br', serviceDescription: 'Apólices completas de seguro médico, extravio de bagagem e despesas farmacêuticas.' },
];

export const DEMO_DOCUMENTS: DocumentItem[] = [
  { id: 'doc-01', tenantId: DEMO_TENANT_ID, travelerId: 'trav-01', customerId: 'cust-01', tripId: 'trip-01', reservationId: 'res-01', title: 'RG - João Carlos Silva (Frente e Verso)', type: 'rg', status: 'recebido', fileName: 'rg_joao_silva.pdf', uploadedAt: '2026-09-03' },
  { id: 'doc-02', tenantId: DEMO_TENANT_ID, travelerId: 'trav-03', customerId: 'cust-01', tripId: 'trip-01', reservationId: 'res-01', title: 'Autorização de Viagem - Menor Pedro Silva', type: 'autorizacao_menor', status: 'recebido', fileName: 'autorizacao_menor_pedro.pdf', uploadedAt: '2026-09-04' },
  { id: 'doc-03', tenantId: DEMO_TENANT_ID, travelerId: 'trav-04', customerId: 'cust-02', tripId: 'trip-01', reservationId: 'res-02', title: 'RG - Camila Albuquerque', type: 'rg', status: 'recebido', fileName: 'rg_camila.jpg', uploadedAt: '2026-09-06' },
  { id: 'doc-04', tenantId: DEMO_TENANT_ID, travelerId: 'trav-05', customerId: 'cust-02', tripId: 'trip-01', reservationId: 'res-02', title: 'RG - Juliana Costa', type: 'rg', status: 'pendente' },
  { id: 'doc-05', tenantId: DEMO_TENANT_ID, customerId: 'cust-05', tripId: 'trip-03', reservationId: 'res-05', title: 'Comprovante de Pagamento Parcela 1 - Renato', type: 'comprovante', status: 'pendente' },
  { id: 'doc-06', tenantId: DEMO_TENANT_ID, travelerId: 'trav-10', customerId: 'cust-05', tripId: 'trip-03', reservationId: 'res-05', title: 'Passaporte - Renato Guimarães', type: 'passaporte', status: 'recusado', rejectionReason: 'Foto cortada sem legibilidade do número e data de validade', uploadedAt: '2026-09-20' },
  { id: 'doc-07', tenantId: DEMO_TENANT_ID, customerId: 'cust-01', tripId: 'trip-01', reservationId: 'res-01', title: 'Contrato de Prestação de Serviços Assinado', type: 'contrato', status: 'recebido', fileName: 'contrato_assinado_res1001.pdf', uploadedAt: '2026-09-03' },
];

export const DEMO_CONTRACT_TEMPLATE: ContractTemplate = {
  id: 'tmpl-01',
  tenantId: DEMO_TENANT_ID,
  title: 'Contrato Padrão de Prestação de Serviços Turísticos',
  isDefault: true,
  content: `CONTRATO DE INTERMEDIAÇÃO E PRESTAÇÃO DE SERVIÇOS TURÍSTICOS

Pelo presente instrumento particular, de um lado:
CONTRATADA: {{nome_agencia}}, pessoa jurídica inscrita no CNPJ sob nº {{cnpj_agencia}}, com sede em {{endereco_agencia}}.

CONTRATANTE: {{nome_cliente}}, inscrito(a) no CPF nº {{cpf}}, residente e domiciliado(a) em {{cidade_cliente}}.

OBJETO DO CONTRATO:
A CONTRATADA compromete-se a intermediar a prestação de serviços turísticos para a viagem denominada: "{{viagem}}", com destino principal para {{destino}}, com saída programada para {{data_saida}} e retorno previsto para {{data_retorno}}.

VALOR E CONDIÇÕES DE PAGAMENTO:
Pelo pacote turístico ora contratado, o(a) CONTRATANTE pagará o valor total de {{valor}}, nas condições ajustadas na reserva nº {{codigo_reserva}}.

PASSAGEIROS VINCULADOS:
{{lista_passageiros}}

CANCELAMENTO E DESISTÊNCIA:
Em caso de desistência formalizada por escrito com até 30 (trinta) dias de antecedência da data de embarque, será retida a taxa administrativa de 10% (dez por cento). Após este prazo, aplicam-se as penalidades conforme legislação da Embratur e Código de Defesa do Consumidor.

E por estarem justos e contratados, assinam eletronicamente o presente instrumento.
Data de emissão: {{data_hoje}}`,
};

export const DEMO_CONTRACT_INSTANCES: ContractInstance[] = [
  {
    id: 'cnt-01',
    tenantId: DEMO_TENANT_ID,
    reservationId: 'res-01',
    customerId: 'cust-01',
    tripId: 'trip-01',
    templateId: 'tmpl-01',
    title: 'Contrato - João Carlos Silva (Porto Seguro)',
    renderedContent: 'Contrato assinado digitalmente por João Carlos Silva via verificação por token e IP.',
    signed: true,
    signedAt: '2026-09-02T11:20:00Z',
    signerName: 'João Carlos Silva',
    signerCpf: '123.456.789-00',
    signerIp: '189.120.45.102',
  },
  {
    id: 'cnt-02',
    tenantId: DEMO_TENANT_ID,
    reservationId: 'res-05',
    customerId: 'cust-05',
    tripId: 'trip-03',
    templateId: 'tmpl-01',
    title: 'Contrato - Renato Guimarães (Gramado)',
    renderedContent: 'Aguardando assinatura do cliente.',
    signed: false,
  },
];

export const DEMO_LEADS: Lead[] = [
  { id: 'lead-01', tenantId: DEMO_TENANT_ID, name: 'Tatiana Vasques', phone: '(11) 98111-2244', whatsapp: '11981112244', email: 'tatiana.v@gmail.com', source: 'instagram', stage: 'novo_lead', tripInterest: 'Porto Seguro Réveillon', estimatedValue: 3900, assignedTo: 'Rodrigo Santoro', notes: 'Comentou no post de praia pedindo valores para 2 pessoas.', createdAt: '2026-10-06' },
  { id: 'lead-02', tenantId: DEMO_TENANT_ID, name: 'Bruno Guimarães', phone: '(19) 99222-3355', whatsapp: '19992223355', email: 'bruno.gui@hotmail.com', source: 'whatsapp', stage: 'contato', tripInterest: 'Capitólio Aventura', estimatedValue: 2500, assignedTo: 'Rodrigo Santoro', notes: 'Mandou oi no WhatsApp perguntando se ainda tem vaga em Capitólio.', createdAt: '2026-10-05' },
  { id: 'lead-03', tenantId: DEMO_TENANT_ID, name: 'Clara Meireles', phone: '(11) 97333-4466', whatsapp: '11973334466', email: 'clara.m@uol.com.br', source: 'site', stage: 'interessado', tripInterest: 'Gramado Natal Luz', estimatedValue: 4980, assignedTo: 'Mariana Duarte', notes: 'Preencheu formulário no site interessada em pacote família.', createdAt: '2026-10-04' },
  { id: 'lead-04', tenantId: DEMO_TENANT_ID, name: 'Eduardo Martins', phone: '(11) 98444-5577', whatsapp: '11984445577', email: 'eduardo.m@empresa.com.br', source: 'indicacao', stage: 'orcamento', tripInterest: 'Porto Seguro Grupo Corporativo', estimatedValue: 18900, assignedTo: 'Rodrigo Santoro', notes: 'Cotação enviada para grupo de 10 funcionários.', createdAt: '2026-10-03' },
  { id: 'lead-05', tenantId: DEMO_TENANT_ID, name: 'Fernanda Albuquerque', phone: '(12) 99555-6688', whatsapp: '12995556688', email: 'fernanda.alb@gmail.com', source: 'whatsapp', stage: 'negociacao', tripInterest: 'Serra Gaúcha', estimatedValue: 4980, assignedTo: 'Mariana Duarte', notes: 'Negociando parcelamento em 4x sem juros.', createdAt: '2026-10-02' },
  { id: 'lead-06', tenantId: DEMO_TENANT_ID, name: 'Gabriel Pires', phone: '(11) 98666-7799', whatsapp: '11986667799', email: 'gabriel.pires@gmail.com', source: 'facebook', stage: 'pagamento', tripInterest: 'Capitólio', estimatedValue: 1250, assignedTo: 'Rodrigo Santoro', notes: 'Aguardando PIX para confirmação.', createdAt: '2026-10-01' },
];

export const DEMO_TASKS: Task[] = [
  { id: 'task-01', tenantId: DEMO_TENANT_ID, title: 'Cobrar 1ª Parcela em Atraso do Renato Guimarães', assignedTo: 'Fernanda Souza', dueDate: '2026-10-08', priority: 'alta', status: 'pendente', customerId: 'cust-05', description: 'Enviar mensagem amigável no WhatsApp lembrando do vencimento do boleto.' },
  { id: 'task-02', tenantId: DEMO_TENANT_ID, title: 'Solicitar RG pendente da Juliana Costa (Porto Seguro)', assignedTo: 'Patrícia Lima', dueDate: '2026-10-09', priority: 'alta', status: 'pendente', tripId: 'trip-01', description: 'Documento necessário para envio à seguradora GTA.' },
  { id: 'task-03', tenantId: DEMO_TENANT_ID, title: 'Confirmar lista de embarque de Capitólio com o motorista da Translider', assignedTo: 'Lucas Guia', dueDate: '2026-10-22', priority: 'media', status: 'pendente', tripId: 'trip-02' },
  { id: 'task-04', tenantId: DEMO_TENANT_ID, title: 'Enviar voucher e instruções de pré-viagem para passageiros de Capitólio', assignedTo: 'Patrícia Lima', dueDate: '2026-10-20', priority: 'media', status: 'pendente', tripId: 'trip-02' },
  { id: 'task-05', tenantId: DEMO_TENANT_ID, title: 'Avaliar abertura de 2º ônibus para Capitólio (Lista de espera com 6 pax)', assignedTo: 'Carlos Mendes', dueDate: '2026-10-10', priority: 'alta', status: 'em_andamento', tripId: 'trip-02' },
];

export const DEMO_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-01', tenantId: DEMO_TENANT_ID, userId: 'user-01', userName: 'Carlos Mendes', action: 'Criação de Viagem', details: 'Criou a viagem "Porto Seguro & Arraial d’Ajuda 5 Dias" com 46 vagas.', timestamp: '2026-09-01T10:00:00Z' },
  { id: 'log-02', tenantId: DEMO_TENANT_ID, userId: 'user-03', userName: 'Rodrigo Santoro', action: 'Confirmação de Reserva', details: 'Registrou a reserva #RES-1001 para João Carlos Silva (3 passageiros).', timestamp: '2026-09-02T11:00:00Z' },
  { id: 'log-03', tenantId: DEMO_TENANT_ID, userId: 'user-05', userName: 'Fernanda Souza', action: 'Baixa de Pagamento', details: 'Confirmou recebimento de R$ 5.500,00 via PIX para a reserva #RES-1001.', timestamp: '2026-09-02T11:05:00Z' },
  { id: 'log-04', tenantId: DEMO_TENANT_ID, userId: 'user-04', userName: 'Patrícia Lima', action: 'Atribuição de Assentos', details: 'Atribuiu assentos 01A, 01B e 02A para os viajantes da reserva #RES-1001.', timestamp: '2026-09-02T11:10:00Z' },
  { id: 'log-05', tenantId: DEMO_TENANT_ID, userId: 'user-02', userName: 'Mariana Duarte', action: 'Atualização de Status', details: 'Marcou viagem "Capitólio" como LOTADA e ativou lista de espera.', timestamp: '2026-09-28T10:05:00Z' },
];
