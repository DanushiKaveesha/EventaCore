import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <nav className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition">
            <img src={logoImg} alt="EventaCore Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-cover object-top rounded-xl bg-white shadow-sm border border-white/20" />
            <span className="font-bold text-xl sm:text-2xl tracking-tight">EventaCore</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-[#F59E0B] transition flex items-center space-x-1 font-medium">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link to="/clubs" className="hover:text-[#F59E0B] transition flex items-center space-x-1 font-medium">
              <UserGroupIcon className="h-5 w-5" />
              <span>Clubs</span>
            </Link>
            <Link to="/events" className="hover:text-[#F59E0B] transition flex items-center space-x-1 font-medium">
              <CalendarIcon className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link to="/admin/events" className="hover:text-blue-900 transition flex items-center space-x-1 font-bold bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full shadow-sm">
              <ShieldCheckIcon className="h-5 w-5" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Right Side Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="relative hover:text-[#F59E0B] transition focus:outline-none">
              <BellIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-2 cursor-pointer hover:text-[#F59E0B] transition">
              <UserCircleIcon className="h-8 w-8 sm:h-9 sm:w-9" />
              <span className="font-semibold">John Doe</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-[#F59E0B] focus:outline-none transition"
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
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white text-gray-800 shadow-xl absolute w-full left-0`}>
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
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between px-3">
             <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <span className="font-bold text-lg text-gray-800">John Doe</span>
             </div>
             <button className="relative p-2 text-gray-400 hover:text-blue-600">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">3</span>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;