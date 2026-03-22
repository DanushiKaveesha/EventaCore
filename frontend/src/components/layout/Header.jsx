import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <img src={logoImg} alt="EventaCore Logo" className="h-9 w-9 sm:h-11 sm:w-11 object-contain rounded drop-shadow-sm group-hover:scale-105 transition-transform" />
            <span className="font-bold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED] tracking-tight whitespace-nowrap">EventaCore</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/clubs" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
              <UserGroupIcon className="h-5 w-5" />
              <span>Clubs</span>
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-[#7C3AED] font-semibold transition flex items-center space-x-1 p-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link to="/admin/events" className="text-[#2563EB] font-black bg-[#2563EB]/5 hover:bg-[#2563EB]/10 px-4 py-2 rounded-full transition flex items-center space-x-1 border border-blue-100/50 shadow-sm">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Right Side Icons / Auth */}
          <div className="flex items-center space-x-6">
            <button className="hidden sm:block text-gray-500 hover:text-[#7C3AED] transition group">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-bold transition-colors text-sm">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg hover:shadow-[#2563EB]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-[#7C3AED] focus:outline-none transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-7 w-7" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-7 w-7" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white text-gray-800 shadow-xl absolute w-full left-0 border-t border-gray-100`}>
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition">
            <div className="flex items-center space-x-3"><HomeIcon className="h-6 w-6" /><span>Home</span></div>
          </Link>

          <Link to="/clubs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition">
             <div className="flex items-center space-x-3"><UserGroupIcon className="h-6 w-6" /><span>Clubs</span></div>
          </Link>
          <Link to="/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50 transition">
             <div className="flex items-center space-x-3"><CalendarIcon className="h-6 w-6" /><span>Events</span></div>
          </Link>
          <Link to="/admin/events" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-4 rounded-md text-base font-medium hover:text-indigo-800 hover:bg-indigo-100 transition border-l-4 border-indigo-500 bg-indigo-50 mt-2">
             <div className="flex items-center space-x-3"><ShieldCheckIcon className="h-6 w-6 text-indigo-600" /><span className="text-indigo-800 font-bold">Admin Portal</span></div>
          </Link>
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col space-y-3 px-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white font-bold rounded-2xl shadow-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;