import React from 'react';
import AdminSidebar from './AdminSidebar';
import { StarIcon } from '@heroicons/react/24/outline';

const AdminRatings = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="ratings" />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 space-y-8 flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-white rounded-full text-[10px] font-black text-amber-600 shadow-sm border border-gray-100 uppercase tracking-widest leading-none">
              Feedback Control
            </span>
            <h1 className="text-3xl lg:text-4xl font-black text-[#0f172a] tracking-tight flex items-center gap-4">
              Rating Management
              <span className="text-[10px] bg-amber-500 text-white px-3 py-1 rounded-full uppercase tracking-widest font-black animate-pulse">Coming Soon</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium max-w-2xl">
              This module is currently under development. Detailed event ratings and user feedback management will be available here soon.
            </p>
          </div>
        </div>

        {/* Coming Soon Placeholder Section */}
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mb-8 border-2 border-amber-100 shadow-inner animate-bounce">
            <StarIcon className="w-12 h-12 text-amber-500" />
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-4 text-center">
            Ratings Module Coming Soon
          </h3>
          <p className="text-gray-400 text-sm font-medium max-w-md text-center leading-relaxed">
            We are currently building a robust system for you to manage event feedback, analyze ratings, and moderate user reviews. This feature will be available in the next major update.
          </p>
          
          <div className="mt-10 flex gap-3">
             <div className="h-1.5 w-12 bg-amber-500 rounded-full animate-pulse"></div>
             <div className="h-1.5 w-1.5 bg-gray-200 rounded-full"></div>
             <div className="h-1.5 w-1.5 bg-gray-200 rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminRatings;
