import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BellIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logo} alt="EventaCore Logo" className="h-9 w-9 object-contain rounded drop-shadow-sm group-hover:scale-105 transition-transform" />
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">EventaCore</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/clubs" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <UserGroupIcon className="h-5 w-5" />
              <span>Clubs</span>
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-[#7C3AED] font-medium transition flex items-center space-x-1">
              <CalendarIcon className="h-5 w-5" />
              <span>Events</span>
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-5">
            <button className="relative text-gray-500 hover:text-[#7C3AED] transition">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <UserCircleIcon className="h-9 w-9 text-gray-400 group-hover:text-[#2563EB] transition" />
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-gray-800 leading-none group-hover:text-[#2563EB] transition">John Doe</p>
                <p className="text-gray-500 text-xs mt-1">Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;