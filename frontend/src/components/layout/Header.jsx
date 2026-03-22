import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BellIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { getNotifications, markAsRead } from '../../services/notificationService';

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Determine userId based on context or a mockup identifier
    const userId = location.pathname.includes('/admin') ? 'admin' : 'ST12345';
    fetchNotifications(userId);
    
    // Refresh every 30s
    const interval = setInterval(() => fetchNotifications(userId), 30000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  const fetchNotifications = async (userId) => {
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <div className="bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] p-2 rounded-xl mr-3 shadow-lg group-hover:rotate-6 transition-transform">
              <span className="text-white text-xl font-bold">E</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tighter">
              EventaCore
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/clubs" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <UserGroupIcon className="h-5 w-5" />
              <span>Explore Clubs</span>
            </Link>
            <Link to="/admin/clubs" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <UserCircleIcon className="h-5 w-5" />
              <span>Manage Clubs</span>
            </Link>
            <Link to="/admin/requests" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1 border-r border-slate-200 pr-4">
              <ClipboardDocumentListIcon className="h-5 w-5" />
              <span>Applications</span>
            </Link>
            <Link to="/admin/payments" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1 border-r border-slate-200 pr-4">
              <CurrencyDollarIcon className="h-5 w-5 text-emerald-600" />
              <span>Payments</span>
            </Link>
            <Link to="/admin/event-requests" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
              <span>Event RSVPs</span>
            </Link>
            <Link to="/my-requests" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1 pl-4 border-l border-slate-200">
              <ClipboardDocumentListIcon className="h-5 w-5" />
              <span>My Applications</span>
            </Link>
            <Link to="/my-events" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
              <span>My RSVPs</span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-500 hover:text-[#7C3AED] transition p-2 hover:bg-slate-50 rounded-full"
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Notifications</h3>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center bg-white">
                        <BellIcon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium text-sm italic">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n._id} 
                          onClick={() => handleMarkRead(n._id)}
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                        >
                          {!n.isRead && <div className="absolute left-2 top-1/3 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
                          <p className={`text-xs ${!n.isRead ? 'font-black text-slate-800' : 'font-medium text-slate-500'}`}>
                            {n.message}
                          </p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 text-center bg-slate-50/50">
                    <button className="text-[10px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 sm:pl-4 sm:border-l border-gray-100">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-gray-900 leading-tight">John Doe</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-gray-100 to-gray-50 border border-gray-200 flex items-center justify-center shadow-inner">
                <UserCircleIcon className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;