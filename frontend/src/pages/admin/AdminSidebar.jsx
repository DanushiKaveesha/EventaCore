import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';
import {
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  PlusIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  IdentificationIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ activeOverride }) => {
  const location = useLocation();
  const activeTab = activeOverride || location.pathname.split('/').pop() || 'events';

  return (
    <div className="w-full lg:w-[320px] bg-[#0f172a] text-white shadow-2xl z-20 lg:sticky lg:top-0 lg:h-screen flex flex-col flex-shrink-0">

      {/* Sidebar Header with Logo */}
      <div className="p-4 lg:p-6 flex items-center justify-between lg:block border-b lg:border-b-0 border-white/5">
        <div className="flex flex-row items-center gap-4 lg:mb-4">
          {/* Real Official Logo */}
          <img src={logoImg} alt="EventaCore Logo" className="w-12 h-12 object-cover object-top rounded-xl bg-white shadow-lg border border-white/10" />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-tight">EventaCore</h2>
            <p className="text-slate-400 text-sm font-medium">Control Center</p>
          </div>
        </div>
        {/* Mobile Actions */}
        <div className="lg:hidden flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all" title="Back to Home">
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          {activeTab === 'events' && (
            <Link to="/create-event" className="flex items-center justify-center p-2 rounded-lg bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:bg-sky-400 transition-all">
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 px-4 lg:px-5 py-2 lg:py-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-2 no-scrollbar border-b border-white/5 lg:border-none">
        <Link
          to="/admin/events"
          className={`whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'events' ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
        >
          <CalendarIcon className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'events' ? 'text-white' : 'text-slate-500'}`} /> Event Management
        </Link>
        <Link
          to="/admin/payments"
          className={`whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'payments' ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
        >
          <CreditCardIcon className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'payments' ? 'text-white' : 'text-slate-500'}`} /> Payment Management
        </Link>
        <Link
          to="/admin/clubs"
          className={`whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'clubs' ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
        >
          <UserGroupIcon className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'clubs' ? 'text-white' : 'text-slate-500'}`} /> Club Management
        </Link>
        <Link 
          to="/admin/event-requests" 
          className={`whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'event-requests' ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
        >
          <CalendarDaysIcon className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'event-requests' ? 'text-white' : 'text-slate-500'}`} /> Club Event Management
        </Link>

        <Link
          to="/admin/memberships"
          className={`whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'memberships' ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
        >
          <IdentificationIcon className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'memberships' ? 'text-white' : 'text-slate-500'}`} /> Membership Management
        </Link>

        <Link
          to="/admin/users"
          className={`whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'users' ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
        >
          <UsersIcon className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'users' ? 'text-white' : 'text-slate-500'}`} /> Users Management
        </Link>
      </nav>

      {/* Desktop Bottom Actions */}
      <div className="p-6 mt-auto hidden lg:flex flex-col gap-3 border-t border-white/5">
        <Link to="/" className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border border-transparent">
          <ArrowLeftIcon className="w-5 h-5 mr-3 opacity-70" aria-hidden="true" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
