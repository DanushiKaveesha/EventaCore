import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllClubs } from '../services/clubService';
import { getMyBookmarks, toggleBookmark } from '../services/bookmarkService';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ArrowRightIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BookmarkIcon as BookmarkOutline
} from '@heroicons/react/24/outline';

const categoryColors = {
  Academic:          { bg: 'bg-blue-500',   text: 'text-blue-600',   light: 'bg-blue-50',   border: 'border-blue-100' },
  Sports:            { bg: 'bg-green-500',  text: 'text-green-600',  light: 'bg-green-50',  border: 'border-green-100' },
  Arts:              { bg: 'bg-pink-500',   text: 'text-pink-600',   light: 'bg-pink-50',   border: 'border-pink-100' },
  'Community Service':{ bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-100' },
  Technology:        { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-100' },
  Other:             { bg: 'bg-gray-500',   text: 'text-gray-600',   light: 'bg-gray-50',   border: 'border-gray-100' },
};

const categoryEmoji = {
  Academic: '📚', Sports: '⚽', Arts: '🎨',
  'Community Service': '🤝', Technology: '💻', Other: '🎯',
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
];

const ClubCard = ({ club, index, isBookmarked, onToggleBookmark }) => {
  const colors = categoryColors[club.category] || categoryColors.Other;
  const emoji  = categoryEmoji[club.category]  || '🎯';
  const imgSrc = club.image
    ? (club.image.startsWith('http') ? club.image : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`)
    : fallbackImages[index % fallbackImages.length];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imgSrc}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => { e.target.src = fallbackImages[index % fallbackImages.length]; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${colors.bg} shadow-lg z-10`}>
          {club.category || 'General'}
        </span>

        {/* Bookmark Button */}
        <button 
          onClick={(e) => { e.preventDefault(); onToggleBookmark(club._id); }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform z-10 border border-slate-100/50"
        >
          {isBookmarked ? (
            <BookmarkSolid className="w-4 h-4 text-rose-500" />
          ) : (
            <BookmarkOutline className="w-4 h-4 text-gray-400 hover:text-rose-500 transition-colors" />
          )}
        </button>

        {/* Event count pill */}
        {club.events?.length > 0 && (
          <span className="absolute top-3 left-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm text-purple-700 text-[10px] font-black px-2.5 py-1 rounded-full shadow">
            <CalendarIcon className="w-3 h-3" />
            <span>{club.events.length} Event{club.events.length !== 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Club name + emoji */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug flex-grow pr-2 group-hover:text-blue-600 transition-colors">
            {club.name}
          </h3>
          <span className="text-xl shrink-0">{emoji}</span>
        </div>

        {/* President */}
        <p className={`text-xs font-semibold mb-3 ${colors.text}`}>
          {club.president || 'No president assigned'}
        </p>

        {/* Info rows */}
        <div className="space-y-2 mb-4">
          {club.location && (
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span className="truncate">{club.location}</span>
            </div>
          )}
          {club.contact_information && (
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <UserIcon className="w-3.5 h-3.5 shrink-0 text-purple-400" />
              <span className="truncate">{club.contact_information.split(',')[0]?.replace('Email: ', '') || club.contact_information}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <UserGroupIcon className="w-3.5 h-3.5 shrink-0 text-green-400" />
            <span>Active Club</span>
          </div>
        </div>

        {/* Description snippet */}
        {club.description && (
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-grow">
            {club.description}
          </p>
        )}

        {/* View Details Button */}
        <Link
          to={`/clubs/${club._id}`}
          className="mt-auto w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-200 group/btn"
        >
          <span>View Details</span>
          <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

const ClubsGallery = () => {
  const [clubs, setClubs]       = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    Promise.all([getAllClubs(), getMyBookmarks()])
      .then(([clubsData, bookmarksData]) => {
        setClubs(clubsData);
        setBookmarkedIds(new Set(bookmarksData.map(b => b.clubId._id || b.clubId)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBookmark = async (clubId) => {
    try {
        const result = await toggleBookmark(clubId);
        const newSet = new Set(bookmarkedIds);
        if (result.bookmarked) newSet.add(clubId);
        else newSet.delete(clubId);
        setBookmarkedIds(newSet);
    } catch (error) {
        console.error("Failed to toggle bookmark", error);
    }
  };

  const allCategories = ['All', ...Object.keys(categoryColors)];

  const filtered = clubs.filter((c) => {
    const matchSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase()) ||
      c.president?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#7c3aed] pt-16 pb-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
            Explore Clubs
          </h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8 font-medium">
            Discover clubs and societies, connect with communities,<br className="hidden md:block" />
            and make your campus life extraordinary.
          </p>

          {/* Search */}
          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-2xl max-w-xl mx-auto">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clubs, locations, or presidents..."
              className="flex-grow bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400 text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 ml-2 text-xs font-bold">Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Category Filter ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-5 relative z-20">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-4 flex items-center space-x-3 overflow-x-auto scrollbar-hide">
          {allCategories.map((cat) => {
            const colors = categoryColors[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? cat === 'All'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : `${colors.bg} text-white shadow-md`
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat !== 'All' && <span>{categoryEmoji[cat]}</span>}
                <span>{cat}</span>
              </button>
            );
          })}
          <span className="ml-auto shrink-0 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full whitespace-nowrap">
            {filtered.length} Club{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No clubs found</h3>
            <p className="text-gray-400 mt-1 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((club, i) => (
              <ClubCard 
                key={club._id} 
                club={club} 
                index={i} 
                isBookmarked={bookmarkedIds.has(club._id)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="bg-slate-900 py-16 px-4 text-center mt-6">
        <h2 className="text-3xl font-bold text-white mb-3">Want to start your own club?</h2>
        <p className="text-slate-400 mb-6 text-sm">Join hundreds of students making their mark on campus.</p>
        <Link
          to="/create-club"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-wider hover:shadow-2xl hover:-translate-y-0.5 transition-all"
        >
          <span>Launch Your Club</span>
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ClubsGallery;
