import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BookmarkSquareIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const location = useLocation();

  useEffect(() => {
    // Determine userId based on context or a mockup identifier
    const userId = location.pathname.includes('/admin') ? 'admin' : 'ST12345';
    // Notifications were previously fetched here
  }, [location.pathname]);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <img src={logoImg} alt="EventaCore Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded drop-shadow-sm group-hover:scale-105 transition-transform" />
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED] tracking-tight">
              EventaCore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1">
              <CalendarIcon className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link to="/clubs" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1">
              <UserGroupIcon className="h-5 w-5" />
              <span>Explore Clubs</span>
            </Link>

            {user && user.role !== 'admin' && (
              <>
                <div className="h-6 w-px bg-gray-200"></div>

                {/* My Personal Dashboard Dropdown */}
                <div className="relative group">
                  <button className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 py-4">
                    <span>My Portal</span>
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <div className="absolute top-full right-1/2 translate-x-1/2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                      <Link to="/dashboard" className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                          <HomeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">Dashboard</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Student Portal</p>
                        </div>
                      </Link>

                      <Link to="/my-requests" className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <ClipboardDocumentListIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">My Apps</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Club Memberships</p>
                        </div>
                      </Link>

                      <Link to="/my-events" className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                          <CalendarDaysIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">My RSVPs</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Event Registrations</p>
                        </div>
                      </Link>

                      {user && (
                        <Link to="/my-bookings" className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <ShoppingBagIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">My Bookings</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Event Tickets</p>
                          </div>
                        </Link>
                      )}

                      <Link to="/my-bookmarks" className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                          <BookmarkSquareIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none mb-1">Saved Clubs</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Favorite Bookmarks</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

            {user && user.role === 'admin' && (
              <>
                <div className="h-6 w-px bg-gray-200"></div>

                {/* Admin Portal Toggle */}
                <Link to="/admin" className="text-[#2563EB] font-black bg-[#2563EB]/5 hover:bg-[#2563EB]/10 px-4 py-2 rounded-full transition flex items-center space-x-1 border border-blue-100/50 shadow-sm">
                  <ShieldCheckIcon className="h-4 w-4" />
                  <span>Admin Portal</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              {user && (
                <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-[#7C3AED] transition-colors rounded-full hover:bg-[#7C3AED]/10 flex items-center justify-center" title="Notifications">
                  <BellAlertIcon className="h-6 w-6" />
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>
              )}
            </div>

            {/* User Profile / Auth */}
            <div className="hidden lg:flex items-center space-x-3 pl-4 border-l border-gray-100">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900 leading-tight truncate max-w-[120px]">{user.firstName || user.name || 'User'}</p>
                    <button 
                      onClick={() => logout()}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                  <Link to="/profile" className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-100 to-purple-50 border border-blue-200 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer" title="View Profile">
                    {user.profileImageURL ? (
                      <img 
                        src={user.profileImageURL.startsWith('/uploads') ? `http://localhost:5000${user.profileImageURL}` : user.profileImageURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <UserCircleIcon className="h-6 w-6 text-blue-500" />
                    )}
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition cursor-pointer">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 transition-all cursor-pointer">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden ml-2">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-[#7C3AED] focus:outline-none transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-7 w-7" />
                ) : (
                  <Bars3Icon className="block h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-100 absolute w-full shadow-2xl`}>
        <div className="px-4 py-6 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
            <div className="flex items-center space-x-3"><HomeIcon className="h-6 w-6 text-gray-400" /><span>Home</span></div>
          </Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
            <div className="flex items-center space-x-3"><CalendarIcon className="h-6 w-6 text-gray-400" /><span>Events</span></div>
          </Link>
          <Link to="/clubs" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
            <div className="flex items-center space-x-3"><UserGroupIcon className="h-6 w-6 text-gray-400" /><span>Explore Clubs</span></div>
          </Link>
          {user && user.role !== 'admin' && (
            <>
              <div className="my-2 border-t border-gray-100"></div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                <div className="flex items-center space-x-3"><HomeIcon className="h-6 w-6 text-teal-500" /><span>Dashboard</span></div>
              </Link>
              <Link to="/my-requests" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                <div className="flex items-center space-x-3"><ClipboardDocumentListIcon className="h-6 w-6 text-gray-400" /><span>My Applications</span></div>
              </Link>
              <Link to="/my-events" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                <div className="flex items-center space-x-3"><CalendarDaysIcon className="h-6 w-6 text-gray-400" /><span>My RSVPs</span></div>
              </Link>
              <Link to="/my-bookmarks" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
                <div className="flex items-center space-x-3"><BookmarkSquareIcon className="h-6 w-6 text-rose-500" /><span>Saved Clubs</span></div>
              </Link>
            </>
          )}

          <div className="my-2 border-t border-gray-100"></div>
          
          {user && (
            <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-medium hover:bg-gray-50 text-gray-700">
              <div className="flex items-center space-x-3"><BellAlertIcon className="h-6 w-6 text-gray-400" /><span>Notifications</span></div>
            </Link>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-bold bg-blue-50 text-blue-700">
              <div className="flex items-center space-x-3"><ShieldCheckIcon className="h-6 w-6" /><span>Admin Portal</span></div>
            </Link>
          )}

          {!user && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col space-y-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 bg-gray-50 text-gray-700 font-bold rounded-xl">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-bold rounded-xl shadow-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
