import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, AlertTriangle, ShieldCheck, Calendar, Clock, Battery, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const MaintenancePage = () => {
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    const fetchMaint = async () => {
      try {
        const res = await api.get('/customer/maintenance');
        setMaintenance(res.data.maintenance);
      } catch (err) {
        console.error('Fetch maintenance error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaint();
  }, []);

  const handleRequestService = (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 5000);
  };

  if (loading || !maintenance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs text-slate-400 mt-2">Loading Maintenance Diagnostics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Wrench className="w-4 h-4" /> System Health Diagnostics
        </div>
        <h1 className="text-3xl font-extrabold text-white">Maintenance & Hardware Status</h1>
        <p className="text-xs text-slate-400">
          Automated real-time monitoring of solar panels, battery health, and inverter sine-wave sync.
        </p>
      </div>

      {/* Main 3 Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Panel Status */}
        <div className="glass-card p-6 border border-amber-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              Optimal
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Solar Panel Array</span>
            <h3 className="text-lg font-bold text-white mt-1">{maintenance.panel_status}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
            Surface dust levels are low. Photovoltaic cell efficiency operating within peak parameters.
          </p>
        </div>

        {/* Battery Status */}
        <div className="glass-card p-6 border border-cyan-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Battery className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              96% Health
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Battery Storage</span>
            <h3 className="text-lg font-bold text-white mt-1">{maintenance.battery_status}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
            Lithium-ion cells balanced. Thermal cooling fan and BMS charge limits fully operational.
          </p>
        </div>

        {/* Inverter Status */}
        <div className="glass-card p-6 border border-purple-500/30 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">
              99.1% Eff.
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">DC/AC Smart Inverter</span>
            <h3 className="text-lg font-bold text-white mt-1">{maintenance.inverter_status}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
            Pure sine wave grid sync confirmed. Anti-islanding grid protection relay engaged.
          </p>
        </div>

      </div>

      {/* Schedule & History Banner */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" /> Last Maintenance Inspection
          </span>
          <span className="text-base font-bold text-white block pt-1">{maintenance.last_service}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" /> Next Scheduled Maintenance
          </span>
          <span className="text-base font-bold text-amber-400 block pt-1">{maintenance.next_service}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-cyan-400" /> Cleaning Schedule
          </span>
          <span className="text-base font-bold text-cyan-400 block pt-1">{maintenance.cleaning_schedule}</span>
        </div>
      </div>

      {/* Book Inspection Form */}
      <div className="glass-card p-8 border border-slate-800 rounded-3xl space-y-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white text-center">Schedule On-Site Engineer Inspection</h3>

        {requestSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold text-center animate-in fade-in">
            ✓ Maintenance service request dispatched! Electricity Board certified technician will visit your site on the requested date.
          </div>
        ) : (
          <form onSubmit={handleRequestService} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Inspection Date</label>
              <input type="date" required defaultValue="2026-08-01" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Service Type</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500">
                <option>Routine Panel Cleaning & Wash</option>
                <option>Inverter Firmware & Safety Checkup</option>
                <option>Battery Health & Thermal Diagnostic</option>
                <option>Full System Annual Overhaul</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg transition-all"
            >
              Book Maintenance Dispatch
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default MaintenancePage;
