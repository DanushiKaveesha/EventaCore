import React from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import AdminSidebar from './AdminSidebar';

const cards = [
  {
    to: '/admin/payments/events',
    label: 'Event Payment',
    desc: 'Review and manage ticket sales, refunds, and revenue generated from hosted events.',
    icon: CalendarDaysIcon,
    accent: 'from-sky-500 to-cyan-500',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    borderHover: 'hover:border-sky-200',
    shadowHover: 'hover:shadow-sky-100',
    arrowColor: 'text-sky-500',
    tag: 'Tickets & Revenue',
    tagBg: 'bg-sky-50 text-sky-600',
    highlights: [
      { icon: TicketIcon, label: 'Ticket Sales' },
      { icon: CurrencyDollarIcon, label: 'Refunds' },
      { icon: CreditCardIcon, label: 'Revenue' },
    ],
  },
  {
    to: '/admin/payments/clubs',
    label: 'Club & Membership Payment',
    desc: 'Monitor club registration fees, membership dues, and organizational billing.',
    icon: BuildingLibraryIcon,
    accent: 'from-violet-600 to-indigo-600',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderHover: 'hover:border-violet-200',
    shadowHover: 'hover:shadow-violet-100',
    arrowColor: 'text-violet-500',
    tag: 'Membership & Fees',
    tagBg: 'bg-violet-50 text-violet-600',
    highlights: [
      { icon: CreditCardIcon, label: 'Registration Fees' },
      { icon: CurrencyDollarIcon, label: 'Dues' },
      { icon: BuildingLibraryIcon, label: 'Billing' },
    ],
  },
];

const AdminPaymentsPortal = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative overflow-hidden">
      <AdminSidebar activeOverride="payments" />

      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-violet-400/5 rounded-full blur-3xl -ml-36 -mb-36 pointer-events-none" />

      <div className="flex-1 min-w-0 p-8 lg:p-12 space-y-12 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="h-5 w-5 text-violet-500 drop-shadow-sm" />
              <span className="text-[11px] font-black text-violet-600 uppercase tracking-[4px]">Admin Portal</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">Payment Management</h1>
            <p className="text-gray-400 text-sm font-bold max-w-xl leading-relaxed">
              Orchestrate your platform's financial ecosystem. Select a specialized portal below to oversee ticket revenue, membership dues, and organizational billing.
            </p>
          </div>

          <div className="hidden xl:flex items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-[2rem] border border-white shadow-xl shadow-gray-200/20">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</p>
              <p className="text-lg font-black text-emerald-700">Financial Hub Active</p>
            </div>
          </div>
        </div>

        {/* Categories Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl">
          {cards.map(({ to, label, desc, icon: Icon, accent, iconBg, iconColor, arrowColor, tag, tagBg, highlights }) => (
            <Link
              key={to}
              to={to}
              className="group relative bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white shadow-2xl shadow-gray-200/50 hover:shadow-violet-200/40 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden flex flex-col min-h-[440px]"
            >
              {/* Top Accent Line with Glow Effect */}
              <div className={`h-2 w-full bg-gradient-to-r ${accent} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              </div>

              <div className="p-10 flex flex-col flex-grow">
                {/* Header: Icon + Portal Badge */}
                <div className="flex items-start justify-between mb-10">
                  <div className={`w-20 h-20 rounded-3xl ${iconBg} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-8 ring-white/50`}>
                    <Icon className={`w-10 h-10 ${iconColor} drop-shadow-sm`} />
                  </div>
                  <div className="flex flex-col items-end gap-3 text-right">
                    <span className={`text-[10px] font-black uppercase tracking-[2px] px-4 py-2 rounded-xl border-2 ${tagBg} border-white shadow-sm`}>
                      {tag}
                    </span>
                    <div className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 ${arrowColor}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest">Enter Portal</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Content: Title + Description */}
                <div className="space-y-4 flex-grow">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none flex items-center gap-3">
                    {label}
                  </h2>
                  <p className="text-gray-500 font-bold text-[15px] leading-relaxed pr-6 italic">
                    {desc}
                  </p>
                </div>

                {/* Footer: Highlights / Feature Tags */}
                <div className="mt-12 pt-8 border-t border-gray-100/50 flex flex-wrap gap-4">
                  {highlights.map(({ icon: HIcon, label: hlabel }) => (
                    <span key={hlabel} className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 px-4 py-2.5 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:text-gray-700 transition-colors">
                      <HIcon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      {hlabel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Subtle hover overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Link>
          ))}
        </div>

        {/* Global Branding Footnote */}
        <div className="flex items-center gap-3 opacity-30 pt-10 border-t border-gray-200/50 max-w-6xl">
          <CreditCardIcon className="w-5 h-5 text-gray-900" />
          <p className="text-[10px] font-black text-gray-900 uppercase tracking-[5px]">EventaCore Payments Infrastructure</p>
        </div>

      </div>
    </div>
  );
};

export default AdminPaymentsPortal;
