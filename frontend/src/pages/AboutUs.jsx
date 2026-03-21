import React from 'react';
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  SparklesIcon, 
  RocketLaunchIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Events Hosted', value: '2,500' },
    { label: 'Registered Clubs', value: '150' },
    { label: 'Partner Orgs', value: '12' },
  ];

  const features = [
    {
      name: 'Streamlined Event Management',
      description: 'From tiny club meetings to massive campus-wide festivals, our platform handles ticketing, check-ins, and logistics with zero friction.',
      icon: CalendarDaysIcon,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      name: 'Vibrant Community Building',
      description: 'Give your club or organization a digital home. Manage members, roles, and exclusive content all in one unified dashboard.',
      icon: UserGroupIcon,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      name: 'Next-Gen Analytics',
      description: 'Understand exactly who is coming to your events. Track engagement, revenue, and demographics with powerful, easy-to-read charts.',
      icon: SparklesIcon,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      name: 'Enterprise-Grade Reliability',
      description: 'Built on a robust architecture that guarantees 99.9% uptime, ensuring your ticket sales never stop when traffic spikes.',
      icon: ShieldCheckIcon,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const team = [
    {
      name: 'Alex Rivera',
      role: 'Founder & CEO',
      image: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=0D8ABC&color=fff&size=128',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Product',
      image: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8B5CF6&color=fff&size=128',
    },
    {
      name: 'Marcus Johnson',
      role: 'Lead Developer',
      image: 'https://ui-avatars.com/api/?name=Marcus+Johnson&background=10B981&color=fff&size=128',
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-sky-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-wide uppercase mb-8 shadow-sm">
            <SparklesIcon className="w-5 h-5" />
            Empowering Communities
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            The Operating System for <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Events & Clubs</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
            EventaCore breaks down the silos between organizers, clubs, and attendees. We provide the modern infrastructure needed to plan, execute, and analyze unforgettable experiences.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events" className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center">
              Explore Events
            </Link>
            <Link to="/create-event" className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-lg border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto text-center">
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center transform transition duration-500 hover:scale-105">
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm md:text-base font-bold text-gray-500 tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Built for the Modern Organizer</h2>
            <p className="text-xl text-gray-500 font-medium">Say goodbye to spreadsheets and messy group chats. Everything you need is beautifully integrated into one platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 lg:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${feature.color} transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.name}</h3>
                <p className="text-gray-500 text-lg font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Values */}
      <section className="py-24 lg:py-32 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sky-300 text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
                <GlobeAltIcon className="w-5 h-5" /> Our Vision
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
                Redefining the way we gather.
              </h2>
              <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-8">
                We started EventaCore with a simple belief: organizing a great event shouldn't be harder than hosting one. By giving organizers world-class tools, we free them up to focus on what actually matters—creating unforgettable memories for their communities.
              </p>
              <ul className="space-y-4">
                {['Organizer-first design philosophy', 'Completely transparent pricing', 'Relentless focus on user experience'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-200 font-medium text-lg">
                    <CheckCircleIcon className="w-6 h-6 text-sky-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group">
              <div className="absolute inset-0 bg-blue-600/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Crowd at a concert" 
                className="w-full h-full object-cover aspect-[4/3] transform group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section Placeholder */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">Meet the Minds Behind EventaCore</h2>
            <p className="text-xl text-gray-500 font-medium">A passionate group of developers, designers, and event enthusiasts dedicated to building the ultimate platform.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-lg opacity-40 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full relative z-10 border-4 border-white shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-bold uppercase tracking-widest text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black mix-blend-overlay opacity-10"></div>
        <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <RocketLaunchIcon className="w-20 h-20 mx-auto text-blue-200 mb-8" />
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to elevate your club?</h2>
          <p className="text-xl md:text-2xl text-blue-100 font-medium mb-12 max-w-2xl mx-auto">
            Join thousands of organizers who rely on EventaCore to manage their events and grow their communities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/create-event" className="px-10 py-5 rounded-2xl bg-white text-blue-600 font-black text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto text-center uppercase tracking-wide">
              Start Hosting Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
