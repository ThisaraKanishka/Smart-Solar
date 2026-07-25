import React, { useState } from 'react';
import { Sun, Moon, Zap, User, Shield, Bell, LogOut, Menu, X, ChevronDown, Calculator, Package, BarChart3, Wrench, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import QuickLoginModal from './QuickLoginModal';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, loginAsDemoCustomer, loginAsDemoAdmin, isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 text-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20 animate-pulse" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  SMART<span className="text-amber-400">SOLAR</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase text-emerald-400 block -mt-1 font-semibold">
                  CEB Electricity Board
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => setActiveTab('landing')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'landing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActiveTab('new-customer')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'new-customer' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Explore Solar
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'calculator' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Calculator className="w-4 h-4" />
                Savings Calculator
              </button>

              <button
                onClick={() => setActiveTab('packages')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'packages' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Package className="w-4 h-4" />
                Packages
              </button>

              {/* Customer Portal Link */}
              {isAuthenticated && !isAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => setActiveTab('maintenance')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === 'maintenance' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-400" />
                    Maintenance
                  </button>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      activeTab === 'reports' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Reports
                  </button>
                </>
              )}

              {/* Admin Dashboard Link */}
              {isAuthenticated && isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-md shadow-purple-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  Admin Dashboard
                </button>
              )}
            </div>

            {/* Right Action Items */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-all"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-400" />}
              </button>

              {/* Notification Bell */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </button>
                  {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
                </div>
              )}

              {/* User Account / Login Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 pl-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isAdmin ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                      {user.first_name ? user.first_name[0] : 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-semibold text-white leading-tight">{user.first_name} {user.last_name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <User className="w-4 h-4" />
                    Login / Demo
                  </button>
                </div>
              )}

              {/* Mobile Hamburger */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
            <button onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-300">Home</button>
            <button onClick={() => { setActiveTab('new-customer'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-300">Explore Solar</button>
            <button onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-300">Savings Calculator</button>
            <button onClick={() => { setActiveTab('packages'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-slate-300">Packages</button>
            
            {isAuthenticated && !isAdmin && (
              <>
                <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-emerald-400 font-semibold">Dashboard</button>
                <button onClick={() => { setActiveTab('maintenance'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-amber-400">Maintenance</button>
                <button onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-cyan-400">Reports</button>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <button onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 text-purple-400 font-semibold">Admin Dashboard</button>
            )}
          </div>
        )}
      </nav>

      {/* Quick Login Modal */}
      {loginModalOpen && <QuickLoginModal onClose={() => setLoginModalOpen(false)} setActiveTab={setActiveTab} />}
    </>
  );
};

export default Navbar;
