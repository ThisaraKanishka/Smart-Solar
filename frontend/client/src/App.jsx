import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

import LandingPage from './pages/LandingPage';
import NewCustomerPortal from './pages/NewCustomerPortal';
import SavingsCalculator from './pages/SavingsCalculator';
import PackagesPage from './pages/PackagesPage';
import CustomerDashboard from './pages/CustomerDashboard';
import MaintenancePage from './pages/MaintenancePage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboard from './pages/AdminDashboard';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'new-customer' && <NewCustomerPortal setActiveTab={setActiveTab} />}
        {activeTab === 'calculator' && <SavingsCalculator setActiveTab={setActiveTab} />}
        {activeTab === 'packages' && <PackagesPage setActiveTab={setActiveTab} />}

        {/* Customer Protected Views */}
        {activeTab === 'dashboard' && <CustomerDashboard />}
        {activeTab === 'maintenance' && <MaintenancePage />}
        {activeTab === 'reports' && <ReportsPage />}

        {/* Admin View */}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating AI Chat Assistant */}
      <AIChatbot />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
