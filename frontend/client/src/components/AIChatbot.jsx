import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, BarChart2, TrendingUp, Minimize2, Maximize2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AIChatbot = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your **Smart Solar AI Assistant**. Ask me anything about your solar generation, grid export earnings, maintenance, or CO₂ savings!',
      stats: [],
      chartConfig: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      if (!isAuthenticated) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: 'Please log in to your Customer Account to query your personal solar database!',
            stats: []
          }
        ]);
        setLoading(false);
        return;
      }

      const res = await api.post('/chat/query', { question: textToSend });
      const { reply, stats, chartConfig } = res.data;

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          stats: stats || [],
          chartConfig: chartConfig || null
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I encountered an error querying the database. Please try again.',
          stats: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderInlineChart = (chartConfig) => {
    if (!chartConfig || !chartConfig.data || chartConfig.data.length === 0) return null;

    const { chartType, data, xKey, dataKeys, title } = chartConfig;

    return (
      <div className="mt-3 p-3 bg-slate-950/90 border border-slate-800 rounded-2xl">
        <h5 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5" />
          {title}
        </h5>
        <div className="h-44 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={xKey} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                {dataKeys.map((dk, idx) => (
                  <Line key={idx} type="monotone" dataKey={dk.key} name={dk.name} stroke={dk.color} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            ) : chartType === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={xKey} stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                {dataKeys.map((dk, idx) => (
                  <Bar key={idx} dataKey={dk.key} name={dk.name} fill={dk.color} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            ) : null}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const samplePrompts = [
    "How much electricity did I generate today?",
    "Show my electricity generation for the last seven days",
    "How much money will I receive this month?",
    "When is my next maintenance?",
    "How much CO2 have I saved?"
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 text-slate-950 shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-bold shadow-amber-500/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
          </div>
          <span className="hidden sm:inline text-xs tracking-wide uppercase">AI Solar Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg h-[580px] bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Smart Solar AI Assistant
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40">DB Connected</span>
                </h4>
                <p className="text-[10px] text-slate-400">Live data query & dynamic chart engine</p>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Chip Prompts */}
          <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sp)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
              >
                {sp}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-medium'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Key Stat Chips if present */}
                  {msg.stats && msg.stats.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
                      {msg.stats.map((s, idx) => (
                        <div key={idx} className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-left">
                          <span className="text-[10px] text-slate-400 block">{s.label}</span>
                          <span className="text-xs font-bold text-amber-400">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Inline Dynamic Chart if present */}
                  {msg.chartConfig && renderInlineChart(msg.chartConfig)}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-amber-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Querying solar database & generating charts...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI about generation, payments, CO2..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold hover:brightness-110 disabled:opacity-50 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default AIChatbot;
