import React, { useState } from 'react';
import { Calculator, Zap, DollarSign, TrendingUp, Calendar, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const SavingsCalculator = ({ setActiveTab }) => {
  const [bill, setBill] = useState(25000);
  const [houseType, setHouseType] = useState('Double Story');
  const [monthlyKwh, setMonthlyKwh] = useState(450);
  const [roofSqft, setRoofSqft] = useState(600);
  const [selectedScheme, setSelectedScheme] = useState('Net Accounting'); // 'Net Metering', 'Net Accounting', 'Net Plus'

  // Formula Calculations based on Scheme
  const calculatedCapacity = Math.min(25, Math.max(3, Number((monthlyKwh / 120).toFixed(1))));

  let recommendedPkg = 'Bronze Net Metering (3kW)';
  let pkgPrice = 450000;
  let exportRate = 37.00;

  if (calculatedCapacity >= 15) {
    recommendedPkg = selectedScheme === 'Net Plus' ? 'Enterprise Net Plus (25kW)' : 'Enterprise Solar System (25kW)';
    pkgPrice = 3100000;
    exportRate = 52.00;
  } else if (calculatedCapacity >= 8) {
    recommendedPkg = selectedScheme === 'Net Plus' ? 'Gold Net Plus (10kW)' : 'Gold Net Accounting (10kW)';
    pkgPrice = 1350000;
    exportRate = 48.00;
  } else if (calculatedCapacity >= 4.5) {
    recommendedPkg = selectedScheme === 'Net Metering' ? 'Silver Net Metering (5kW)' : 'Silver Net Accounting (5kW)';
    pkgPrice = 720000;
    exportRate = 42.00;
  }

  const expectedMonthlyGen = Math.round(calculatedCapacity * 125);
  
  let consumedUnits = 0;
  let exportedUnits = 0;
  let monthlyGridEarnings = 0;
  let billSaved = 0;

  if (selectedScheme === 'Net Plus') {
    // 100% Export to Grid, 0% Self Use
    consumedUnits = 0;
    exportedUnits = expectedMonthlyGen;
    monthlyGridEarnings = Math.round(exportedUnits * exportRate);
    billSaved = 0; // Full electricity bill paid separately
  } else if (selectedScheme === 'Net Metering') {
    // Self-use + Energy Credits
    consumedUnits = Math.round(Math.min(monthlyKwh, expectedMonthlyGen));
    exportedUnits = Math.max(0, expectedMonthlyGen - consumedUnits);
    monthlyGridEarnings = 0; // Credits carried forward up to 10 years
    billSaved = Math.round(Math.min(bill, bill * (consumedUnits / (monthlyKwh || 1))));
  } else {
    // Net Accounting: Self-use + Monetary Credits
    consumedUnits = Math.round(Math.min(monthlyKwh, expectedMonthlyGen * 0.45));
    exportedUnits = Math.max(0, expectedMonthlyGen - consumedUnits);
    monthlyGridEarnings = Math.round(exportedUnits * exportRate);
    billSaved = Math.round(bill * 0.45);
  }

  const totalMonthlyBenefit = selectedScheme === 'Net Plus' ? monthlyGridEarnings : (billSaved + monthlyGridEarnings);
  const expectedAnnualIncome = Math.round(totalMonthlyBenefit * 12);
  const paybackYears = Number((pkgPrice / (expectedAnnualIncome || 1)).toFixed(1));
  const roiPercent = Number(((expectedAnnualIncome / pkgPrice) * 100).toFixed(1));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest">
          <Calculator className="w-4 h-4" /> CEB / LECO Yield & Financial Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Solar Savings & ROI Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your details and select your preferred scheme (Net Metering, Net Accounting, or Net Plus) to compute expected grid payouts and payback period.
        </p>
      </div>

      {/* SCHEME SELECTOR TABS */}
      <div className="glass-card p-4 border border-slate-800 rounded-2xl max-w-3xl mx-auto">
        <label className="block text-xs text-slate-400 font-semibold mb-2 text-center uppercase tracking-wider">
          Select Interconnection Scheme
        </label>
        <div className="grid grid-cols-3 gap-2">
          
          <button
            type="button"
            onClick={() => setSelectedScheme('Net Metering')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedScheme === 'Net Metering'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span className="block text-base">🔋</span>
            <span>Net Metering</span>
            <span className="block text-[9px] font-normal text-slate-400 mt-0.5">Energy Credits</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScheme('Net Accounting')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedScheme === 'Net Accounting'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span className="block text-base">💰</span>
            <span>Net Accounting</span>
            <span className="block text-[9px] font-normal text-slate-400 mt-0.5">Monetary Credits</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedScheme('Net Plus')}
            className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
              selectedScheme === 'Net Plus'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span className="block text-base">🔄</span>
            <span>Net Plus</span>
            <span className="block text-[9px] font-normal text-slate-400 mt-0.5">100% Grid Export</span>
          </button>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Controls - Left (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 border border-slate-800 rounded-3xl space-y-6">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">1. Enter Consumption Data</h3>

          {/* Input 1: Monthly Bill */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-300">Monthly Electricity Bill</label>
              <span className="text-amber-400">Rs. {bill.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="2500"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Input 2: Average kWh usage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-300">Average Monthly Usage (kWh)</label>
              <span className="text-emerald-400">{monthlyKwh} kWh</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={monthlyKwh}
              onChange={(e) => setMonthlyKwh(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Input 3: House Type */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Premises Type</label>
            <div className="grid grid-cols-3 gap-2">
              {['Single Story', 'Double Story', 'Commercial'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setHouseType(type)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    houseType === type
                      ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Input 4: Roof Size */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label className="text-slate-300">Available Roof Space</label>
              <span className="text-cyan-400">{roofSqft} sq ft</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={roofSqft}
              onChange={(e) => setRoofSqft(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Results - Right (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Recommended Package Card */}
          <div className="glass-card p-6 sm:p-8 border border-amber-500/40 bg-slate-900/90 rounded-3xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Recommended Package ({selectedScheme})
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">{recommendedPkg}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                {calculatedCapacity} kW Capacity
              </span>
            </div>

            {/* KPI Result Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Expected Monthly Gen</span>
                <span className="text-lg font-bold text-emerald-400 mt-1 block">{expectedMonthlyGen} kWh</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Monthly Grid Return</span>
                <span className="text-lg font-bold text-amber-400 mt-1 block">
                  {selectedScheme === 'Net Metering' ? `${exportedUnits} kWh Credit` : `Rs. ${monthlyGridEarnings.toLocaleString()}`}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Monthly Benefit</span>
                <span className="text-lg font-bold text-cyan-400 mt-1 block">Rs. {totalMonthlyBenefit.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Annualized Return</span>
                <span className="text-lg font-bold text-purple-400 mt-1 block">Rs. {expectedAnnualIncome.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Payback Period</span>
                <span className="text-lg font-bold text-white mt-1 block">{paybackYears} Years</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Estimated ROI</span>
                <span className="text-lg font-bold text-amber-400 mt-1 block">{roiPercent}% / year</span>
              </div>

            </div>

            {/* Bottom Call to Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Turnkey System Price: <strong className="text-white">Rs. {pkgPrice.toLocaleString()}</strong></span>
              <button
                onClick={() => setActiveTab('packages')}
                className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                Choose Package <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SavingsCalculator;
