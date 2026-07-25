import React, { useState, useEffect } from 'react';
import { Zap, DollarSign, TrendingUp, Sun, Home, Grid, Shield, Download, Calendar, User, Phone, Mail, MapPin, Sparkles, RefreshCw, BarChart2, PieChart as PieIcon, ArrowRightLeft, FileText } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import api from '../utils/api';
import EnergyFlow from '../components/EnergyFlow';
import MonthlyComparisonModal from '../components/MonthlyComparisonModal';
import { generatePDFReport } from '../utils/pdfExport';

const CustomerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, chartsRes, payRes] = await Promise.all([
          api.get('/customer/dashboard'),
          api.get('/customer/generation/charts'),
          api.get('/customer/payments')
        ]);
        setDashboardData(dashRes.data);
        setChartData(chartsRes.data);
        setPayments(payRes.data.payments || []);
      } catch (err) {
        console.error('Fetch dashboard failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !dashboardData || !chartData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-400">Loading Solar Grid Database...</p>
      </div>
    );
  }

  const { kpis, customer, insights } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header / Profile Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
              Active Customer
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {customer.customerId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, <span className="text-amber-400">{customer.name}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {customer.package} ({customer.panelCapacity} kW) • Tariff: <strong className="text-emerald-400">Rs. {customer.tariff.toFixed(2)} / kWh</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowComparisonModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500 text-xs flex items-center gap-1.5 transition-all shadow-md"
          >
            <ArrowRightLeft className="w-4 h-4" /> Compare Months
          </button>
          
          <button
            onClick={() => generatePDFReport(customer, payments, kpis)}
            className="px-4 py-2.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 hover:brightness-110 text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* TOP STATISTICS CARDS (6 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Today's Generation */}
        <div className="glass-card glass-card-hover p-4 border border-amber-500/30 rounded-2xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
            <Sun className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Today Generation</span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">{kpis.todayGeneration} <span className="text-xs font-normal text-slate-400">kWh</span></h3>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">↑ +4.2% vs yesterday</span>
        </div>

        {/* Card 2: Today's Consumption */}
        <div className="glass-card glass-card-hover p-4 border border-blue-500/30 rounded-2xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Today Consumption</span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">{kpis.todayConsumption} <span className="text-xs font-normal text-slate-400">kWh</span></h3>
          <span className="text-[10px] text-blue-400 font-semibold block mt-1">Home Loads</span>
        </div>

        {/* Card 3: Electricity Exported */}
        <div className="glass-card glass-card-hover p-4 border border-emerald-500/30 rounded-2xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Grid className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Exported to Grid</span>
          <h3 className="text-xl font-extrabold text-emerald-400 mt-0.5">{kpis.exportedToGrid} <span className="text-xs font-normal text-slate-400">kWh</span></h3>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">59% Export Ratio</span>
        </div>

        {/* Card 4: Estimated Earnings Today */}
        <div className="glass-card glass-card-hover p-4 border border-purple-500/30 rounded-2xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Today Earnings</span>
          <h3 className="text-xl font-extrabold text-purple-400 mt-0.5">Rs. {kpis.todayEarnings}</h3>
          <span className="text-[10px] text-slate-400 block mt-1">Rate: Rs. {kpis.tariffRate}/kWh</span>
        </div>

        {/* Card 5: Current Month Generation */}
        <div className="glass-card glass-card-hover p-4 border border-cyan-500/30 rounded-2xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">July Generation</span>
          <h3 className="text-xl font-extrabold text-white mt-0.5">{kpis.currentMonthGeneration} <span className="text-xs font-normal text-slate-400">kWh</span></h3>
          <span className="text-[10px] text-cyan-400 font-semibold block mt-1">Target 820 kWh</span>
        </div>

        {/* Card 6: Carbon Emission Reduction */}
        <div className="glass-card glass-card-hover p-4 border border-emerald-500/30 rounded-2xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">CO₂ Saved</span>
          <h3 className="text-xl font-extrabold text-emerald-400 mt-0.5">{kpis.co2ReductionKg} <span className="text-xs font-normal text-slate-400">kg</span></h3>
          <span className="text-[10px] text-slate-400 block mt-1">~ 28 Trees Equivalent</span>
        </div>

      </div>

      {/* ENERGY FLOW ANIMATED DIAGRAM */}
      <EnergyFlow kpis={kpis} />

      {/* SMART INSIGHTS PANEL */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl bg-slate-900/60 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          Smart System Diagnostics & Insights
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {insights.map((ins, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>{ins}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 9 INTERACTIVE RECHARTS CHARTS GRID */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-amber-400" /> Real-Time Analytics & Performance Charts
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Hourly Generation */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">1. Hourly Electricity Generation (kWh)</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="generation" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hourly Consumption */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">2. Hourly Electricity Consumption (kWh)</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="consumption" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Generation vs Consumption */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">3. Generation vs Consumption Comparison</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.hourly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="generation" name="Solar Gen (kWh)" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="consumption" name="Home Load (kWh)" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Monthly Generation */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">4. Monthly Electricity Generation (kWh)</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="generated" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 5: Monthly Earnings */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">5. Monthly Net Export Earnings (Rs.)</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="earnings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 6: Electricity Distribution Pie Chart */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">6. Power Distribution Share (%)</h4>
            <div className="h-60 w-full text-xs flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData.distribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {chartData.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 7: Yearly Generation Trend */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">7. 30-Day Daily Generation Trend (kWh)</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="generated" stroke="#06B6D4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 8: CO₂ Reduction Bar Chart */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-3">
            <h4 className="text-sm font-bold text-slate-200">8. Monthly CO₂ Reduction Impact (kg)</h4>
            <div className="h-60 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                  <Bar dataKey="co2" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 9: Solar Panel & System Efficiency Progress */}
          <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-4 lg:col-span-2">
            <h4 className="text-sm font-bold text-slate-200">9. Hardware Health & Operational Efficiency Gauges</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="text-xs text-slate-400 block font-semibold">Solar Panel Array</span>
                <div className="text-2xl font-extrabold text-amber-400">98.4%</div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '98.4%' }} />
                </div>
                <span className="text-[10px] text-emerald-400">Optimal Performance</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="text-xs text-slate-400 block font-semibold">Inverter Conversion</span>
                <div className="text-2xl font-extrabold text-emerald-400">99.1%</div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '99.1%' }} />
                </div>
                <span className="text-[10px] text-emerald-400">Active Pure Sine Wave</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <span className="text-xs text-slate-400 block font-semibold">Battery Storage Health</span>
                <div className="text-2xl font-extrabold text-cyan-400">96.0%</div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '96%' }} />
                </div>
                <span className="text-[10px] text-cyan-400">10 kWh Tesla Powerwall</span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MONTHLY PAYMENT TABLE */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Monthly Grid Payment Statements</h3>
            <p className="text-xs text-slate-400">Net accounting statements certified by Electricity Board</p>
          </div>
          <button
            onClick={() => generatePDFReport(customer, payments, kpis)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Export All Statements
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-3">Month</th>
                <th className="p-3">Generated Units</th>
                <th className="p-3">Consumed Units</th>
                <th className="p-3">Exported Units</th>
                <th className="p-3">Rate / Unit</th>
                <th className="p-3">Total Earnings</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {payments.map((p) => (
                <tr key={p.payment_id} className="hover:bg-slate-900/60 transition-all">
                  <td className="p-3 font-semibold text-white">{p.month}</td>
                  <td className="p-3">{p.generated_units} kWh</td>
                  <td className="p-3">{p.consumed_units} kWh</td>
                  <td className="p-3 font-bold text-emerald-400">{p.exported_units} kWh</td>
                  <td className="p-3">Rs. {Number(p.rate).toFixed(2)}</td>
                  <td className="p-3 font-bold text-amber-400">Rs. {Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.payment_status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {p.payment_status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => generatePDFReport(customer, [p], kpis)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-all"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER INFORMATION CARD */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-amber-400" /> Customer System Specification Card
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Customer Name</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{customer.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Customer ID</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5 block font-mono">{customer.customerId}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Installation Date</span>
            <span className="text-sm font-bold text-slate-200 mt-0.5 block">{customer.installationDate}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Solar Package</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{customer.package}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Panel Capacity</span>
            <span className="text-sm font-bold text-white mt-0.5 block">{customer.panelCapacity} kW</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Battery Capacity</span>
            <span className="text-sm font-bold text-cyan-400 mt-0.5 block">{customer.batteryCapacity} kWh</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">System Warranty</span>
            <span className="text-sm font-bold text-purple-400 mt-0.5 block">15 Years Guarantee</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block font-semibold">Grid Feed-in Tariff</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">Rs. {customer.tariff.toFixed(2)} / kWh</span>
          </div>
        </div>
      </div>

      {/* MONTH COMPARISON MODAL */}
      {showComparisonModal && (
        <MonthlyComparisonModal
          payments={payments}
          onClose={() => setShowComparisonModal(false)}
        />
      )}

    </div>
  );
};

export default CustomerDashboard;
