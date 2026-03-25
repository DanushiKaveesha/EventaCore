import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getCurrentUser } from '../utils/getCurrentUser';
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const location = useLocation();
  const user = getCurrentUser();
  const [activeSection, setActiveSection] = useState('#home');

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  const profileImage =
    user?.profileImageURL && user.profileImageURL.startsWith('/uploads')
      ? `http://localhost:5000${user.profileImageURL}`
      : user?.profileImageURL || '';

  const handleHashLink = (hash) => {
    if (location.pathname === '/') {
      return hash;
    }
    return `/${hash}`;
  };

  useEffect(() => {
    if (location.pathname !== '/') return;

    const sections = ['home', 'features', 'about'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(`#${sections[i]}`);
          return;
        }
      }

      setActiveSection('#home');
    };

    const handleHashChange = () => {
      setActiveSection(window.location.hash || '#home');
    };

    handleScroll();
    handleHashChange();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location.pathname]);

  const isActiveHash = (hash) => {
    if (location.pathname !== '/') return false;
    return activeSection === hash;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to={isAdmin ? '/admin' : isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2 group">
            <img src={logo} alt="EventraCore Logo" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              EventraCore
            </span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href={handleHashLink('#home')}
              className={`font-bold transition-all duration-300 ${
                isActiveHash('#home')
                  ? 'text-blue-600 -translate-y-0.5'
                  : 'text-gray-600 hover:text-blue-600 hover:-translate-y-0.5'
              }`}
            >
              Home
            </a>
            <a
              href={handleHashLink('#features')}
              className={`font-bold transition-all duration-300 ${
                isActiveHash('#features')
                  ? 'text-blue-600 -translate-y-0.5'
                  : 'text-gray-600 hover:text-blue-600 hover:-translate-y-0.5'
              }`}
            >
              Features
            </a>
            <a
              href={handleHashLink('#about')}
              className={`font-bold transition-all duration-300 ${
                isActiveHash('#about')
                  ? 'text-blue-600 -translate-y-0.5'
                  : 'text-gray-600 hover:text-blue-600 hover:-translate-y-0.5'
              }`}
            >
              About
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            ) : isAdmin ? (
              <Link
                to="/admin"
                className="px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Admin Portal
              </Link>
            ) : (
              <>
                <Link to="/notifications" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors relative group">
                  <BellIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>
                <Link to="/settings" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors group">
                  <Cog6ToothIcon className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
                </Link>
                <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
                <Link to="/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer group">
                  <span className="text-sm font-bold text-gray-700 pl-2 hidden sm:block group-hover:text-indigo-600 transition-colors">
                    {user?.username || 'User'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center overflow-hidden border border-indigo-200">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-5 h-5" />
                    )}
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;