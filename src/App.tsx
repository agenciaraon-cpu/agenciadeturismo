/**
 * RAON TRAVEL - A central de operação da sua agência de turismo
 * Venda. Organize. Cobre. Opere. Acompanhe.
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { TripsView } from './components/trips/TripsView';
import { TripDetailView } from './components/trips/TripDetailView';
import { TravelersView } from './components/travelers/TravelersView';
import { ReservationsView } from './components/reservations/ReservationsView';
import { FinanceView } from './components/finance/FinanceView';
import { CrmView } from './components/crm/CrmView';
import { ItinerariesView } from './components/itineraries/ItinerariesView';
import { BoardingView } from './components/boarding/BoardingView';
import { SeatsView } from './components/seats/SeatsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { ContractsView } from './components/contracts/ContractsView';
import { CommunicationView } from './components/communication/CommunicationView';
import { CalendarView } from './components/calendar/CalendarView';
import { TasksView } from './components/tasks/TasksView';
import { ReportsView } from './components/reports/ReportsView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { RaonAiView } from './components/ai/RaonAiView';
import { AgencySettingsView } from './components/agency-settings/AgencySettingsView';
import { AdminSaasView } from './components/admin/AdminSaasView';
import { TravelerPortalView } from './components/portal/TravelerPortalView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toasts, removeToast } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Render view router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'trips':
        return <TripsView />;
      case 'trip_detail':
        return <TripDetailView />;
      case 'reservations':
        return <ReservationsView />;
      case 'travelers':
      case 'customers':
        return <TravelersView />;
      case 'finance':
        return <FinanceView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'documents':
        return <DocumentsView />;
      case 'contracts':
        return <ContractsView />;
      case 'itineraries':
        return <ItinerariesView />;
      case 'boarding':
        return <BoardingView />;
      case 'seats':
        return <SeatsView />;
      case 'calendar':
        return <CalendarView />;
      case 'tasks':
        return <TasksView />;
      case 'crm':
      case 'quotes':
        return <CrmView />;
      case 'communication':
        return <CommunicationView />;
      case 'ai':
        return <RaonAiView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <AgencySettingsView />;
      case 'admin_saas':
        return <AdminSaasView />;
      case 'traveler_portal':
        return <TravelerPortalView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F8FC] text-[#0F172A]">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Search Modal (Ctrl + K) */}
      <GlobalSearchModal />

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border border-slate-800'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-4 w-4 text-white shrink-0" />}
              {toast.type === 'info' && <Info className="h-4 w-4 text-white shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
