import React, { useState } from 'react';
import { Sun, Shield, Home, BatteryCharging, Grid, ArrowRight, Zap, RefreshCw } from 'lucide-react';

const EnergyFlow = ({ kpis }) => {
  const [activeNode, setActiveNode] = useState(null);

  const todayGen = kpis?.todayGeneration || 31.4;
  const todayUsed = kpis?.todayConsumption || 12.8;
  const todayExported = kpis?.exportedToGrid || 18.6;
  const batteryCharged = kpis?.batteryCharged || 6.2;

  return (
    <div className="glass-card p-6 border border-slate-800 rounded-3xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20 animate-bounce" />
            <h3 className="text-lg font-bold text-white tracking-tight">Interactive Smart Energy Flow</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Real-time power routing across microgrid nodes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5" />
            Grid Feed Active
          </span>
        </div>
      </div>

      {/* Nodes Canvas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
        
        {/* Node 1: Sun */}
        <div
          onMouseEnter={() => setActiveNode('sun')}
          onMouseLeave={() => setActiveNode(null)}
          className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
            activeNode === 'sun' ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20 scale-105' : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-2 solar-glow">
            <Sun className="w-7 h-7 animate-spin-slow" />
          </div>
          <span className="text-xs font-bold text-slate-200">Sun Source</span>
          <span className="text-[10px] text-amber-400 font-semibold mt-1">Solar Irradiance 100%</span>
        </div>

        {/* Node 2: Solar Panels */}
        <div
          onMouseEnter={() => setActiveNode('panels')}
          onMouseLeave={() => setActiveNode(null)}
          className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
            activeNode === 'panels' ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20 scale-105' : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2">
            <Zap className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-slate-200">Solar Array</span>
          <span className="text-[11px] text-emerald-400 font-bold mt-1">+{todayGen} kWh</span>
        </div>

        {/* Node 3: Smart Inverter */}
        <div
          onMouseEnter={() => setActiveNode('inverter')}
          onMouseLeave={() => setActiveNode(null)}
          className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
            activeNode === 'inverter' ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20 scale-105' : 'bg-slate-900/60 border-slate-800 hover:border-purple-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-2">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <span className="text-xs font-bold text-slate-200">DC/AC Inverter</span>
          <span className="text-[10px] text-purple-400 font-semibold mt-1">99.1% Eff.</span>
        </div>

        {/* Node 4: Home */}
        <div
          onMouseEnter={() => setActiveNode('home')}
          onMouseLeave={() => setActiveNode(null)}
          className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
            activeNode === 'home' ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20 scale-105' : 'bg-slate-900/60 border-slate-800 hover:border-blue-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-2">
            <Home className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-slate-200">Home Loads</span>
          <span className="text-[11px] text-blue-400 font-bold mt-1">{todayUsed} kWh</span>
        </div>

        {/* Node 5: Battery */}
        <div
          onMouseEnter={() => setActiveNode('battery')}
          onMouseLeave={() => setActiveNode(null)}
          className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
            activeNode === 'battery' ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20 scale-105' : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-2">
            <BatteryCharging className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-slate-200">Battery Storage</span>
          <span className="text-[11px] text-amber-400 font-bold mt-1">{batteryCharged} kWh (100%)</span>
        </div>

        {/* Node 6: National Grid */}
        <div
          onMouseEnter={() => setActiveNode('grid')}
          onMouseLeave={() => setActiveNode(null)}
          className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
            activeNode === 'grid' ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-2 cyan-glow">
            <Grid className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-slate-200">National Grid</span>
          <span className="text-[11px] text-emerald-400 font-bold mt-1">Export: {todayExported} kWh</span>
        </div>

      </div>

      {/* SVG Animated Flow Connectors */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-around text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1 text-amber-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Sun ➔ Panels
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
          Panels ➔ Inverter
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-blue-400">
          Inverter ➔ Home
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-amber-400">
          Inverter ➔ Battery
        </span>
        <span className="flex items-center gap-1 text-emerald-400 font-bold">
          Inverter ➔ National Grid ({todayExported} kWh Export)
        </span>
      </div>
    </div>
  );
};

export default EnergyFlow;
