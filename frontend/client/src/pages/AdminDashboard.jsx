import React, { useState, useEffect } from 'react';
import { Shield, Users, Package, DollarSign, Zap, Search, Plus, Send, RefreshCw, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Form States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('ALL');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Daily Gen modal/form
  const [showGenForm, setShowGenForm] = useState(false);
  const [genCustId, setGenCustId] = useState('CUST-1001');
  const [genKwh, setGenKwh] = useState(32.5);
  const [usedKwh, setUsedKwh] = useState(14.0);
  const [exportedKwh, setExportedKwh] = useState(18.5);
  const [genSuccess, setGenSuccess] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, custRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/customers?search=${searchTerm}&status=${statusFilter}`)
      ]);
      setStats(statsRes.data);
      setCustomers(custRes.data.customers || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [searchTerm, statusFilter]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/notifications/broadcast', {
        title: broadcastTitle,
        message: broadcastMessage,
        target_customer_id: targetCustomer
      });
      setBroadcastSuccess(true);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setTimeout(() => setBroadcastSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordGeneration = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/generation', {
        customer_id: genCustId,
        date: new Date().toISOString().split('T')[0],
        generated_kwh: genKwh,
        used_kwh: usedKwh,
        exported_kwh: exportedKwh,
        weather: 'Sunny'
      });
      setGenSuccess(true);
      setTimeout(() => {
        setGenSuccess(false);
        setShowGenForm(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
        <p className="text-xs text-slate-400 mt-2">Loading Electricity Board Admin Suite...</p>
      </div>
    );
  }

  const { kpis, packageDistribution } = stats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-bold uppercase tracking-wider">
              System Administrator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Electricity Board Solar Operations Hub
          </h1>
          <p className="text-xs text-slate-400">Managing 100+ Grid Connected Solar Installations & Payouts</p>
        </div>

        <button
          onClick={() => setShowGenForm(true)}
          className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:brightness-110"
        >
          <Plus className="w-4 h-4" /> Record Daily Generation
        </button>
      </div>

      {/* KPI Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 border border-purple-500/30 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Customers</span>
          <h3 className="text-2xl font-extrabold text-white mt-0.5">{kpis.totalCustomers}</h3>
        </div>

        <div className="glass-card p-5 border border-amber-500/30 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Capacity</span>
          <h3 className="text-2xl font-extrabold text-amber-400 mt-0.5">{kpis.totalCapacityMw} <span className="text-xs font-normal text-slate-400">MW</span></h3>
        </div>

        <div className="glass-card p-5 border border-emerald-500/30 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Solar Output</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-0.5">{kpis.totalGenerationMwh} <span className="text-xs font-normal text-slate-400">MWh</span></h3>
        </div>

        <div className="glass-card p-5 border border-cyan-500/30 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Grid Payouts</span>
          <h3 className="text-2xl font-extrabold text-cyan-400 mt-0.5">Rs. {(kpis.totalPayouts / 1000000).toFixed(2)} M</h3>
        </div>

      </div>

      {/* CUSTOMER DIRECTORY & FILTERS */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Customer Database Directory</h3>
            <p className="text-xs text-slate-400">Manage registered solar customers, packages, and statuses</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-3">ID</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Package</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Feed-in Rate</th>
                <th className="p-3">Status</th>
                <th className="p-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {customers.slice(0, 15).map((c) => (
                <tr key={c.customer_id} className="hover:bg-slate-900/60 transition-all">
                  <td className="p-3 font-mono font-bold text-amber-400">{c.customer_id}</td>
                  <td className="p-3 font-semibold text-white">{c.first_name} {c.last_name}</td>
                  <td className="p-3 text-emerald-400">{c.package_name}</td>
                  <td className="p-3">{c.panel_capacity} kW</td>
                  <td className="p-3">Rs. {Number(c.rate_per_kwh || 48).toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 truncate max-w-[180px]">{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-500 pt-2">Showing 15 of {customers.length} total customer records</p>
        </div>
      </div>

      {/* BROADCAST SYSTEM NOTIFICATION PANEL */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-4 max-w-2xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-amber-400" /> Broadcast System Alert to Customers
        </h3>

        {broadcastSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold animate-in fade-in">
            ✓ Broadcast notification sent successfully to target customers!
          </div>
        )}

        <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Alert Title</label>
            <input
              type="text"
              required
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="e.g. Scheduled Grid Maintenance Alert"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Customer</label>
            <select
              value={targetCustomer}
              onChange={(e) => setTargetCustomer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Active Customers (Broadcast)</option>
              <option value="CUST-1001">CUST-1001 (Thisara Kanishka)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Message Content</label>
            <textarea
              required
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Enter system notification details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md text-xs flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Send Notification
          </button>
        </form>
      </div>

      {/* Daily Gen Modal */}
      {showGenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Record Daily Generation Entry</h3>
            
            {genSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                ✓ Daily generation record saved!
              </div>
            )}

            <form onSubmit={handleRecordGeneration} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer ID</label>
                <input type="text" value={genCustId} onChange={(e) => setGenCustId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Generated kWh</label>
                <input type="number" step="0.1" value={genKwh} onChange={(e) => setGenKwh(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Home Consumed kWh</label>
                <input type="number" step="0.1" value={usedKwh} onChange={(e) => setUsedKwh(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Grid Exported kWh</label>
                <input type="number" step="0.1" value={exportedKwh} onChange={(e) => setExportedKwh(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowGenForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
