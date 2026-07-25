import React, { useState } from 'react';
import { X, ArrowRightLeft, TrendingUp, TrendingDown, Zap, DollarSign } from 'lucide-react';

const MonthlyComparisonModal = ({ payments, onClose }) => {
  const [monthA, setMonthA] = useState(payments[0]?.month || 'July 2026');
  const [monthB, setMonthB] = useState(payments[1]?.month || 'June 2026');

  const recordA = payments.find(p => p.month === monthA) || payments[0] || {};
  const recordB = payments.find(p => p.month === monthB) || payments[1] || {};

  const genA = Number(recordA.generated_units || 0);
  const genB = Number(recordB.generated_units || 0);
  const diffGen = genA - genB;
  const pctGen = genB ? ((diffGen / genB) * 100).toFixed(1) : 0;

  const earnA = Number(recordA.amount || 0);
  const earnB = Number(recordB.amount || 0);
  const diffEarn = earnA - earnB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Monthly Generation Comparison Tool</h3>
        </div>

        {/* Month Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Select Month A</label>
            <select
              value={monthA}
              onChange={(e) => setMonthA(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {payments.map(p => (
                <option key={p.payment_id} value={p.month}>{p.month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Select Month B</label>
            <select
              value={monthB}
              onChange={(e) => setMonthB(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {payments.map(p => (
                <option key={p.payment_id} value={p.month}>{p.month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Cards Matrix */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Month A Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-400">{recordA.month}</span>
            <div className="pt-2 space-y-1">
              <p className="text-slate-400">Generated: <strong className="text-white">{recordA.generated_units} kWh</strong></p>
              <p className="text-slate-400">Consumed: <strong className="text-white">{recordA.consumed_units} kWh</strong></p>
              <p className="text-slate-400">Exported: <strong className="text-emerald-400">{recordA.exported_units} kWh</strong></p>
              <p className="text-slate-400">Earnings: <strong className="text-amber-400">Rs. {Number(recordA.amount).toLocaleString()}</strong></p>
            </div>
          </div>

          {/* Month B Details */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-xs font-bold text-cyan-400">{recordB.month}</span>
            <div className="pt-2 space-y-1">
              <p className="text-slate-400">Generated: <strong className="text-white">{recordB.generated_units} kWh</strong></p>
              <p className="text-slate-400">Consumed: <strong className="text-white">{recordB.consumed_units} kWh</strong></p>
              <p className="text-slate-400">Exported: <strong className="text-emerald-400">{recordB.exported_units} kWh</strong></p>
              <p className="text-slate-400">Earnings: <strong className="text-amber-400">Rs. {Number(recordB.amount).toLocaleString()}</strong></p>
            </div>
          </div>
        </div>

        {/* Summary Variance Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <h5 className="font-bold text-white uppercase tracking-wider text-[10px]">Variance Analysis</h5>
          <div className="flex items-center justify-between text-slate-300">
            <span>Generation Difference ({monthA} vs {monthB}):</span>
            <span className={`font-bold flex items-center gap-1 ${diffGen >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {diffGen >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {diffGen >= 0 ? `+${diffGen.toFixed(1)} kWh (+${pctGen}%)` : `${diffGen.toFixed(1)} kWh (${pctGen}%)`}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Earnings Revenue Delta:</span>
            <span className={`font-bold ${diffEarn >= 0 ? 'text-amber-400' : 'text-slate-400'}`}>
              {diffEarn >= 0 ? `+ Rs. ${diffEarn.toLocaleString()}` : `- Rs. ${Math.abs(diffEarn).toLocaleString()}`}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlyComparisonModal;
