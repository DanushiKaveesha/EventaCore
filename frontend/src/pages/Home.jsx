import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  UserGroupIcon,
  TicketIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { getEvents } from '../services/eventService';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getEvents();
        // Get the latest 3 upcoming events for the showcase
        const upcoming = data.filter(e => e.status === 'upcoming' || e.status === 'ongoing')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setFeaturedEvents(upcoming);
      } catch (err) {
        console.error("Failed to load featured events", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full bg-white font-sans">

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500 blur-3xl mix-blend-multiply animate-pulse"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-500 blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-40 left-1/2 w-96 h-96 rounded-full bg-indigo-500 blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 text-center z-10">
          <span className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-200 text-sm font-bold tracking-widest uppercase mb-8 shadow-inner">
            <SparklesIcon className="w-4 h-4 text-amber-400" />
            <span>The Next Generation Campus Experience</span>
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 drop-shadow-2xl">
            Connect. Create. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300">Celebrate.</span>
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            EventaCore is your ultimate university platform to discover student clubs, book event tickets, and organize massive campus gatherings seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
            <Link to="/events" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-blue-900 bg-white rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 py-5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative flex items-center">
                Explore Events
                <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>
            <Link to="/clubs" className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white border-2 border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300">
              <UserGroupIcon className="w-6 h-6 mr-2 opacity-80" />
              Browse Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">Platform Capabilities</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for campus life
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Mastery</h3>
              <p className="text-gray-500 leading-relaxed">
                Explore a comprehensive calendar of university events. From tech workshops to cultural festivals, never miss out on what's happening around you.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Club Network</h3>
              <p className="text-gray-500 leading-relaxed">
                Discover student organizations that align with your passions. Join communities, collaborate on projects, and build your university network.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <TicketIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Ticketing</h3>
              <p className="text-gray-500 leading-relaxed">
                Secure your spot at premium events instantly. Our intelligent booking system provides fast checkouts, QR generation, and unique student discount codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED EVENTS SHOWCASE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Trending Events</h2>
              <p className="mt-2 text-xl text-gray-500">Snag your tickets before they sell out!</p>
            </div>
            <Link to="/events" className="hidden sm:flex items-center text-blue-600 font-bold hover:text-blue-800 transition">
              View Full Calendar <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center">
              <GlobeAltIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600">Gathering the latest events...</h3>
              <p className="text-gray-500 mt-2">Check back soon for massive campus drops!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <Link to="/events" key={event._id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    {event.imageUrl ? (
                      <img src={`http://localhost:5000/${event.imageUrl}`} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=Event'} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <CalendarIcon className="h-16 w-16 text-blue-200" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-gray-800 shadow-sm border border-gray-200">
                      {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">{event.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-blue-600">
                      <span>Book Now</span>
                      <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/events" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition">
              View Full Calendar <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA */}
      <section className="bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-700 opacity-50" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
            Are you a Club President or Event Organizer?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Register your organization on EventaCore to unlock premium dashboard analytics, automated ticketing tools, and massive student reach.
          </p>
          <Link to="/admin/events" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            Access Admin Portal
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
