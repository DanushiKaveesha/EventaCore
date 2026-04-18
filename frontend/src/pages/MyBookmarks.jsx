import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookmarks, toggleBookmark } from '../services/bookmarkService';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import {
  MapPinIcon, UserIcon, CalendarIcon, ArrowRightIcon, BookmarkSquareIcon
} from '@heroicons/react/24/outline';

const fallbackImages = [
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800'
];

const categoryColors = {
    Academic:          { bg: 'bg-blue-500',   text: 'text-blue-600' },
    Sports:            { bg: 'bg-green-500',  text: 'text-green-600' },
    Arts:              { bg: 'bg-pink-500',   text: 'text-pink-600' },
    'Community Service':{ bg: 'bg-orange-500', text: 'text-orange-600' },
    Technology:        { bg: 'bg-purple-500', text: 'text-purple-600' },
    Other:             { bg: 'bg-gray-500',   text: 'text-gray-600' },
};

const SavedClubCard = ({ club, index, onRemove }) => {
    if (!club) return null;
    
    const colors = categoryColors[club.category] || categoryColors.Other;
    const imgSrc = (club.image && typeof club.image === 'string' && club.image.trim() !== '')
        ? (club.image.startsWith('http') ? club.image : `http://localhost:5000/${club.image.replace(/\\/g, '/')}`)
        : fallbackImages[index % fallbackImages.length];

    return (
        <div className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-100 border border-slate-100 flex flex-col group transition-all duration-300">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <img src={imgSrc} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.target.src = fallbackImages[0]; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent" />
                
                {/* Remove Bookmark Toggle */}
                <button 
                    onClick={(e) => { e.preventDefault(); onRemove(club._id); }}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:scale-110 hover:bg-rose-50 transition-all z-10"
                    title="Remove Bookmark"
                >
                    <BookmarkSolid className="w-5 h-5 text-rose-500" />
                </button>

                <span className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${colors.bg} shadow-lg backdrop-blur-md`}>
                    {club.category || 'General'}
                </span>
            </div>

            {/* Bottom Section */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 group-hover:text-rose-600 transition-colors">
                    {club.name}
                </h3>
                <div className="space-y-2.5 mb-6">
                    {club.location && (
                        <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                            <MapPinIcon className="w-4 h-4 text-slate-400" />
                            <span className="truncate">{club.location}</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span className="truncate">{club.president || 'No President'}</span>
                    </div>
                </div>

                <Link
                    to={`/clubs/${club._id}`}
                    className="mt-auto w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm hover:bg-rose-600 hover:text-white transition-all group/btn"
                >
                    <span>View Club</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default function MyBookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const data = await getMyBookmarks();
            // Securely filter out abandoned bookmarks whose related Club document got deleted
            const validBookmarks = data.filter(b => b.clubId != null);
            setBookmarks(validBookmarks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBookmark = async (clubId) => {
        try {
            await toggleBookmark(clubId);
            setBookmarks(prev => prev.filter(b => b.clubId._id !== clubId));
        } catch (error) {
            console.error("Failed to remove bookmark", error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/30 min-h-[80vh]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-in fade-in duration-500">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center mb-1">
                        <BookmarkSquareIcon className="h-7 w-7 mr-3 text-rose-500" />
                        My Saved Clubs
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Quickly access the clubs you've favorited.</p>
                </div>
                <div className="bg-rose-50 text-rose-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-rose-100/50">
                    {bookmarks.length} Bookmarks
                </div>
            </div>

            {bookmarks.length === 0 ? (
                <div className="bg-white rounded-[32px] p-16 text-center border border-slate-100 shadow-sm animate-in fade-in duration-700">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-6">
                        <BookmarkSolid className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Bookmarks Yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore the directory and hit the heart icon to save clubs here.</p>
                    <Link to="/clubs" className="inline-flex items-center px-6 py-3 bg-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-rose-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-200">
                        Explore Clubs
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {bookmarks.map((bookmark, idx) => (
                        <div key={bookmark._id} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <SavedClubCard 
                                club={bookmark.clubId} 
                                index={idx} 
                                onRemove={handleRemoveBookmark}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
