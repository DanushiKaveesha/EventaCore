import React from 'react';
import AdminSidebar from './AdminSidebar';
import { IdentificationIcon, UserPlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const AdminMemberships = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar activeOverride="memberships" />
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 lg:p-12">
        <div className="mb-8 lg:mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 capitalize tracking-tight">Membership Management</h1>
            <p className="text-gray-500 font-medium mt-2 lg:mt-3 text-base lg:text-lg">Track and verify student memberships across all clubs.</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all">
            <UserPlusIcon className="h-5 w-5" />
            Renew Memberships
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
                <div className="h-24 w-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-emerald-500">
                    <IdentificationIcon className="h-12 w-12" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Memberships Module Coming Soon</h2>
                <p className="text-gray-500 font-medium mb-8">
                    The membership verification system is under development. Soon you'll be able to manage digital ID cards and subscription cycles.
                </p>
                <div className="relative max-w-xs mx-auto">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text" 
                        disabled
                        placeholder="Search members..." 
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50/50 cursor-not-allowed outline-none"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMemberships;
