import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import {
  getUsers,
  deleteUser,
  updateUser,
  updateUserRole
} from '../../services/userService';
import {
  UsersIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  FingerPrintIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  CalendarIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import axios from 'axios';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Feedback messages
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Message modal state
  const [messagingUserId, setMessagingUserId] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [isMessageSending, setIsMessageSending] = useState(false);

  // Edit User modal state
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    username: '',
    email: '',
    contactNumber: '',
    role: '',
    status: '',
  });

  const [sendEmail, setSendEmail] = useState(false);

  // Status confirmation state
  const [statusConfirm, setStatusConfirm] = useState(null); // { userId, newStatus }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently remove user "${name}"?`)) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        setSuccessMessage(`User ${name} removed.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete user.');
        setTimeout(() => setError(''), 4000);
      }
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusConfirm) return;
    const { userId, newStatus } = statusConfirm;
    try {
      await updateUser(userId, { status: newStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus, isActive: newStatus === 'active' } : u));
      setSuccessMessage(`Account status updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setStatusConfirm(null);
    } catch (err) {
      setError('Failed to update account status.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser._id, editFormData);
      setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...editFormData } : u));
      setSuccessMessage('User profile updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update profile.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      setSuccessMessage(`Role updated to ${newRole}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update role.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!adminMessage.trim()) return;
    try {
      setIsMessageSending(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.post(
        'http://localhost:5000/api/notifications/send',
        { userId: messagingUserId, message: adminMessage, sendEmail },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      setSuccessMessage('Message broadcast successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setMessagingUserId(null);
      setAdminMessage('');
    } catch (err) {
      setError('Failed to send message.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setIsMessageSending(false);
    }
  };

  const filtered = users.filter(u => {
    // Exclude Admin records from the display list as requested
    if (u.role?.toLowerCase() === 'admin') return false;

    const q = searchTerm.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q);
    const matchRole = filterRole === 'all' || u.role?.toLowerCase() === filterRole.toLowerCase();
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.filter(u => u.role?.toLowerCase() !== 'admin').length,
    admins: users.filter(u => u.role?.toLowerCase() === 'admin').length,
    organizers: users.filter(u => u.role?.toLowerCase() === 'organizer').length,
    students: users.filter(u => u.role?.toLowerCase() === 'student').length,
  };

  const pieData = [
    { name: 'Admins', value: stats.admins },
    { name: 'Organizers', value: stats.organizers },
    { name: 'Students', value: stats.students },
  ].filter(d => d.value > 0);

  const getRowAvatarStyle = (name) => {
    const colors = ['bg-blue-50 text-blue-600 border-blue-100', 'bg-indigo-50 text-indigo-600 border-indigo-100', 'bg-purple-50 text-purple-600 border-purple-100'];
    const charCode = (name || 'U').charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="users" />

      <div className="flex-1 min-w-0 p-5 lg:p-12 space-y-10 overflow-y-auto w-full">
        {/* Premium Header matching image */}
        <div className="space-y-4">
          <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
            <Squares2X2Icon className="w-4 h-4" /> Dashboard Overview
          </Link>
          <div className="flex items-center">
            <span className="px-4 py-1.5 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-500 border border-indigo-100 uppercase tracking-widest leading-none">
              User Administration
            </span>
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0f172a] tracking-tight mb-2">Users Management</h1>
            <p className="text-slate-400 text-sm font-bold max-w-2xl underline-off">Monitor, securely search, and manage your platform's user base with precision.</p>
          </div>
        </div>

        {/* Feedback Messages */}
        {(successMessage || error) && (
          <div className="fixed top-6 right-6 z-[110] animate-slide-in-right">
            {successMessage && <div className="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 transition-all"><CheckCircleIcon className="w-5 h-5" />{successMessage}</div>}
            {error && <div className="bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 transition-all"><XMarkIcon className="w-5 h-5" />{error}</div>}
          </div>
        )}

        {/* Platform Directory Unified Card */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {/* Card Header & Search */}
          <div className="p-10 pb-6 flex flex-wrap items-center justify-between gap-6 border-b border-gray-50/50">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-50/50 text-indigo-600 rounded-3xl flex items-center justify-center border border-indigo-100/50 shadow-inner">
                <UsersIcon className="w-7 h-7" strokeWidth={2} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Platform Directory</h3>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest leading-none">
                  {stats.total} total users available
                </p>
              </div>
            </div>

            <div className="relative w-full lg:w-96">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-sm font-bold text-[#0f172a] focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Table Redesign */}
          <div className="p-2">
            {loading ? (
              <div className="py-24 flex justify-center"><div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
            ) : filtered.length === 0 ? (
              <div className="py-24 text-center font-bold text-slate-300 uppercase tracking-widest text-[10px]">No user records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">User Info</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Contact</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Role</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Date Joined</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-14" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/70">
                    {filtered.map(user => (
                      <tr key={user._id} className="hover:bg-indigo-50/10 transition-all group">
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-[22px] border flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-105 ${getRowAvatarStyle(user.name)}`}>
                              {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-base font-black text-[#0f172a] leading-tight tracking-tight">{user.name}</p>
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">@{user.username || 'user'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 font-bold text-slate-600">
                              <EnvelopeIcon className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-[11px] truncate max-w-[180px]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 font-bold text-slate-300">
                               <PhoneIcon className="w-3.5 h-3.5" />
                               <span className="text-[10px]">{user.contactNumber || 'No contact'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            user.role?.toLowerCase() === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                            user.role?.toLowerCase() === 'organizer' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-gray-50 text-gray-500 border-gray-100'
                          }`}>
                            <ShieldCheckIcon className="w-3.5 h-3.5 opacity-50" />
                            {user.role || 'Student'}
                          </div>
                        </td>
                        <td className="px-10 py-7">
                          <div className="flex items-center gap-2 font-black text-slate-500">
                            <CalendarDaysIcon className="w-4 h-4 text-gray-200" />
                            <span className="text-[11px] uppercase tracking-wider">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 3, 2026'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-7">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              user.status === 'active' || (user.isActive && !user.status) ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_2px_10px_rgba(16,185,129,0.1)]' :
                              user.status === 'suspended' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-red-50 text-red-500 border-red-100'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                user.status === 'active' || (user.isActive && !user.status) ? 'bg-emerald-500 animate-pulse' : 
                                user.status === 'suspended' ? 'bg-amber-500' : 'bg-red-500'
                              }`} />
                              {user.status || (user.isActive ? 'Active' : 'Locked')}
                            </div>
                        </td>
                        <td className="px-10 py-7 text-right pr-14">
                           <div className="flex items-center justify-end gap-3 transition-all duration-300">
                            <button 
                              onClick={() => { setMessagingUserId(user._id); setAdminMessage(''); }} 
                              className="w-10 h-10 flex items-center justify-center text-slate-300 bg-gray-50/50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-gray-100"
                              title="Message User"
                            >
                              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                            </button>

                            <select 
                              value={user.status || (user.isActive ? 'active' : 'deactivated')}
                              onChange={(e) => setStatusConfirm({ userId: user._id, newStatus: e.target.value })}
                              className="bg-white border border-gray-200 text-[#0f172a] text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer shadow-sm min-w-[110px] hover:border-indigo-300 transition-colors"
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspend</option>
                              <option value="deactivated">Deactivate</option>
                            </select>

                            <button onClick={() => handleDelete(user._id, user.name)} className="w-10 h-10 flex items-center justify-center text-slate-300 bg-gray-50/50 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-gray-100">
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-md">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100/50 rounded-2xl flex items-center justify-center">
                  <PencilSquareIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Modify Identity</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">Edit Node Data</p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-red-500 transition-colors p-2"><XMarkIcon className="w-7 h-7" /></button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Platform Handle</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
                    <input
                      type="text"
                      value={editFormData.username}
                      onChange={e => setEditFormData({ ...editFormData, username: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-3.5 text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Secure Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Protocol Contact</label>
                  <input
                    type="text"
                    value={editFormData.contactNumber}
                    onChange={e => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                    placeholder="E.g. +94 77 XXXXXXX"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Access Role</label>
                  <select
                    value={editFormData.role}
                    onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Platform Status</label>
                  <select
                    value={editFormData.status || (editingUser?.isActive ? 'active' : 'deactivated')}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-[#0f172a] outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="deactivated">Deactivated</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 text-sm font-black text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 text-sm font-black text-white bg-slate-900 hover:bg-indigo-600 rounded-2xl shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Synchronize Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Confirmation Modal */}
      {statusConfirm && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-md">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 rounded-[30px] flex items-center justify-center mx-auto border border-amber-100">
                <ExclamationTriangleIcon className="w-10 h-10 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Security Alert</h3>
                <p className="text-gray-400 text-sm font-bold leading-relaxed px-4">
                  Changing status to <span className="text-amber-600 uppercase font-black tracking-widest">{statusConfirm.newStatus}</span> will immediately revoke this node's platform permissions. Are you sure?
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStatusConfirm(null)}
                  className="flex-1 py-4 text-sm font-black text-gray-400 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  Nevermind
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="flex-1 py-4 text-sm font-black text-white bg-amber-500 hover:bg-amber-600 rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  Verify Protocol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messagingUserId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-white/20">
            <div className="flex items-center justify-between p-7 border-b border-gray-50 bg-gray-50/30">
              <h3 className="text-xl font-black text-[#0f172a] tracking-tight flex items-center gap-3">
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-blue-600" />
                Protocol Message
              </h3>
              <button onClick={() => setMessagingUserId(null)} className="text-gray-400 hover:text-[#0f172a] transition-colors p-2"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSendMessage} className="p-7 space-y-6">
              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                placeholder="Type priority broadcast or individual notification..."
                rows="4"
                className="w-full text-sm font-bold text-[#0f172a] bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all resize-none shadow-inner"
                required
              ></textarea>
              <div className="flex items-center gap-3 px-1">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-gray-100 text-blue-600 focus:ring-blue-500/10 cursor-pointer"
                />
                <label htmlFor="sendEmail" className="text-[11px] font-black text-slate-500 uppercase tracking-widest cursor-pointer select-none">
                  Synchronize to Personal Email
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button type="submit" disabled={isMessageSending} className="w-full py-4 text-sm font-black text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                  {isMessageSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <PaperAirplaneIcon className="w-4 h-4" />}
                  {sendEmail ? 'Transmit Cross-Channel' : 'Transmit Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
