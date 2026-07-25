import React, { useState } from 'react';
import { Package, CheckCircle2, Zap, Shield, Battery, ArrowRight, X, ExternalLink } from 'lucide-react';

const PackagesPage = ({ setActiveTab }) => {
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState('ALL');

  const packages = [
    {
      id: 1,
      name: 'Bronze Net Metering',
      scheme: 'Net Metering',
      capacity: '3.0 kW',
      price: 'Rs. 450,000',
      rate: 'Rs. 37.00/kWh',
      panels: '8x 400W Monocrystalline Panels',
      battery: 'Optional 3.5 kWh Upgrade',
      warranty: '10 Years Full Warranty',
      monthlyGen: '380 - 420 kWh',
      bestFor: 'Small 2-3 Bedroom Homes',
      compensation: 'Energy Credits (10-Yr Carry)',
      popular: false
    },
    {
      id: 2,
      name: 'Silver Net Accounting',
      scheme: 'Net Accounting',
      capacity: '5.0 kW',
      price: 'Rs. 720,000',
      rate: 'Rs. 42.00/kWh',
      panels: '12x 420W High-Efficiency Panels',
      battery: '5.0 kWh Lithium Battery Included',
      warranty: '12 Years Full Warranty',
      monthlyGen: '620 - 680 kWh',
      bestFor: 'Medium 3-4 Bedroom Family Homes',
      compensation: 'Monetary Credit (Monthly Payout)',
      popular: true
    },
    {
      id: 3,
      name: 'Gold Net Accounting',
      scheme: 'Net Accounting',
      capacity: '10.0 kW',
      price: 'Rs. 1,350,000',
      rate: 'Rs. 48.00/kWh',
      panels: '24x 440W N-Type TopCon Panels',
      battery: '10.0 kWh Tesla Powerwall Storage',
      warranty: '15 Years Full Warranty',
      monthlyGen: '1,250 - 1,400 kWh',
      bestFor: 'Large Luxury Residences & Villas',
      compensation: 'Monetary Credit (CEB/LECO Rate)',
      popular: false
    },
    {
      id: 4,
      name: 'Enterprise Net Plus',
      scheme: 'Net Plus',
      capacity: '25.0 kW',
      price: 'Rs. 3,100,000',
      rate: 'Rs. 52.00/kWh',
      panels: '56x 450W Commercial Grade Panels',
      battery: '25.0 kWh Industrial Battery Bank',
      warranty: '25 Years Performance Guarantee',
      monthlyGen: '3,100 - 3,500 kWh',
      bestFor: 'Factories, Supermarkets & Investors',
      compensation: 'Monetary Payment (100% Export)',
      popular: false
    }
  ];

  const filteredPackages = selectedSchemeFilter === 'ALL'
    ? packages
    : packages.filter(p => p.scheme === selectedSchemeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-widest">
          CEB & LECO Approved Packages
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Smart Solar Packages
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Choose from Net Metering, Net Accounting, or Net Plus packages with Tier-1 components and guaranteed grid export tariffs.
        </p>

        {/* Scheme Filter Pills */}
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          {['ALL', 'Net Metering', 'Net Accounting', 'Net Plus'].map((sc) => (
            <button
              key={sc}
              onClick={() => setSelectedSchemeFilter(sc)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedSchemeFilter === sc
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {sc === 'ALL' ? 'All Packages' : sc}
            </button>
          ))}
          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-4 py-2 rounded-xl font-bold bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500 text-xs transition-all flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" /> Compare Matrix
          </button>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`glass-card p-6 border rounded-3xl flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-2 ${
              pkg.popular
                ? 'border-emerald-500/80 bg-slate-900/90 shadow-2xl shadow-emerald-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                  {pkg.scheme}
                </span>
                <h3 className="text-xl font-extrabold text-white">{pkg.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-amber-400">{pkg.price}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-semibold">Compensation Type</span>
                <span className="text-xs font-bold text-emerald-400">{pkg.compensation}</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>{pkg.capacity}</strong> System Capacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{pkg.panels}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{pkg.battery}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{pkg.warranty}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Monthly Output: <strong>{pkg.monthlyGen}</strong></span>
                </li>
              </ul>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('calculator')}
                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg transition-all text-xs flex items-center justify-center gap-1.5"
              >
                Select Package <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHOOSING THE RIGHT SCHEME TABLE SECTION (NEWLY ADDED EXACT TABLE) */}
      <div className="glass-card p-8 border border-slate-800 rounded-3xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20" /> Choosing the Right Scheme
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Each scheme offers unique benefits based on your energy usage and investment goals:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300 uppercase tracking-wider text-[11px]">
                <th className="p-4 border border-slate-800 font-bold">Scheme</th>
                <th className="p-4 border border-slate-800 font-bold">Self-Use</th>
                <th className="p-4 border border-slate-800 font-bold">Export to Grid</th>
                <th className="p-4 border border-slate-800 font-bold">Payment Type</th>
                <th className="p-4 border border-slate-800 font-bold">Ideal For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              <tr className="hover:bg-slate-900/60 transition-all">
                <td className="p-4 border border-slate-800 font-bold text-amber-400">Net Metering</td>
                <td className="p-4 border border-slate-800 font-semibold text-emerald-400">Yes</td>
                <td className="p-4 border border-slate-800 font-semibold text-emerald-400">Yes</td>
                <td className="p-4 border border-slate-800">Energy Credits</td>
                <td className="p-4 border border-slate-800">Homes/businesses seeking bill reduction</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-all">
                <td className="p-4 border border-slate-800 font-bold text-emerald-400">Net Accounting</td>
                <td className="p-4 border border-slate-800 font-semibold text-emerald-400">Yes</td>
                <td className="p-4 border border-slate-800 font-semibold text-emerald-400">Yes</td>
                <td className="p-4 border border-slate-800">Monetary Credit</td>
                <td className="p-4 border border-slate-800">Those who prefer financial return</td>
              </tr>
              <tr className="hover:bg-slate-900/60 transition-all">
                <td className="p-4 border border-slate-800 font-bold text-cyan-400">Net Plus</td>
                <td className="p-4 border border-slate-800 font-semibold text-red-400">No</td>
                <td className="p-4 border border-slate-800 font-semibold text-emerald-400">Yes</td>
                <td className="p-4 border border-slate-800">Monetary Payment</td>
                <td className="p-4 border border-slate-800">Investors & commercial producers</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Resources Links */}
      <div className="glass-card p-6 border border-slate-800 rounded-3xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <h4 className="text-sm font-bold text-white">Official Utility Resources</h4>
          <p className="text-slate-400">For tariff tables and regulatory grid guidelines visit CEB and LECO</p>
        </div>
        <div className="flex gap-3">
          <a href="https://www.ceb.lk" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500 flex items-center gap-1.5">
            CEB (www.ceb.lk) <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a href="https://www.leco.lk" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:border-emerald-500 flex items-center gap-1.5">
            LECO (www.leco.lk) <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Compare Packages Side-by-Side Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-x-auto max-h-[90vh]">
            <button
              onClick={() => setCompareModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">CEB / LECO Solar Schemes & Package Comparison Matrix</h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-3">Specification</th>
                  <th className="p-3 text-amber-400 font-bold">Bronze (3kW)</th>
                  <th className="p-3 text-emerald-400 font-bold">Silver (5kW)</th>
                  <th className="p-3 text-cyan-400 font-bold">Gold (10kW)</th>
                  <th className="p-3 text-purple-400 font-bold">Enterprise (25kW)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Interconnection Scheme</td>
                  <td className="p-3 font-bold text-amber-400">Net Metering</td>
                  <td className="p-3 font-bold text-emerald-400">Net Accounting</td>
                  <td className="p-3 font-bold text-cyan-400">Net Accounting</td>
                  <td className="p-3 font-bold text-purple-400">Net Plus</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Compensation Method</td>
                  <td className="p-3">Energy Credits (10-Yr Carry)</td>
                  <td className="p-3">Monetary Credit (CEB/LECO)</td>
                  <td className="p-3">Monetary Credit (CEB/LECO)</td>
                  <td className="p-3">100% Cash Export Payment</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Self-Use Allowed?</td>
                  <td className="p-3 font-semibold text-emerald-400">Yes</td>
                  <td className="p-3 font-semibold text-emerald-400">Yes</td>
                  <td className="p-3 font-semibold text-emerald-400">Yes</td>
                  <td className="p-3 font-semibold text-red-400">No (100% Grid Export)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">System Price</td>
                  <td className="p-3">Rs. 450,000</td>
                  <td className="p-3">Rs. 720,000</td>
                  <td className="p-3">Rs. 1,350,000</td>
                  <td className="p-3">Rs. 3,100,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Feed-in Export Rate</td>
                  <td className="p-3">Rs. 37.00/kWh</td>
                  <td className="p-3">Rs. 42.00/kWh</td>
                  <td className="p-3 font-bold text-emerald-400">Rs. 48.00/kWh</td>
                  <td className="p-3 font-bold text-purple-400">Rs. 52.00/kWh</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Panel Spec</td>
                  <td className="p-3">8x 400W Monocrystalline</td>
                  <td className="p-3">12x 420W Panels</td>
                  <td className="p-3">24x 440W N-Type</td>
                  <td className="p-3">56x 450W Commercial</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Battery System</td>
                  <td className="p-3">Optional 3.5 kWh</td>
                  <td className="p-3">5.0 kWh Lithium</td>
                  <td className="p-3">10.0 kWh Tesla Powerwall</td>
                  <td className="p-3">25.0 kWh Storage</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Warranty</td>
                  <td className="p-3">10 Years</td>
                  <td className="p-3">12 Years</td>
                  <td className="p-3">15 Years</td>
                  <td className="p-3">25 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default PackagesPage;
