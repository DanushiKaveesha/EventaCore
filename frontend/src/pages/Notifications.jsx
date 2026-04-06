import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, BellAlertIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';

const Notifications = () => {
  const user = getCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <BellAlertIcon className="w-8 h-8 text-indigo-500" />
              Your Notifications
            </h1>
            <p className="mt-2 text-slate-600">
              Manage all your recent alerts and system messages here.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <BellAlertIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">All caught up!</h3>
              <p className="text-slate-500">You have no new notifications right now.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const isAdmin = notif.type === 'admin';
                return (
                <li 
                  key={notif._id} 
                  className={`p-6 sm:p-8 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative overflow-hidden ${
                    isAdmin 
                      ? 'bg-indigo-50/50 hover:bg-indigo-50 border-l-4 border-indigo-500' 
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  {isAdmin && (
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <ShieldCheckIcon className="w-3 h-3" />
                      Admin Message
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={`font-medium text-lg mb-1 leading-snug ${isAdmin ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {notif.message}
                    </p>
                    <span className={`text-sm font-medium block ${isAdmin ? 'text-indigo-600' : 'text-indigo-500'}`}>
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </span>
                    {notif.actionLink && notif.actionText && (
                      <Link 
                        to={notif.actionLink} 
                        className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {notif.actionText}
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="self-start sm:self-auto p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 group-hover:opacity-100 sm:opacity-0 focus:opacity-100"
                    title="Delete Notification"
                  >
                    <TrashIcon className="w-5 h-5" />
                    <span className="text-sm font-medium sm:hidden block">Delete</span>
                  </button>
                </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
