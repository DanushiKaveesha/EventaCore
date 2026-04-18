import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './admin/AdminSidebar';
import {
  UsersIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CreditCardIcon,
  UserGroupIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { deactivateProfile } from '../services/userService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisWeek: 4, // Simulated/Placeholder as per screenshot
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/users/stats');
      setStats({
        totalUsers: data.total || 0,
        activeUsers: data.active || 0,
        newThisWeek: 4, // Keeping this as a placeholder to match design requirement
      });
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    const confirmed = window.confirm("Are you sure you want to deactivate your account? This action will disable your access immediately and log you out.");
    if (!confirmed) return;

    try {
      await deactivateProfile();
      alert("Account deactivated successfully. You will now be logged out.");
      logout();
    } catch (err) {
      console.error("Deactivation failed:", err);
      // Detailed error reporting
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to deactivate account. Please try again.";
      alert(msg);
    }
  };

  const modules = [
    {
      id: 'users',
      title: 'Users Management',
      description: 'Manage user accounts, view detailed tables, and control access permissions.',
      icon: UsersIcon,
      status: 'Active Module',
      color: 'bg-blue-50 text-blue-600',
      isActive: true,
      path: '/admin/users',
    },
    {
      id: 'events',
      title: 'Event Management',
      description: 'Oversee event operations, schedule activities, and analyze event metrics.',
      icon: CalendarIcon,
      status: 'Active Module',
      color: 'bg-indigo-50 text-indigo-600',
      isActive: true,
      path: '/admin/events',
    },
    {
      id: 'payments',
      title: 'Payment Gateway',
      description: 'Monitor financial transactions, refunds, and overall revenue streams.',
      icon: CreditCardIcon,
      status: 'Active Module',
      color: 'bg-emerald-50 text-emerald-600',
      isActive: true,
      path: '/admin/payments',
    },
    {
      id: 'clubs',
      title: 'Club Directory',
      description: 'Manage student clubs, approve societies, and coordinate group leaders.',
      icon: UserGroupIcon,
      status: 'Active Module',
      color: 'bg-violet-50 text-violet-600',
      isActive: true,
      path: '/admin/clubs',
    },
    {
      id: 'memberships',
      title: 'Memberships',
      description: 'Administer premium memberships, track renewals, and manage perks.',
      icon: IdentificationIcon,
      status: 'Active Module',
      color: 'bg-sky-50 text-sky-600',
      isActive: true,
      path: '/admin/memberships',
    },
    {
      id: 'ratings',
      title: 'Rating Management',
      description: 'Monitor user feedback, manage event ratings, and analyze sentiment trends.',
      icon: StarIcon,
      status: 'Coming Soon',
      color: 'bg-amber-50 text-amber-600',
      isActive: true,
      path: '/admin/ratings',
    },
  ];

  const filteredModules = modules.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.name || 'Administrator';

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="admin" />

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
                <ArrowTrendingUpIcon className="w-7 h-7 text-emerald-500" />
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

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    onClick={() => navigate(module.path)}
                    className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
                  >
                    <div className={`w-14 h-14 ${module.color} rounded-2xl flex items-center justify-center mb-6 shrink-0 border border-gray-100 group-hover:scale-105 transition-transform`}>
                      <module.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-black text-[#0f172a] mb-2">{module.title}</h3>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">{module.description}</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      {module.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column (Info Card area) */}
              <div className="w-full lg:w-[280px] shrink-0">
                <div className="bg-[#0f172a] p-6 rounded-[32px] text-white space-y-6 shadow-2xl relative overflow-hidden">
                  {/* Background decorative element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mt-10 -mr-10"></div>

                  <div className="relative z-10 w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <ShieldCheckIcon className="w-5 h-5 text-blue-400/80" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-black tracking-tight mb-2">System Administrator</h3>
                    <p className="text-slate-400 text-[10px] font-bold leading-relaxed opacity-60">
                      You possess high-level privileges. Please act responsibly.
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
                        <p className="text-[11px] font-black text-white truncate">{user?.email || 'minidumaheesha333@gmail.com'}</p>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-white/5">
                      <p className="text-[8px] font-bold text-[#F87171] uppercase tracking-[0.2em] mb-4">Danger Zone</p>
                      <button
                        onClick={handleDeactivate}
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
