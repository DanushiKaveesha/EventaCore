import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  CalendarIcon,
  UserGroupIcon,
  TicketIcon,
  ArrowRightIcon,
  SparklesIcon,
  GlobeAltIcon,
  UserCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { getEvents } from '../services/eventService';

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  let user = null;

  try {
    const storedUser =
      localStorage.getItem('userInfo') || localStorage.getItem('user');
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    user = null;
  }

  const isLoggedIn = !!(user && user.token);
  const isAdmin = user?.role === 'admin';
  const isNormalUser = isLoggedIn && !isAdmin;

  const profileImage =
    user?.profileImageURL && user.profileImageURL.startsWith('/uploads')
      ? `http://localhost:5000${user.profileImageURL}`
      : user?.profileImageURL || '';

  return (
    <div className="w-full bg-white font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500 blur-3xl mix-blend-multiply animate-pulse"></div>
          <div
            className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-purple-500 blur-3xl mix-blend-multiply animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute -bottom-40 left-1/2 w-96 h-96 rounded-full bg-indigo-500 blur-3xl mix-blend-multiply animate-pulse"
            style={{ animationDelay: '4s' }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 text-center z-10">
          <span className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-200 text-sm font-bold tracking-widest uppercase mb-8 shadow-inner">
            <SparklesIcon className="w-4 h-4 text-amber-400" />
            <span>The Next Generation Campus Experience</span>
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-8 drop-shadow-2xl">
            Connect. Create. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-300">
              Celebrate.
            </span>
          </h1>

          <p className="mt-6 text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            EventraCore is your university platform for student communities,
            campus activities, and seamless user management.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-blue-900 bg-white rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 py-5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative flex items-center">
                    Get Started
                    <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white border-2 border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  Login
                </Link>
              </>
            ) : isAdmin ? (
              <Link
                to="/admin"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-blue-900 bg-white rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative flex items-center">
                  Admin Portal
                  <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-black text-blue-900 bg-white rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative flex items-center">
                  <span className="mr-3 text-blue-600">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <UserCircleIcon className="w-8 h-8" />
                    )}
                  </span>
                  {user?.username ? `Continue as ${user.username}` : 'Go to Dashboard'}
                  <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. FEATURES GRID */}
      <section id="features" className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">
            Platform Capabilities
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for campus life
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Access
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Secure signup, login, profile management, password recovery,
                email verification, and user account handling in one place.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Club Network
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Discover student organizations, join communities, and connect
                with people who share your interests across campus.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <TicketIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Event Ready
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Event features can be integrated later while keeping your user
                management system ready and fully functional from now.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section id="featured-events" className="py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">
            What's Happening
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Featured Events
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-left flex flex-col group cursor-pointer"
              >
                <div className="h-48 w-full bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                   {event.imageUrl ? (
                       <img src={`http://localhost:5000/${event.imageUrl}`} alt={event.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                   ) : (
                       <div className="absolute inset-0 bg-blue-600 opacity-20 group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                   )}
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 uppercase tracking-widest shadow-sm">
                      {event.status || 'Event'}
                   </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {event.name}
                  </h3>
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <CalendarIcon className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                      <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPinIcon className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <CurrencyDollarIcon className="w-5 h-5 mr-3 text-emerald-500 flex-shrink-0" />
                      <span className="font-semibold text-emerald-600">${event.price?.toFixed(2) || 'Free'}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-600 font-bold text-sm uppercase tracking-wider group-hover:text-indigo-600 mt-auto">
                    View Details
                    <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center">
              <GlobeAltIcon className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome to EventraCore
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            EventraCore helps university students and organizers manage their
            digital campus experience more efficiently. Right now, your user
            management system is already integrated, including authentication,
            profile updates, password recovery, and image uploads.
          </p>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            This landing page is now connected to your own login and signup
            functionality, so users can directly access your system from here.
          </p>
        </div>
      </section>

      {/* 4. BOTTOM CTA */}
      <section
        id="organizers"
        className="bg-blue-600 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-blue-700 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
            Ready to use EventraCore?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Create your account, log in securely, and start managing your
            profile with your EventraCore user system.
          </p>

          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/40 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                Login
              </Link>
            </div>
          ) : isAdmin ? (
            <div className="flex justify-center">
              <Link
                to="/admin"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Open Admin Portal
              </Link>
            </div>
          ) : (
            <div className="flex justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span className="mr-2">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-6 h-6" />
                  )}
                </span>
                Continue to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;