import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png.jpeg';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoImg} alt="EventaCore Logo" className="h-10 w-10 object-cover object-top rounded-xl bg-white p-0.5" />
              <h3 className="font-bold text-xl tracking-tight text-[#F59E0B]">EventaCore</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop platform for university clubs and event management.
              Connect, collaborate, and create memories!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#F59E0B]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-[#F59E0B] transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#F59E0B] transition">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-[#F59E0B] transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#F59E0B]">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📍 SLIIT, Malabe</li>
              <li>📞 +94 11 234 5678</li>
              <li>✉️ info@eventacore.com</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#F59E0B]">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#F59E0B] transition">FB</a>
              <a href="#" className="text-gray-400 hover:text-[#F59E0B] transition">TW</a>
              <a href="#" className="text-gray-400 hover:text-[#F59E0B] transition">IG</a>
              <a href="#" className="text-gray-400 hover:text-[#F59E0B] transition">LI</a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 EventaCore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;