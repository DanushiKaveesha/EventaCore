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
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="overview" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column (Content area) */}
        <div className="flex-1 p-6 lg:p-10 space-y-10 overflow-y-auto no-scrollbar">
          
          {/* Header Section */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-white rounded-full text-[10px] font-black text-blue-600 shadow-sm border border-gray-100 uppercase tracking-widest">
              Dashboard Overview
            </span>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight">
                  Welcome back, {adminName}
                </h1>
                <p className="text-gray-400 text-sm font-medium mt-2 max-w-2xl">
                  Take a glance at your platform's operational metrics and access your management modules.
                </p>
              </div>
              <button
                onClick={() => navigate('/edit-account')}
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-[#0f172a] shadow-sm hover:bg-gray-50 transition-all"
              >
                <PencilSquareIcon className="w-4 h-4 text-gray-400" />
                Settings
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Users */}
            <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Users</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-[#0f172a]">{stats.totalUsers}</h3>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                  Stable growth
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                <UsersIcon className="w-7 h-7 text-blue-500" />
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Active Users</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-[#0f172a]">{stats.activeUsers}</h3>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-blue-500">
                  <ChartBarIcon className="w-3.5 h-3.5" />
                  Platform-wide engagement
                </div>
              </div>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0 border border-purple-100 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="w-7 h-7 text-purple-500" />
              </div>
            </div>

            {/* New This Week */}
            <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">New This Week</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-[#0f172a]">+{stats.newThisWeek}</h3>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
                  Rising steadily
                </div>
              </div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
                <UserPlusIcon className="w-7 h-7 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Platform Modules Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#0f172a] tracking-tight">Platform Modules</h2>
                <p className="text-gray-400 text-xs font-medium">Select an administrative area to manage</p>
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
                      className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer flex flex-col h-full"
                    >
                      <div className={`w-14 h-14 ${card.lightBg} ${card.textColor} rounded-2xl flex items-center justify-center mb-6 shrink-0 border border-gray-100 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-black text-[#0f172a] mb-2">{card.title}</h3>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6 flex-grow">{card.description}</p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 w-max mt-auto">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        ACTIVE MODULE
                      </div>
                    </Link>
                  );
                }

                return (
                  <div
                    key={card.title}
                    className="relative bg-white/60 p-8 rounded-[32px] border border-dashed border-gray-200 shadow-sm opacity-80 flex flex-col h-full"
                  >
                    <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-6 shrink-0 border border-gray-100">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black text-gray-500 mb-2">{card.title}</h3>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6 flex-grow">{card.description}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200 w-max mt-auto">
                      IN DEVELOPMENT
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (Info Card area) */}
        <div className="w-full lg:w-[280px] p-6 lg:p-8 lg:border-l border-gray-100 bg-white/50 backdrop-blur-sm">
          <div className="bg-[#0f172a] p-6 rounded-[32px] text-white space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mt-10 -mr-10"></div>

            <div className="relative z-10 w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
              <ShieldCheckIcon className="w-5 h-5 text-blue-400/80" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-2">System Administrator</h3>
              <p className="text-slate-400 text-[10px] font-bold leading-relaxed opacity-60">
                You possess high-level privileges. Please act responsibly when modifying records or configuration data.
              </p>
            </div>

            <div className="relative z-10 space-y-3.5">
              <div className="space-y-2">
                <div className="px-4 py-3 bg-[#1e293b]/40 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Authenticated As</p>
                  <p className="text-xs font-black text-white">Admin</p>
                </div>
                <div className="px-4 py-3 bg-[#1e293b]/40 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-[11px] font-black text-white truncate">{user?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-white/5">
                <p className="text-[8px] font-bold text-[#F87171] uppercase tracking-[0.2em] mb-4">Danger Zone</p>
                <button
                  onClick={handleDeactivateAccount}
                  className="w-full py-3.5 bg-[#451225]/15 hover:bg-[#451225]/30 text-[#F87171] rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-2.5 border border-[#F87171]/15 group"
                >
                  <ExclamationTriangleIcon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;