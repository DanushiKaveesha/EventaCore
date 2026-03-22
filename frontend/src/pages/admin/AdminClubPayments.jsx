import React from 'react';
import AdminSidebar from './AdminSidebar';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

const AdminClubPayments = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar activeOverride="payments" />
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 lg:p-12 animate-fade-in">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 capitalize tracking-tight">Club & Membership Payment</h1>
          <p className="text-gray-500 font-medium mt-2 lg:mt-3 text-base lg:text-lg">View member subscription and organizational dues.</p>
        </div>
        
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col items-center justify-center py-32 px-4 text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 mb-6 relative">
                <BuildingLibraryIcon className="w-12 h-12" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white bg-amber-500 shadow-sm animate-pulse flex items-center justify-center text-white font-bold text-xs">!</div>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Module Coming Soon</h3>
            <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">Club and membership payment tracking integrations are currently in development. Future transactions will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminClubPayments;
