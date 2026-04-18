import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';

const Footer = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const days = [];
  // Padding from previous month
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, current: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true });
  }
  // Padding for next month to fill the 7x5 or 7x6 grid
  const totalCells = days.length > 35 ? 42 : 35;
  const nextPadding = totalCells - days.length;
  for (let i = 1; i <= nextPadding; i++) {
    days.push({ day: i, current: false, event: false });
  }

  // Specific dates to highlight based on the reference image (just for visual representation)
  const highlightedDates = [1, 10, 12, 13, 14, 15, 16];

  return (
    <footer className="bg-[#0f172a] text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                <img src={logoImg} alt="EventraCore Logo" className="h-10 w-10 object-contain" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">Eventra</span>
                <span className="text-white">Core</span>
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering students and clubs to create, manage, and discover extraordinary events. Your central hub for campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white uppercase text-[12px] tracking-widest mb-8">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">FAQ</Link></li>
              <li><Link to="/calendar" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200 font-medium">Monthly Calendar</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white uppercase text-[12px] tracking-widest mb-8">Contact Us</h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start space-x-3">
                <span className="text-[#8b5cf6]">📍</span>
                <span className="text-slate-400">SLIIT, Malabe Campus<br/>New Kandy Rd, Malabe</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#8b5cf6]">📞</span>
                <span className="text-slate-400">+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#8b5cf6]">✉️</span>
                <span className="text-slate-400">info@eventracore.com</span>
              </li>
            </ul>
          </div>

          {/* Follow Us & Calendar Section */}
          <div className="flex flex-col gap-12">
            <div>
              <h3 className="font-bold text-white uppercase text-[12px] tracking-widest mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Replicated Mini Calendar Widget */}
            <div className="pt-2">
              <div className="mb-6">
                <h3 className="font-bold text-white text-[16px] mb-1.5">Calendar</h3>
                <div className="h-0.5 w-16 bg-[#fbbf24]"></div>
              </div>
              
              <div className="flex items-center justify-between mb-6 px-1">
                <button className="text-[#fbbf24] hover:opacity-80 transition-opacity">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <div className="text-[14px] font-bold text-white tracking-wide">{monthNames[currentMonth]} {currentYear}</div>
                <button className="text-[#fbbf24] hover:opacity-80 transition-opacity">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <span key={d} className="text-[11px] font-bold text-slate-400">{d}</span>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                  const isToday = d.current && d.day === currentDay;
                  const isHighlighted = d.current && highlightedDates.includes(d.day);
                  
                  return (
                    <div key={i} className="flex flex-col items-center justify-center h-9 relative">
                      <span
                        className={`text-[12px] w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                          ${isToday ? 'bg-[#fbbf24] text-white font-black' : 
                            isHighlighted ? 'text-[#fbbf24] font-bold' : 
                            d.current ? 'text-slate-300' : 'text-slate-700 font-medium'}
                        `}
                      >
                        {d.day}
                      </span>
                      {isHighlighted && !isToday && (
                        <div className="w-1 h-1 bg-[#fbbf24] rounded-full absolute bottom-0.5"></div>
                      )}
                      {isToday && (
                        <div className="w-1 h-1 bg-white rounded-full absolute bottom-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-slate-700/50 pt-4">
                <Link to="/calendar" className="text-[12px] font-bold text-[#fbbf24] hover:text-[#f59e0b] transition-colors underline-offset-4 hover:underline">
                  Full calendar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EventraCore. All rights reserved.</p>
          <div className="space-x-8 mt-4 md:mt-0 font-medium tracking-wide">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
