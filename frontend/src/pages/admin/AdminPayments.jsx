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
      { icon: TicketIcon,         label: 'Ticket Sales' },
      { icon: CurrencyDollarIcon, label: 'Refunds' },
      { icon: CreditCardIcon,     label: 'Revenue' },
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
      { icon: CreditCardIcon,     label: 'Registration Fees' },
      { icon: CurrencyDollarIcon, label: 'Dues' },
      { icon: BuildingLibraryIcon,label: 'Billing' },
    ],
  },
];

const AdminPaymentsPortal = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar activeOverride="payments" />

      <div className="flex-1 min-w-0 p-5 lg:p-8 space-y-7">

        {/* Header */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <SparklesIcon className="h-4 w-4 text-violet-500" />
            <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Payment Management</h1>
          <p className="text-gray-400 text-xs font-medium mt-0.5">Select a payment category to review transactions and billing details.</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {cards.map(({ to, label, desc, icon: Icon, accent, iconBg, iconColor, borderHover, shadowHover, arrowColor, tag, tagBg, highlights }) => (
            <Link
              key={to}
              to={to}
              className={`group relative bg-white rounded-2xl border border-gray-100 ${borderHover} shadow-lg ${shadowHover} hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col`}
            >
              {/* Top gradient bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />

              <div className="p-6 flex flex-col flex-grow">
                {/* Icon + tag row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${tagBg}`}>{tag}</span>
                    <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${arrowColor}`}>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <h2 className="text-base font-black text-gray-900 tracking-tight mb-2">{label}</h2>
                <p className="text-xs text-gray-400 font-medium leading-relaxed flex-grow">{desc}</p>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-50">
                  {highlights.map(({ icon: HIcon, label: hlabel }) => (
                    <span key={hlabel} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <HIcon className="w-3 h-3" />
                      {hlabel}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminPaymentsPortal;
