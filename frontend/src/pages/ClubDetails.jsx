import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubById } from '../services/clubService';
import {
  MapPinIcon, UserIcon, CalendarIcon, ArrowLeftIcon,
  EnvelopeIcon, PhoneIcon, UserGroupIcon, ClockIcon,
  CheckBadgeIcon, SparklesIcon,
} from '@heroicons/react/24/outline';

const categoryMeta = {
  Academic:            { emoji: '📚', from: '#2563eb', to: '#1e40af', badge: 'bg-blue-100 text-blue-700' },
  Sports:              { emoji: '⚽', from: '#16a34a', to: '#14532d', badge: 'bg-green-100 text-green-700' },
  Arts:                { emoji: '🎨', from: '#db2777', to: '#9d174d', badge: 'bg-pink-100 text-pink-700' },
  'Community Service': { emoji: '🤝', from: '#ea580c', to: '#9a3412', badge: 'bg-orange-100 text-orange-700' },
  Technology:          { emoji: '💻', from: '#7c3aed', to: '#4c1d95', badge: 'bg-purple-100 text-purple-700' },
  Other:               { emoji: '🎯', from: '#475569', to: '#1e293b', badge: 'bg-gray-100 text-gray-700' },
};

const fallbackImgs = [
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
];

export default function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('about');

  useEffect(() => {
    getClubById(id).then(setClub).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (!club) return (
    <div className="py-24 text-center">
      <p className="text-gray-400 text-lg mb-4">Club not found.</p>
      <Link to="/clubs" className="inline-flex items-center text-blue-600 font-bold hover:underline">
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Clubs
      </Link>
    </div>
  );

  const meta = categoryMeta[club.category] || categoryMeta.Other;
  const coverSrc = club.image
    ? (club.image.startsWith('http') ? club.image : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`)
    : fallbackImgs[(club._id?.charCodeAt(0) ?? 0) % fallbackImgs.length];

  const contactRaw = club.contact_information || '';
  const email = (contactRaw.match(/Email:\s*([^,]+)/) || [])[1]?.trim() || contactRaw;
  const phone = (contactRaw.match(/Phone:\s*([^,]+)/) || [])[1]?.trim() || '';

  const tabs = [
    { id: 'about',   label: 'About' },
    { id: 'events',  label: `Events (${club.events?.length || 0})` },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Hero Card ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}>

        {/* Background image with opacity */}
        <div className="absolute inset-0">
          <img src={coverSrc} alt={club.name} className="w-full h-full object-cover opacity-20" onError={(e) => { e.target.src = fallbackImgs[0]; }} />
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white opacity-5" />

        <div className="relative z-10 p-8 sm:p-10">
          {/* Back link */}
          <Link to="/clubs" className="inline-flex items-center space-x-2 text-white/70 hover:text-white text-sm font-bold mb-8 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>All Clubs</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/30 overflow-hidden shrink-0 shadow-2xl">
              {club.image ? (
                <img src={coverSrc} alt={club.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">{meta.emoji}</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${meta.badge}`}>
                  {meta.emoji} {club.category || 'General'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                  ✓ Active
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight drop-shadow-md">{club.name}</h1>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm font-medium">
                <span className="flex items-center space-x-1.5">
                  <UserIcon className="w-4 h-4" />
                  <span>Led by {club.president}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{club.location || 'Campus'}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{club.events?.length || 0} Events</span>
                </span>
              </div>
            </div>

            {/* Join button */}
            <button className="shrink-0 px-8 py-3.5 bg-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all" style={{ color: meta.from }}>
              Join Club
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex space-x-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              tab === t.id
                ? 'text-white shadow-md'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            style={tab === t.id ? { background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── About ── */}
      {tab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5 text-blue-500" />
              <span>About the Club</span>
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line font-medium text-[15px]">
              {club.description || 'No description yet.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Club Details</h3>
              <div className="space-y-4">
                {[
                  { icon: UserIcon,      label: 'President', value: club.president,        color: 'text-blue-600',   bg: 'bg-blue-50' },
                  { icon: MapPinIcon,    label: 'Location',  value: club.location || 'TBA',color: 'text-purple-600', bg: 'bg-purple-50' },
                  { icon: UserGroupIcon, label: 'Category',  value: `${meta.emoji} ${club.category || 'General'}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { icon: CheckBadgeIcon,label: 'Status',    value: 'Active',              color: 'text-green-600',  bg: 'bg-green-50' },
                ].map(({ icon: Icon, label, value, color, bg }) => (
                  <div key={label} className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-bold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="rounded-3xl p-6 text-white text-center shadow-xl" style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}>
              <p className="font-black text-lg mb-1">Interested?</p>
              <p className="text-white/80 text-xs mb-4">Join {club.name} today.</p>
              <button className="w-full py-3 bg-white rounded-2xl font-black text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{ color: meta.from }}>
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Events ── */}
      {tab === 'events' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-purple-500" />
              <span>Club Events</span>
            </span>
            <span className="bg-purple-50 text-purple-600 text-xs font-black px-3 py-1 rounded-full">
              {club.events?.length || 0} Total
            </span>
          </h2>

          {!club.events?.length ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">No events yet — check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {club.events.map((ev, i) => {
                const d = new Date(ev.date);
                const isPast = d < new Date();
                return (
                  <div key={i} className={`flex items-start space-x-5 p-5 rounded-2xl border transition-all hover:shadow-md ${isPast ? 'bg-gray-50 border-gray-100' : 'bg-white border-purple-100 hover:border-purple-200'}`}>
                    <div className={`w-14 shrink-0 rounded-2xl text-center py-2 shadow-sm ${isPast ? 'bg-gray-200' : ''}`}
                      style={!isPast ? { background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` } : {}}>
                      <p className={`text-[9px] font-black tracking-widest ${isPast ? 'text-gray-500' : 'text-white/70'}`}>
                        {d.toLocaleString('default', { month: 'short' }).toUpperCase()}
                      </p>
                      <p className={`text-2xl font-black leading-none ${isPast ? 'text-gray-600' : 'text-white'}`}>{d.getDate()}</p>
                      <p className={`text-[9px] font-bold ${isPast ? 'text-gray-400' : 'text-white/70'}`}>{d.getFullYear()}</p>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                        <h3 className="font-black text-gray-900 text-sm">{ev.name}</h3>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-purple-50 text-purple-700'}`}>
                          {isPast ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 text-xs text-gray-500 font-medium">
                        <span className="flex items-center space-x-1"><ClockIcon className="w-3 h-3" /><span>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                        <span className="flex items-center space-x-1"><MapPinIcon className="w-3 h-3" /><span>{ev.location || 'TBA'}</span></span>
                      </div>
                      {ev.description && <p className="mt-2 text-xs text-gray-400 line-clamp-2">{ev.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Contact ── */}
      {tab === 'contact' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: EnvelopeIcon, label: 'Email',     value: email,          color: 'text-blue-600',   bg: 'bg-blue-50' },
            { icon: PhoneIcon,    label: 'Phone',     value: phone,          color: 'text-green-600',  bg: 'bg-green-50' },
            { icon: UserIcon,     label: 'President', value: club.president, color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: MapPinIcon,   label: 'Location',  value: club.location,  color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5 break-all">{value || 'N/A'}</p>
              </div>
            </div>
          ))}

          <div className="sm:col-span-2 rounded-3xl p-8 text-white text-center shadow-xl" style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}>
            <div className="text-4xl mb-3">{meta.emoji}</div>
            <h3 className="text-xl font-black mb-2">Ready to join {club.name}?</h3>
            <p className="text-white/80 text-sm mb-5">Reach out to the president or contact via email to get started.</p>
            <button className="bg-white font-black px-8 py-3 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider" style={{ color: meta.from }}>
              Contact Us
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
