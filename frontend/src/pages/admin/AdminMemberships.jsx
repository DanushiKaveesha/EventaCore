import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminRequests from '../AdminRequests';

const AdminMemberships = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar activeOverride="memberships" />
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen">
        <AdminRequests />
      </div>
    </div>
  );
};

export default AdminMemberships;
