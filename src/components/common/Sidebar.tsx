import React from 'react';
import {
  LayoutDashboard,
  Target,
  Plane,
  BookmarkCheck,
  Users,
  UserCheck,
  DollarSign,
  Truck,
  FileText,
  FileSignature,
  MapPin,
  ClipboardList,
  Armchair,
  Calendar,
  CheckSquare,
  MessageSquare,
  Sparkles,
  BarChart3,
  Settings,
  Building2,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, currentRole, agency, currentUser } = useApp();

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ElementType;
    badge?: string;
    allowedRoles?: string[];
    highlight?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM & Funil', icon: Target, badge: 'Vendas' },
    { id: 'trips', label: 'Viagens & Pacotes', icon: Plane },
    { id: 'reservations', label: 'Reservas', icon: BookmarkCheck },
    { id: 'travelers', label: 'Viajantes (Passageiros)', icon: Users },
    { id: 'customers', label: 'Clientes (Compradores)', icon: UserCheck },
    { id: 'finance', label: 'Financeiro', icon: DollarSign, badge: 'DRE' },
    { id: 'fornecedores' as any, idOverride: 'suppliers', label: 'Fornecedores', icon: Truck },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'contracts', label: 'Contratos', icon: FileSignature },
    { id: 'itineraries', label: 'Roteiros Dia a Dia', icon: MapPin },
    { id: 'boarding', label: 'Lista de Embarque', icon: ClipboardList, badge: 'Mobile' },
    { id: 'seats', label: 'Mapa de Assentos', icon: Armchair },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'communication', label: 'Comunicação WhatsApp', icon: MessageSquare },
    { id: 'ai', label: 'RAON IA Copilot', icon: Sparkles, highlight: true },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações da Agência', icon: Settings },
  ].map((item: any) => ({
    ...item,
    id: item.idOverride ? item.idOverride : item.id,
  }));

  // Role check helper
  const isAccessible = (viewId: AppView) => {
    if (currentRole === 'admin' || currentRole === 'saas_owner') return true;
    if (currentRole === 'gerente') return viewId !== 'admin_saas';
    if (currentRole === 'comercial') {
      return ['dashboard', 'crm', 'quotes', 'customers', 'reservations', 'trips', 'ai', 'communication'].includes(viewId);
    }
    if (currentRole === 'operacional') {
      return ['dashboard', 'trips', 'travelers', 'itineraries', 'boarding', 'seats', 'suppliers', 'tasks', 'ai'].includes(viewId);
    }
    if (currentRole === 'financeiro') {
      return ['dashboard', 'finance', 'reports', 'reservations', 'customers', 'tasks', 'ai'].includes(viewId);
    }
    if (currentRole === 'guia') {
      return ['boarding', 'seats', 'trips', 'itineraries', 'travelers'].includes(viewId);
    }
    return true;
  };

  const handleSelect = (viewId: AppView) => {
    setCurrentView(viewId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col border-r border-slate-200 bg-[#0F172A] text-slate-200 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header in Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md">
              <Plane className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white">RAON TRAVEL</span>
              <p className="text-[10px] text-slate-400 font-medium">A central da sua agência</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Operação & Gestão
          </div>

          {navItems.map((item) => {
            const active = currentView === item.id;
            const accessible = isAccessible(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                disabled={!accessible}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : accessible
                    ? item.highlight
                      ? 'text-cyan-300 hover:bg-slate-800/80 bg-slate-800/30 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
                title={!accessible ? 'Acesso restrito para o seu perfil' : ''}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <item.icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      active ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        active
                          ? 'bg-blue-700 text-white'
                          : item.highlight
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {!accessible && <ShieldAlert className="h-3 w-3 text-slate-600" />}
                </div>
              </button>
            );
          })}

          {/* Section: Plataforma SaaS (Exclusive for SuperAdmin) */}
          {(currentRole === 'admin' || currentRole === 'saas_owner') && (
            <div className="pt-4">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Proprietário SaaS
              </div>
              <button
                onClick={() => handleSelect('admin_saas')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  currentView === 'admin_saas'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-indigo-400" />
                  <span>ADMIN RAON (Master)</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
              </button>
            </div>
          )}
        </nav>

        {/* Agency Footer Card */}
        <div className="border-t border-slate-800 p-3 bg-slate-900/60">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-800/70 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              {agency.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-white truncate">{agency.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.name} ({currentUser.role})</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
