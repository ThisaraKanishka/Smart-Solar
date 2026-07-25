import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';
import api from '../utils/api';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await api.get('/customer/notifications');
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error('Fetch notifications error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/customer/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n.notification_id === id ? { ...n, status: 'read' } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (title) => {
    if (title.includes('Payment')) return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (title.includes('Warning') || title.includes('Weather')) return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    if (title.includes('Maintenance')) return <ShieldAlert className="w-5 h-5 text-purple-400" />;
    return <Info className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-semibold text-white">Notifications Center</h4>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto mt-2 space-y-2">
        {loading ? (
          <p className="text-xs text-slate-400 text-center py-4">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No notifications found.</p>
        ) : (
          notifications.map(n => (
            <div
              key={n.notification_id}
              onClick={() => markAsRead(n.notification_id)}
              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                n.status === 'unread'
                  ? 'bg-slate-800/80 border-amber-500/30'
                  : 'bg-slate-900/40 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">{getIcon(n.title)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-slate-200">{n.title}</h5>
                    {n.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <p className="text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
