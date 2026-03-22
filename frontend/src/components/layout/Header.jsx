import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BellIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BookmarkSquareIcon
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-1 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <img src={logoImg} alt="EventaCore Logo" className="h-9 w-9 sm:h-11 sm:w-11 object-contain rounded drop-shadow-sm group-hover:scale-105 transition-transform" />
            <span className="font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED] tracking-tight whitespace-nowrap">EventaCore</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/clubs" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
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
            <Link to="/my-events" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1 border-r border-slate-200 pr-4">
              <CalendarDaysIcon className="h-5 w-5 text-purple-600" />
              <span>My RSVPs</span>
            </Link>
            <Link to="/my-bookmarks" className="text-gray-600 hover:text-rose-500 font-medium transition flex items-center space-x-1">
              <BookmarkSquareIcon className="h-5 w-5 text-rose-500" />
              <span>Saved Clubs</span>
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
            <Link to="/events" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link to="/admin/events" className="text-[#2563EB] font-black bg-[#2563EB]/5 hover:bg-[#2563EB]/10 px-4 py-2 rounded-full transition flex items-center space-x-1 border border-blue-100/50 shadow-sm">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Admin Portal</span>
            </Link>
            {user && (
              <Link to="/my-bookings" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
                <ShoppingBagIcon className="h-5 w-5" />
                <span>My Bookings</span>
              </Link>
            )}
          </div>

          {/* Right Side Icons / Auth */}
          <div className="flex items-center">
            {/* Notifications */}
            <button className="hidden sm:block p-2 text-gray-400 hover:text-blue-600 transition-colors relative mr-4">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-bold transition-colors text-sm">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-[#2563EB]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-[#7C3AED] focus:outline-none transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white text-gray-800 shadow-xl absolute w-full left-0 border-t border-gray-100`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition">
            <div className="flex items-center space-x-3"><HomeIcon className="h-6 w-6" /><span>Home</span></div>
          </Link>

          <Link to="/clubs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition">
            <div className="flex items-center space-x-3"><UserGroupIcon className="h-6 w-6" /><span>Clubs</span></div>
          </Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition">
            <div className="flex items-center space-x-3"><CalendarIcon className="h-6 w-6" /><span>Events</span></div>
          </Link>
          <Link to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-indigo-800 hover:bg-indigo-100 transition border-l-4 border-indigo-500 bg-indigo-50 mt-2">
            <div className="flex items-center space-x-3"><ShieldCheckIcon className="h-6 w-6 text-indigo-600" /><span className="text-indigo-800 font-bold">Admin Portal</span></div>
          </Link>
          {user && (
            <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition border-l-4 border-blue-500 bg-blue-50 mt-2">
              <div className="flex items-center space-x-3"><ShoppingBagIcon className="h-6 w-6 text-blue-600" /><span className="text-blue-600 font-bold">My Bookings</span></div>
            </Link>
          )}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col space-y-3 px-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-bold rounded-2xl shadow-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;