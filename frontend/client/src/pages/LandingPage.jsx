import React, { useState } from 'react';
import { Sun, Zap, Shield, TrendingUp, DollarSign, Award, Users, CheckCircle, ArrowRight, Star, MessageSquare, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = ({ setActiveTab }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
  };

  return (
    <div className="space-y-24 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Zap className="w-4 h-4 fill-amber-400/20" /> Next-Gen Electricity Board Monitoring
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Power Your Future with <br />
            <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Solar Energy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Monitor your electricity generation, track your savings, estimate your earnings, and explore modern solar solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              View Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-slate-900 border border-slate-800 text-slate-200 hover:border-amber-500/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Explore Packages
            </button>
          </motion.div>
        </div>
      </section>

      {/* WHY SOLAR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">Why Smart Solar Energy?</h2>
          <p className="text-slate-400 text-sm mt-2">Clean energy, zero grid bills, and guaranteed monthly revenue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card glass-card-hover p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Earn Money Net Exporting</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Export excess solar electricity back to the national grid and receive monthly tariff payouts up to Rs. 52.00/kWh.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-Time Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitor hourly power output, home consumption, battery state, and historical earnings with 9 interactive charts.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">25 Years Guarantee</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tier-1 monocrystalline panels backed by 25 years warranty and 24/7 automated diagnostic monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 border border-slate-800 bg-slate-900/80 rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Platform Capabilities</span>
              <h2 className="text-3xl font-extrabold text-white">Tesla Energy-Class Dashboard & AI Chatbot</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Experience full control over your solar ecosystem. Query your customer database using natural language and receive real-time answers with embedded dynamic charts.
              </p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Real-time power flow tracing from Sun to Grid</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Interactive Savings Calculator with ROI forecasting</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Instant PDF & Excel monthly earnings report exports</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveTab('new-customer')}
                className="px-6 py-3 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all text-sm inline-flex items-center gap-2"
              >
                Explore New Customer Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <h4 className="text-3xl font-extrabold text-amber-400">100+</h4>
                <p className="text-xs text-slate-400 mt-1">Grid Connected Homes</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <h4 className="text-3xl font-extrabold text-emerald-400">4.8 MW</h4>
                <p className="text-xs text-slate-400 mt-1">Total Clean Energy</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <h4 className="text-3xl font-extrabold text-cyan-400">3,400+ Tons</h4>
                <p className="text-xs text-slate-400 mt-1">CO₂ Emissions Avoided</p>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <h4 className="text-3xl font-extrabold text-purple-400">99.8%</h4>
                <p className="text-xs text-slate-400 mt-1">Grid Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">What Our Solar Customers Say</h2>
          <p className="text-slate-400 text-sm mt-2">Real feedback from homeowners and enterprises on the Electricity Board Smart Grid.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border border-slate-800 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Installing the 10kW Gold Ultra system completely wiped out my monthly electric bill. Now I receive Rs. 21,800 monthly grid export payout directly into my bank account."
            </p>
            <div>
              <h5 className="text-sm font-semibold text-white">Thisara Kanishka</h5>
              <p className="text-[10px] text-slate-400">Colombo 03 Customer</p>
            </div>
          </div>

          <div className="glass-card p-6 border border-slate-800 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "The AI Chatbot is incredible. I can literally ask 'How much electricity did I generate today?' and it gives me an instant chart breakdown."
            </p>
            <div>
              <h5 className="text-sm font-semibold text-white">Nimmi Ranasinghe</h5>
              <p className="text-[10px] text-slate-400">Kandy Customer</p>
            </div>
          </div>

          <div className="glass-card p-6 border border-slate-800 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Our manufacturing plant installed the 25kW Enterprise solution. Grid export returns paid back our capital investment in under 3.8 years."
            </p>
            <div>
              <h5 className="text-sm font-semibold text-white">Sunil Gunaratne</h5>
              <p className="text-[10px] text-slate-400">Gampaha Enterprise</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & QUOTATION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-10 border border-slate-800 rounded-3xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Ready to Go Solar?</h2>
          <p className="text-slate-300 text-sm">Request a free site inspection and customized solar quotation today.</p>

          {contactSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-semibold animate-in fade-in">
              ✓ Thank you! Your solar quotation request has been submitted to the Electricity Board. An engineer will contact you within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
              <input type="text" required placeholder="Full Name" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" />
              <input type="email" required placeholder="Email Address" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" />
              <input type="tel" required placeholder="Phone Number" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" />
              <input type="text" required placeholder="City / District" className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500" />
              <button type="submit" className="sm:col-span-2 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-lg transition-all text-xs">
                Request Free Solar Quotation
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
