import React from 'react';
import { Zap, Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-900">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">SMART<span className="text-amber-400">SOLAR</span></span>
            </div>
            <p className="leading-relaxed">
              Official Solar Energy Monitoring & Grid Export Management Portal of the Electricity Board.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              National Grid Status: Operational
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">Quick Navigation</h5>
            <ul className="space-y-1.5">
              <li><button onClick={() => setActiveTab('landing')} className="hover:text-amber-400">Home</button></li>
              <li><button onClick={() => setActiveTab('new-customer')} className="hover:text-emerald-400">Explore Solar</button></li>
              <li><button onClick={() => setActiveTab('calculator')} className="hover:text-cyan-400">Savings Calculator</button></li>
              <li><button onClick={() => setActiveTab('packages')} className="hover:text-purple-400">Solar Packages</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">Customer Care</h5>
            <ul className="space-y-1.5">
              <li><button onClick={() => setActiveTab('maintenance')} className="hover:text-amber-400">Maintenance & Service</button></li>
              <li><button onClick={() => setActiveTab('reports')} className="hover:text-cyan-400">Monthly Reports Export</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400">Existing Customer Login</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-purple-400">Admin Portal</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px]">Grid Headquarters</h5>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Electricity Board HQ, Colombo 03</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> Hotline: 1987 / +94 11 234 5678</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /> support@smartsolar.ceb.lk</p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Smart Solar Energy Management System. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Tesla Energy Inspired High-Performance Architecture</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
