import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#about" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:translate-x-1 inline-block transition-transform duration-200">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <span className="text-[#8b5cf6]">📍</span>
                <span>SLIIT, Malabe Campus<br/>New Kandy Rd, Malabe</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#8b5cf6]">📞</span>
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[#8b5cf6]">✉️</span>
                <span>info@eventracore.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#3b82f6] hover:text-white transition-colors duration-300">
                FB
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1da1f2] hover:text-white transition-colors duration-300">
                TW
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#e1306c] hover:text-white transition-colors duration-300">
                IG
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors duration-300">
                LI
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EventraCore. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
