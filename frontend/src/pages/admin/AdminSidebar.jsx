import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import {
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  Squares2X2Icon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = ({ activeOverride }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const activeTab = activeOverride || location.pathname.split('/').pop() || 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminName =
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.username ||
    user?.name ||
    'Administrator';

  const profileImage =
    user?.profileImageURL && user.profileImageURL.startsWith('/uploads')
      ? `http://localhost:5000${user.profileImageURL}`
      : user?.profileImageURL || '';

  const getNavClass = (tabName) =>
    `whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tabName
      ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
    }`;

  const getIconClass = (tabName) =>
    `w-5 h-5 mr-4 transition-colors ${activeTab === tabName ? 'text-white' : 'text-slate-500'}`;

  return (
    <div className="w-full lg:w-[320px] bg-[#0f172a] text-white shadow-2xl z-20 lg:sticky lg:top-0 lg:h-screen flex flex-col flex-shrink-0">

      {/* Sidebar Header with Logo & Admin Profile */}
      <div className="p-4 lg:p-6 flex items-center justify-between lg:block border-b border-white/5">
        <div className="flex flex-row items-center gap-4 lg:mb-4">
          <img src={logoImg} alt="EventaCore Logo" className="w-12 h-12 object-cover object-top rounded-xl bg-white shadow-lg border border-white/10" />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-tight">EventaCore</h2>
            <p className="text-slate-400 text-sm font-medium">Control Center</p>
          </div>
        </div>

        {/* Admin profile card — desktop only */}
        <div className="hidden lg:block rounded-2xl bg-white/5 border border-white/10 p-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
              {profileImage ? (
                <img src={profileImage} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="h-7 w-7 text-slate-300" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold truncate text-sm">{adminName}</p>
              <p className="text-slate-400 text-xs truncate">{user?.email || 'admin@eventracore.com'}</p>
              <div className="mt-1 inline-flex items-center rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-300">
                Administrator
              </div>
            </div>
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
        <Link to="/admin" className={getNavClass('admin')}>
          <Squares2X2Icon className={getIconClass('admin')} /> Dashboard
        </Link>
        <Link to="/admin/events" className={getNavClass('events')}>
          <CalendarIcon className={getIconClass('events')} /> Event Management
        </Link>
        <Link to="/admin/payments" className={getNavClass('payments')}>
          <CreditCardIcon className={getIconClass('payments')} /> Payment Management
        </Link>
        <Link to="/admin/clubs" className={getNavClass('clubs')}>
          <UserGroupIcon className={getIconClass('clubs')} /> Club Management
        </Link>
        <Link to="/admin/event-requests" className={getNavClass('event-requests')}>
          <CalendarDaysIcon className={getIconClass('event-requests')} /> Club Event Management
        </Link>
        <Link to="/admin/users" className={getNavClass('users')}>
          <UsersIcon className={getIconClass('users')} /> Users Management
        </Link>
        <div className="group relative">
          <Link to="/admin/ratings" className={getNavClass('ratings')}>
            <StarIcon className={getIconClass('ratings')} /> Rating Management
            <span className="absolute right-2 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform bg-amber-500 text-[8px] font-black leading-none px-1.5 py-1 rounded text-white uppercase tracking-tighter">Soon</span>
          </Link>
        </div>
      </nav>

      {/* Desktop Bottom Actions */}
      <div className="p-6 mt-auto hidden lg:flex flex-col gap-3 border-t border-white/5">
        <Link to="/" className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border border-transparent">
          <ArrowLeftIcon className="w-5 h-5 mr-3 opacity-70" aria-hidden="true" />
          Back to Home
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:text-white hover:bg-red-600/20 transition-all duration-200 border border-transparent"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 opacity-80" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
