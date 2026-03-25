import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  UserCircleIcon,
  HomeIcon,
  ShieldCheckIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';

// Main user dashboard rendering fast-action cards depending on permissions
const Dashboard = () => {
  const user = getCurrentUser();

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