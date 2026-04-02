import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { 
  getUsers, 
  deleteUser, 
  toggleUserStatus, 
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

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Message modal state (from usermanagement branch)
  const [messagingUserId, setMessagingUserId] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

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
      } catch (err) {
        alert('Failed: ' + err);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatus(id);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) {
      alert('Failed: ' + err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed: ' + err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!adminMessage.trim()) return;
    try {
      setIsMessageSending(true);
      setError('');
      setSuccessMessage('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.post(
        'http://localhost:5000/api/notifications/send',
        { userId: messagingUserId, message: adminMessage },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      setSuccessMessage('Message sent successfully to user.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setMessagingUserId(null);
      setAdminMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setIsMessageSending(false);
    }
  };

  const filtered = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    organizers: users.filter(u => u.role === 'Organizer').length,
    students: users.filter(u => u.role === 'Student').length,
  };

  const pieData = [
    { name: 'Admins', value: stats.admins },
    { name: 'Organizers', value: stats.organizers },
    { name: 'Students', value: stats.students },
  ].filter(d => d.value > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <AdminSidebar activeOverride="users" />

      <div className="flex-1 min-w-0 p-5 lg:p-8 space-y-6 overflow-y-auto w-full">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <SparklesIcon className="h-4 w-4 text-violet-500" />
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest leading-none">Security Center</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight leading-tight">Users Management</h1>
            <p className="text-gray-400 text-xs font-medium mt-1">Granular control over accounts, roles, and platform access.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-wider">
            <UserPlusIcon className="h-4 w-4" />
            Provision User
          </button>
        </div>

        {/* Success/Error messages */}
        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 shadow-sm">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Analytics & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Users</p>
                <h3 className="text-2xl font-black text-slate-800">{stats.total}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Admins</p>
                <h3 className="text-2xl font-black text-slate-800">{stats.admins}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FingerPrintIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Organizers</p>
                <h3 className="text-2xl font-black text-slate-800">{stats.organizers}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <UserCircleIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Students</p>
                <h3 className="text-2xl font-black text-slate-800">{stats.students}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-full min-h-[200px]">
            <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Role Distribution</h2>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-medium focus:ring-2 focus:ring-violet-300 outline-none"
            />
          </div>
          <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
            {['all', 'Admin', 'Organizer', 'Student'].map(role => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filterRole === role ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-lg overflow-hidden">
          {loading ? (
            <div className="py-24 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center font-bold text-slate-300">No users found in current buffer.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identified User</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Status</th>
                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right pr-10">Protocols</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(user => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 shrink-0">
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate leading-tight">{user.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <EnvelopeIcon className="w-3 h-3 text-slate-300" />
                              <span className="text-[10px] font-bold text-slate-400 truncate">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                            user.role === 'Admin' ? 'bg-violet-50 text-violet-600 border-violet-100' :
                            user.role === 'Organizer' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}
                        >
                          <option value="Student">Student</option>
                          <option value="Organizer">Organizer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                            user.isActive 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-red-50 text-red-500 border border-red-100 opacity-60'
                          }`}
                        >
                          {user.isActive ? (
                            <><CheckCircleIcon className="w-3.5 h-3.5" /> Active Stream</>
                          ) : (
                            <><XCircleIcon className="w-3.5 h-3.5" /> Locked</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-right pr-10">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setMessagingUserId(user._id);
                              setAdminMessage('');
                            }}
                            className="w-9 h-9 flex items-center justify-center text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100/50"
                            title="Send Message"
                          >
                            <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="w-9 h-9 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100/50"
                            title="Delete User"
                          >
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

      {/* Message Modal (from usermanagement branch) */}
      {messagingUserId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 text-indigo-500" />
                Send Notification
              </h3>
              <button 
                onClick={() => setMessagingUserId(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Cancel"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Type a broadcast message or direct notification..."
                  rows="4"
                  className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all resize-none shadow-sm"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMessagingUserId(null)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMessageSending || !adminMessage.trim()}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isMessageSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Send Message
                    </>
                  )}
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
