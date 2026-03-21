import React, { useEffect, useState } from 'react';
import { 
  getUsers, 
  deleteUser, 
  toggleUserStatus, 
  updateUserRole 
} from '../../services/userService';
import { 
  TrashIcon, 
  UserCircleIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  NoSymbolIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        alert("Failed to delete user.");
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await toggleUserStatus(userId);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: response.isActive } : user
      ));
    } catch (error) {
      alert("Failed to update user status.");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      alert("Failed to update user role.");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans flex flex-col lg:flex-row w-full">
      <AdminSidebar />
      <div className="flex-1 w-full lg:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 lg:p-12">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 capitalize tracking-tight">Users Management</h1>
          <p className="text-gray-500 font-medium mt-2 lg:mt-3 text-base lg:text-lg">Monitor, update, and manage your platform's user roles.</p>
        </div>
        <div className="animate-fade-in space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-gray-700 bg-white"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Student">Student</option>
            <option value="Organizer">Organizer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Joined Date</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                          <UserCircleIcon className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{user.name}</p>
                          <p className="text-xs font-bold text-gray-400 tracking-tight">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="Student">Student</option>
                        <option value="Organizer">Organizer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleStatus(user._id)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                          user.isActive 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? (
                          <><ShieldCheckIcon className="w-4 h-4" /> Active</>
                        ) : (
                          <><NoSymbolIcon className="w-4 h-4" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        title="Delete User"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-4">
                      <UserCircleIcon className="w-16 h-16 text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-bold text-xl tracking-tight">No users found matching your filters.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setFilterRole('All');}}
                        className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
