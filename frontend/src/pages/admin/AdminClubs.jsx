import React from 'react';
import AdminSidebar from './AdminSidebar';
import Clubs from '../Clubs';

const AdminClubs = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar activeOverride="clubs" />
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen">
        <Clubs />
      </div>
    </div>
  );
};

export default AdminClubs;
