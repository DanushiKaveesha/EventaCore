import React from 'react';
import { useBookings } from '../hooks/useBookings';
import BookingCard from '../components/bookings/BookingCard';
import { 
  TicketIcon, 
  ArrowRightIcon, 
  SparklesIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const { bookings, loading, error } = useBookings();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin"></div>
          <SparklesIcon className="h-8 w-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-400 font-bold tracking-widest uppercase text-xs">Fetching your tickets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    Your Purchases
                </span>
            </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Bookings</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
            Track your event entries, download tickets, and manage your reservation history in one place.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm animate-fade-in-right">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <ShoppingBagIcon className="h-7 w-7 text-white" />
            </div>
            <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Bookings</p>
                <p className="text-2xl font-black text-gray-900">{bookings.length}</p>
            </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 mb-8 animate-shake">
          <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-red-900">Something went wrong</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 animate-fade-in">
          <div className="relative inline-block mb-8">
            <div className="h-24 w-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mx-auto">
                <TicketIcon className="h-12 w-12 text-gray-200" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center animate-bounce">
                <SparklesIcon className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">No Bookings Found</h3>
          <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">
            You haven't booked any events yet. Check out the latest events and get your tickets today!
          </p>
          <Link 
            to="/events" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200 active:scale-95 group"
          >
            Explore Events
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {bookings.map((booking, idx) => (
            <div key={booking._id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in-up">
                <BookingCard booking={booking} />
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {bookings.length > 0 && (
          <div className="mt-16 text-center border-t border-gray-100 pt-10">
              <p className="text-gray-400 text-sm font-medium">
                  Need help with your bookings? <a href="#" className="text-blue-600 font-bold hover:underline underline-offset-4">Contact Support</a>
              </p>
          </div>
      )}
    </div>
  );
};

export default MyBookings;
