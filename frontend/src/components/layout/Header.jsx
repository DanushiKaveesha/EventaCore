import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BellIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <nav className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CalendarIcon className="h-8 w-8" />
            <span className="font-bold text-xl">EventaCore</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-[#F59E0B] transition flex items-center space-x-1">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/clubs" className="hover:text-[#F59E0B] transition flex items-center space-x-1">
              <UserGroupIcon className="h-5 w-5" />
              <span>Clubs</span>
            </Link>
            <Link to="/events" className="hover:text-[#F59E0B] transition flex items-center space-x-1">
              <CalendarIcon className="h-5 w-5" />
              <span>Events</span>
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative hover:text-[#F59E0B] transition">
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-8 w-8" />
              <span className="hidden md:block">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;