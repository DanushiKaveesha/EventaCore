import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingLibraryIcon, 
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';

const AdminPaymentsPortal = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar activeOverride="payments" />
      
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 lg:p-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 capitalize tracking-tight">Payment Management</h1>
          <p className="text-gray-500 font-medium mt-2 lg:mt-3 text-base lg:text-lg">Select a payment category to review transactions and billing details.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-fade-in">
          
          {/* Event Payment Card */}
          <Link 
            to="/admin/payments/events" 
            className="group block bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-sky-500/10 border border-gray-100 hover:border-sky-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <ArrowRightIcon className="w-8 h-8 text-sky-500" />
            </div>
            <div className="w-20 h-20 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600 mb-8 group-hover:scale-110 transition-transform duration-500">
              <CalendarDaysIcon className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Event Payment</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Review and manage ticket sales, refunds, and revenue generated from hosted events.
            </p>
          </Link>

          {/* Club Payment Card */}
          <Link 
            to="/admin/payments/clubs" 
            className="group block bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 hover:border-indigo-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
              <ArrowRightIcon className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform duration-500">
              <BuildingLibraryIcon className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Club & Membership Payment</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Monitor club registration fees, membership dues, and organizational billing.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPortal;