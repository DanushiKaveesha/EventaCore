import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/eventService';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon, TagIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        // optionally sort by date closest first
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sorted);
      } catch (err) {
        console.error(err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 shadow-sm">
          <h3 className="text-xl font-bold mb-2">Oops!</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 mt-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
          <span>Explore Campus Drops</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 tracking-tight pb-2 leading-tight drop-shadow-sm">
          Upcoming Events
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Discover and explore the latest activities, workshops, and meetups organized by your favorite clubs.
        </p>

        {/* Tab System for Selection */}
        <div className="mt-12 flex items-center justify-center p-1.5 bg-gray-100 rounded-2xl max-w-sm mx-auto shadow-inner border border-gray-200">
          <button
            onClick={() => setFilterFreeOnly(false)}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-black transition-all duration-300 ${
              !filterFreeOnly 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All Drops
          </button>
          <button
            onClick={() => setFilterFreeOnly(true)}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-black transition-all duration-300 ${
              filterFreeOnly 
                ? 'bg-white text-emerald-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Free Entry
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-8 flex items-center justify-center p-1 bg-white rounded-xl shadow-sm border border-gray-100 max-w-fit mx-auto">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === 'grid' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="List View"
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === 'list' 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <ListBulletIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
          <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No events found</h3>
          <p className="text-gray-500 mb-6">There are currently no events published in the system.</p>
          <a href="/create-event" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Create First Event
          </a>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          : "space-y-6 max-w-5xl mx-auto"
        }>
          {events
            .filter(e => !filterFreeOnly || (e.tickets && e.tickets.some(t => t.price === 0)))
            .map((event) => (
            <div 
              key={event._id} 
              className={`bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex ${
                viewMode === 'grid' ? 'flex-col transform hover:-translate-y-2' : 'flex-col sm:flex-row'
              }`}
            >

              {/* Event Image */}
              <div className={`relative overflow-hidden bg-gray-200 shrink-0 ${
                viewMode === 'grid' ? 'h-60 w-full' : 'h-64 sm:h-auto sm:w-72'
              }`}>
                {event.imageUrl ? (
                  <img
                    src={`http://localhost:5000/${event.imageUrl}`}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Event+Poster+Missing' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <CalendarIcon className="h-20 w-20 text-gray-300" />
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => { e.preventDefault(); toggleWishlist(event._id); }}
                  className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:scale-110 active:scale-95 transition-transform duration-200"
                  aria-label={isWishlisted(event._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWishlisted(event._id)
                    ? <HeartSolid className="w-5 h-5 text-rose-500" />
                    : <HeartIcon className="w-5 h-5 text-gray-400" />}
                </button>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className={`p-8 flex-1 flex flex-col ${viewMode === 'list' ? 'justify-center border-t sm:border-t-0 sm:border-l border-gray-50' : ''}`}>
                <h3 className={`${viewMode === 'grid' ? 'text-2xl' : 'text-2xl md:text-3xl'} font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1`}>{event.name}</h3>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {event.description}
                </p>

                <div className={`space-y-3 mb-8 ${viewMode === 'list' ? 'sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0' : ''}`}>
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
                    <span className="font-medium text-sm">
                      {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPinIcon className="h-5 w-5 mr-3 text-purple-500" />
                    <span className="font-medium text-sm line-clamp-1">{event.location}</span>
                  </div>
                  {event.tickets && event.tickets.length > 0 && (
                    <div className="flex items-center text-gray-700">
                      {Math.min(...event.tickets.map(t => t.price)) === 0 ? (
                        <div className="flex items-center text-emerald-600 font-black bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                          <TagIcon className="h-5 w-5 mr-2" />
                          FREE EVENT
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 mr-3 text-emerald-500" />
                          <span className="font-medium text-sm">
                            RS. {Math.min(...event.tickets.map(t => t.price)).toFixed(2)}+
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {event.promotions && event.promotions.length > 0 && (
                    <div className="flex items-center text-gray-700">
                      <TagIcon className="h-5 w-5 mr-3 text-amber-500" />
                      <span className="font-medium text-sm text-amber-600">
                        {event.promotions.length} Promos
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className={`mt-auto pt-6 border-t border-gray-100 ${viewMode === 'list' ? 'sm:max-w-xs' : ''}`}>
                  <Link to={`/event/${event._id}`} className={`w-full font-bold py-3 px-4 rounded-xl border border-gray-200 transition-colors duration-200 flex justify-center items-center ${
                    Math.min(...event.tickets.map(t => t.price)) === 0 
                    ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-gray-200' 
                    : 'bg-gray-50 hover:bg-blue-600 text-blue-600 hover:text-white hover:border-blue-200'
                  }`}>
                    {Math.min(...event.tickets.map(t => t.price)) === 0 ? 'View Details' : 'Book Tickets'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
