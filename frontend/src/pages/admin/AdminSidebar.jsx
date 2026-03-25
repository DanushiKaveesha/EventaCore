import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';
import { getCurrentUser } from '../../utils/getCurrentUser';
import {
  Squares2X2Icon,
  CalendarIcon,
  CreditCardIcon,
  UsersIcon,
  ArrowLeftIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  IdentificationIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ activeOverride }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const activeTab =
    activeOverride || location.pathname.split('/').pop() || 'overview';

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const adminName =
    `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() ||
    currentUser?.username ||
    'Administrator';

  const profileImage =
    currentUser?.profileImageURL &&
    currentUser.profileImageURL.startsWith('/uploads')
      ? `http://localhost:5000${currentUser.profileImageURL}`
      : currentUser?.profileImageURL || '';

  const getNavClass = (tabName) =>
    `whitespace-nowrap lg:w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
      activeTab === tabName
        ? 'bg-sky-500 text-white shadow-[0_8px_16px_-4px_rgba(14,165,233,0.4)]'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
    }`;

  const getIconClass = (tabName) =>
    `w-5 h-5 mr-4 transition-colors ${
      activeTab === tabName ? 'text-white' : 'text-slate-500'
    }`;

  return (
    <div className="w-full lg:w-[320px] bg-[#0f172a] text-white shadow-2xl z-20 lg:sticky lg:top-0 lg:h-screen flex flex-col flex-shrink-0">
      <div className="p-4 lg:p-6 border-b border-white/5">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={logoImg}
            alt="EventraCore Logo"
            className="w-12 h-12 object-cover object-top rounded-xl bg-white shadow-lg border border-white/10"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
              EventraCore
            </h2>
            <p className="text-slate-400 text-sm font-medium">Control Center</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center border border-white/10">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-slate-300" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-white font-bold truncate">{adminName}</p>
              <p className="text-slate-400 text-sm truncate">
                {currentUser?.email || 'admin@eventracore.com'}
              </p>
              <div className="mt-1 inline-flex items-center rounded-full bg-sky-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-300">
                Administrator
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-end gap-3 mt-4">
          <Link
            to="/"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Back to Home"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <nav className="flex-1 px-4 lg:px-5 py-2 lg:py-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto gap-2 no-scrollbar border-b border-white/5 lg:border-none">
        <Link to="/admin" className={getNavClass('overview')}>
          <Squares2X2Icon className={getIconClass('overview')} />
          Dashboard Overview
        </Link>

        <Link to="/admin/events" className={getNavClass('events')}>
          <CalendarIcon className={getIconClass('events')} />
          Event Management
        </Link>

        <Link to="/admin/payments" className={getNavClass('payments')}>
          <CreditCardIcon className={getIconClass('payments')} />
          Payment Management
        </Link>

        <Link to="/admin/clubs" className={getNavClass('clubs')}>
          <UserGroupIcon className={getIconClass('clubs')} />
          Club Management
        </Link>

        <Link to="/admin/memberships" className={getNavClass('memberships')}>
          <IdentificationIcon className={getIconClass('memberships')} />
          Membership Management
        </Link>

        <Link to="/admin/users" className={getNavClass('users')}>
          <UsersIcon className={getIconClass('users')} />
          Users Management
        </Link>
      </nav>

      <div className="p-6 mt-auto hidden lg:flex flex-col gap-3 border-t border-white/5">
        <Link
          to="/"
          className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 border border-transparent"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-3 opacity-70" />
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