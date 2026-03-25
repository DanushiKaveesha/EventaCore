import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon,
  UserGroupIcon,
  IdentificationIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { getCurrentUser } from '../../utils/getCurrentUser';
import AdminSidebar from './AdminSidebar';

const AdminOverview = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisWeek: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const { data } = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });

        if (Array.isArray(data)) {
          const total = data.length;
          const active = data.filter(
            (u) => u.status === 'active' || !u.status
          ).length;

          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const newUsers = data.filter(
            (u) => new Date(u.createdAt) > oneWeekAgo
          ).length;

          setStats({ totalUsers: total, activeUsers: active, newThisWeek: newUsers });
        }
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your admin account permanently? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.delete('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      localStorage.removeItem('userInfo');
      navigate('/');
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to deactivate your account. Please try again.'
      );
    }
  };

  const adminName =
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.username ||
    'Admin';

  const cards = [
    {
      title: 'Users Management',
      description:
        'Manage user accounts, view detailed tables, and control access permissions.',
      icon: UsersIcon,
      to: '/admin/users',
      active: true,
      gradient: 'from-blue-500 to-indigo-600',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Event Management',
      description:
        'Oversee event operations, schedule activities, and analyze event metrics.',
      icon: CalendarIcon,
      to: '/admin/events',
      active: false,
      gradient: 'from-emerald-400 to-teal-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Payment Gateway',
      description:
        'Monitor financial transactions, refunds, and overall revenue streams.',
      icon: CreditCardIcon,
      to: '/admin/payments',
      active: false,
      gradient: 'from-amber-400 to-orange-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Club Directory',
      description:
        'Manage student clubs, approve societies, and coordinate group leaders.',
      icon: UserGroupIcon,
      to: '/admin/clubs',
      active: false,
      gradient: 'from-fuchsia-500 to-pink-600',
      lightBg: 'bg-fuchsia-50',
      textColor: 'text-fuchsia-600',
    },
    {
      title: 'Memberships',
      description:
        'Administer premium memberships, track renewals, and manage perks.',
      icon: IdentificationIcon,
      to: '/admin/memberships',
      active: false,
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50',
      textColor: 'text-violet-600',
    },
  ];

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans flex flex-col xl:flex-row w-full selection:bg-indigo-500 selection:text-white">
      <AdminSidebar activeOverride="overview" />

      <div className="flex-1 w-full xl:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 xl:p-12 relative">
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 mb-10 xl:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center rounded-full bg-white shadow-sm border border-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4">
                Dashboard Overview
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, {adminName}
              </h1>
              <p className="text-gray-500 font-medium mt-3 text-lg max-w-2xl leading-relaxed">
                Take a glance at your platform's operational metrics and access your management modules.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/edit-account" className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-bold text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md transition">
                <PencilSquareIcon className="w-5 h-5 text-indigo-600" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-900/5 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Users</h3>
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <UsersIcon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" /> Stable growth
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-900/5 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">Active Users</h3>
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-900">{stats.activeUsers}</p>
            <p className="text-sm font-medium text-gray-400 mt-2 flex items-center gap-1">
              Platform-wide engagement
            </p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-900/5 border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm">New This Week</h3>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <UserPlusIcon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-900">+{stats.newThisWeek}</p>
            <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowTrendingUpIcon className="w-4 h-4" /> Rising steadily
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Platform Modules</h2>
                <p className="text-gray-500 font-medium mt-1">Select an administrative area to manage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card) => {
                const Icon = card.icon;

                if (card.active) {
                  return (
                    <Link
                      key={card.title}
                      to={card.to}
                      className="group relative bg-white rounded-[2rem] p-8 shadow-xl shadow-indigo-900/5 border border-white hover:shadow-2xl hover:shadow-indigo-900/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-0 translate-x-4 -translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out">
                         <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} blur-2xl opacity-20`}></div>
                      </div>

                      <div className={`h-16 w-16 shadow-sm rounded-2xl flex items-center justify-center mb-6 relative z-10 ${card.lightBg} ${card.textColor}`}>
                        <Icon className="h-8 w-8" />
                      </div>

                      <h3 className="text-xl font-extrabold text-gray-900 mb-2 relative z-10">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 flex-grow relative z-10">
                        {card.description}
                      </p>

                      <div className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 w-max relative z-10 shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                        Active Module
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={card.title}
                    className="relative bg-white/60 rounded-[2rem] p-8 border border-dashed border-gray-200 opacity-80 flex flex-col h-full"
                  >
                    <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-400">
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-500 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6 flex-grow">
                      {card.description}
                    </p>

                    <div className="inline-flex items-center rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 w-max shadow-inner">
                      In Development
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-8 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 blur-[80px] rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/4"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/20 shadow-inner">
                  <ShieldCheckIcon className="h-8 w-8 text-indigo-300" />
                </div>
                
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  System Administrator
                </h2>
                <p className="text-indigo-200 font-medium text-sm leading-relaxed mb-8">
                  You possess high-level privileges. Please act responsibly when modifying records or configuration data.
                </p>

                <div className="space-y-4 mb-10">
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-sm">
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Authenticated As</p>
                    <p className="text-white font-semibold flex items-center gap-2">
                      {user?.username || 'admin'}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-sm">
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-white font-semibold truncate">
                      {user?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4">Danger Zone</p>
                  <button
                    onClick={handleDeactivateAccount}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 px-4 py-3 font-bold transition-colors"
                  >
                    <ExclamationTriangleIcon className="h-5 w-5" />
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;