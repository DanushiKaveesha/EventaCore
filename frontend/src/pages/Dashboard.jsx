import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  UserCircleIcon,
  HomeIcon,
  ShieldCheckIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';

// Main user dashboard rendering fast-action cards depending on permissions
const Dashboard = () => {
  const user = getCurrentUser();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
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

  const profileImage =
    user?.profileImageURL && user.profileImageURL.startsWith('/uploads')
      ? `http://localhost:5000${user.profileImageURL}`
      : user?.profileImageURL || '';

  const quickLinks = [
    {
      name: 'Calendar',
      description: 'View schedules and upcoming events.',
      icon: CalendarIcon,
      href: '/calendar',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      ringColor: 'ring-emerald-500/20'
    },
    {
      name: 'Notifications',
      description: 'Check your recent alerts and messages.',
      icon: BellIcon,
      href: '/notifications',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      ringColor: 'ring-amber-500/20'
    },
    {
      name: 'Settings',
      description: 'Manage preferences and security.',
      icon: Cog6ToothIcon,
      href: '/settings',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
      ringColor: 'ring-slate-500/20'
    }
  ];

  if (user?.role === 'admin') {
    quickLinks.push({
      name: 'Admin Portal',
      description: 'Manage platform modules.',
      icon: ShieldCheckIcon,
      href: '/admin/users',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      ringColor: 'ring-red-500/20'
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="EventraCore Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-2xl text-slate-900 tracking-tight hidden sm:block">EventraCore</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition relative"
              >
                <BellIcon className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute top-12 right-2 sm:right-12 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 py-0.5 px-2 rounded-full">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition relative group">
                          <p className="text-sm text-slate-700 pr-6">{notif.message}</p>
                          <span className="text-xs text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => deleteNotification(notif._id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
                            title="Delete"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <Link to="/settings" className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition">
                <Cog6ToothIcon className="w-6 h-6" />
              </Link>
              <div className="h-8 w-px bg-slate-200 mx-1 sm:mx-2 hidden sm:block"></div>
              <Link to="/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <span className="text-sm font-medium text-slate-700 pl-2 hidden sm:block">{user?.firstName || user?.name || 'User'}</span>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-5 h-5" />
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Welcome Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">
              Welcome back, {user?.firstName || 'User'}
            </h1>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl">
              Here's what's happening with your EventraCore account today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
              <HomeIcon className="w-5 h-5 mr-2" />
              Home Page
            </Link>
            <Link to="/profile" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              View Profile
            </Link>
          </div>
        </div>

        {/* Dashboard Grid */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="group relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${link.bgColor} ${link.textColor} ring-1 inset-0 ${link.ringColor}`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <div className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                  <ArrowRightIcon className="w-5 h-5 -rotate-45" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {link.name}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed flex-grow">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;