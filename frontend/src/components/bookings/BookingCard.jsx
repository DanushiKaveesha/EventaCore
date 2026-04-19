import React from 'react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  TicketIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const BookingCard = ({ booking }) => {
  const { event, tickets, totalAmount, status, createdAt } = booking;

  const getStatusConfig = (status) => {
    switch(status) {
      case 'confirmed':
        return { 
          icon: <CheckCircleIcon className="h-5 w-5" />, 
          color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
          label: 'Confirmed'
        };
      case 'pending':
        return { 
          icon: <ClockIcon className="h-5 w-5" />, 
          color: 'text-amber-700 bg-amber-50 border-amber-100',
          label: 'Pending Approval'
        };
      case 'rejected':
        return { 
          icon: <XCircleIcon className="h-5 w-5" />, 
          color: 'text-red-700 bg-red-50 border-red-100',
          label: 'Rejected'
        };
      case 'cancelled':
        return { 
          icon: <XCircleIcon className="h-5 w-5 text-gray-400" />, 
          color: 'text-gray-700 bg-gray-50 border-gray-100',
          label: 'Cancelled'
        };
      default:
        return { 
          icon: <InformationCircleIcon className="h-5 w-5" />, 
          color: 'text-blue-700 bg-blue-50 border-blue-100',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Event Image */}
      <div className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
        <img 
          src={event?.imageUrl ? `http://localhost:5000/${event.imageUrl}` : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop'} 
          alt={event?.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${config.color}`}>
            {config.icon}
            {config.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{event?.name || 'Untitled Event'}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Booked on {new Date(createdAt).toLocaleDateString()}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600 font-medium">
            <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
            {event?.date ? new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBD'}
          </div>
          <div className="flex items-center text-sm text-gray-600 font-medium">
            <MapPinIcon className="h-5 w-5 mr-3 text-purple-500" />
            {event?.location || 'Digital Event'}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <TicketIcon className="h-5 w-5 mr-3 text-emerald-500" />
            <span className="font-bold">
                {tickets.map((t, idx) => (
                    <span key={idx}>
                        {t.quantity}x {t.type}{idx < tickets.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
            <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Total Amount</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900">RS. {totalAmount.toFixed(2)}</span>
                    <span className="text-xs font-bold text-gray-400">LKR</span>
                </div>
            </div>
            <button className="px-5 py-2.5 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
              Details
            </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
