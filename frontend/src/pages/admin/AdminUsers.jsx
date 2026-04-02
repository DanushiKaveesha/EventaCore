import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ChevronUpDownIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  XMarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../../utils/getCurrentUser';

const AdminUsers = () => {
  const currentUser = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [messagingUserId, setMessagingUserId] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [isMessageSending, setIsMessageSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const visibleUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const isAdminRole = user.role === 'admin';
      const isCurrentAdmin = user._id === currentUser?._id;

      if (isAdminRole || isCurrentAdmin) return false;

      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const query = searchTerm.trim().toLowerCase();

      if (!query) return true;

      return (
        fullName.toLowerCase().includes(query) ||
        (user.firstName || '').toLowerCase().includes(query) ||
        (user.lastName || '').toLowerCase().includes(query) ||
        (user.email || '').toLowerCase().includes(query)
      );
    });

    return filtered;
  }, [users, searchTerm, currentUser]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUpdatingUserId(userId);
      setError('');
      setSuccessMessage('');

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.put(
        `http://localhost:5000/api/users/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      setSuccessMessage('User status updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setUpdatingUserId('');
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-500/20';
      case 'suspended':
        return 'bg-amber-100 text-amber-700 shadow-inner shadow-amber-500/20';
      case 'deactivated':
        return 'bg-red-100 text-red-700 shadow-inner shadow-red-500/20';
      default:
        return 'bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-500/20';
    }
  };

  const formatRole = (role) => {
    if (!role) return 'User';
    return role
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen font-sans flex flex-col xl:flex-row w-full selection:bg-indigo-500 selection:text-white">
      <AdminSidebar activeOverride="users" />

      <div className="flex-1 w-full xl:max-w-[calc(100%-320px)] overflow-x-hidden min-h-screen p-4 sm:p-8 xl:p-12 relative">
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 mb-8 xl:mb-12">
          <div className="inline-flex items-center rounded-full bg-white shadow-sm border border-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4">
            User Administration
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold text-gray-900 tracking-tight">
            Users Management
          </h1>
          <p className="text-gray-500 font-medium mt-3 text-lg leading-relaxed max-w-2xl">
            Monitor, securely search, and manage your platform's user base with precision.
          </p>
        </div>

        <div className="relative z-10 bg-white rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-white p-6 sm:p-8 overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-inner">
                <UsersIcon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Platform Directory
                </h2>
                <p className="text-gray-500 font-medium text-sm mt-1">
                  {visibleUsers.length} total users available
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-96 group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="min-h-[3rem]">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-red-600 animate-pulse">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50/80 backdrop-blur-sm px-4 py-3 text-sm font-semibold text-green-700 shadow-sm">
                {successMessage}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-500 font-semibold animate-pulse">Loading directory...</p>
            </div>
          ) : visibleUsers.length === 0 ? (
            <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 text-gray-300 shadow-sm">
                <UsersIcon className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 font-medium mx-auto max-w-sm">
                We couldn't find any users matching your criteria. Try adjusting your search term.
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-6 px-6 py-2 bg-white text-indigo-600 font-bold rounded-lg border border-indigo-100 hover:bg-indigo-50 hover:shadow-sm transition-all shadow-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider font-extrabold text-gray-500">
                    <th className="px-6 py-4">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600 transition-colors">
                        User Info
                      </div>
                    </th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Date Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {visibleUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold shadow-inner shadow-indigo-500/20 text-lg">
                            {(user.firstName || user.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                              {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          {user.email || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                          {user.contactNumber || 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-bold text-gray-700 shadow-sm">
                          <ShieldCheckIcon className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize border border-transparent shadow-sm ${getStatusBadgeClass(user.status)}`}
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => {
                              setMessagingUserId(user._id);
                              setAdminMessage('');
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-indigo-600 transition-colors p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg shadow-sm"
                            title="Message User"
                          >
                            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                          </button>
                          <select
                            value={user.status || 'active'}
                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                            disabled={updatingUserId === user._id}
                            className="text-sm font-bold text-gray-700 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 hover:bg-gray-50 outline-none transition cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                          >
                            <option value="active" className="font-semibold text-gray-900">Active</option>
                            <option value="suspended" className="font-semibold text-gray-900">Suspend</option>
                            <option value="deactivated" className="font-semibold text-red-600">Deactivate</option>
                          </select>
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

      {/* Message Modal */}
      {messagingUserId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity content-start animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
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
                  className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMessageSending || !adminMessage.trim()}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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