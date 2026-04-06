import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getCurrentUser } from '../utils/getCurrentUser';
import { getSriLankanHolidays } from '../utils/sriLankanHolidays';
import { getEvents } from '../services/eventService';

// Monthly calendar interface integrated with dynamic Sri Lankan holidays
const CalendarView = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events for calendar", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate total days for the currently selected month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Determine which day of the week the month starts on (0 = Monday, 6 = Sunday)
  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Make Monday 0, Sunday 6
  };

  // Navigate calendar state strictly to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  // Pad the empty cells before the first day of the current month
  const previousMonthDays = getDaysInMonth(new Date(currentYear, currentMonth - 1, 1));
  const paddingDays = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    paddingDays.push(previousMonthDays - i);
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (dateNum) => {
    const today = new Date();
    return dateNum === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const holidayColors = [
    'bg-emerald-50 border-emerald-400 text-emerald-700',
    'bg-indigo-50 border-indigo-400 text-indigo-700',
    'bg-blue-50 border-blue-400 text-blue-700',
    'bg-amber-50 border-amber-400 text-amber-800',
    'bg-purple-50 border-purple-400 text-purple-700',
    'bg-teal-50 border-teal-400 text-teal-700',
    'bg-pink-50 border-pink-400 text-pink-700',
    'bg-cyan-50 border-cyan-400 text-cyan-700'
  ];

  // You can dynamically populate this array with real data later
  const mockEvents = [];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Please log in</h2>
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* Top Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start items-center h-16">
            <Link to="/dashboard" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          
          {/* Controls Header - Ultra Clean Layout */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
            
            {/* Month/Year Title & Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full xl:w-auto">
               <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight min-w-[220px]">
                 {monthNames[currentMonth]} {currentYear}
               </h2>
               
               <div className="flex items-center bg-slate-100 rounded-lg p-1 shadow-inner">
                 <button onClick={goToPreviousMonth} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 transition-all focus:outline-none">
                   <ChevronLeftIcon className="w-5 h-5" />
                 </button>
                 <button onClick={goToToday} className="px-4 py-1.5 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm rounded-md transition-all focus:outline-none">
                   Today
                 </button>
                 <button onClick={goToNextMonth} className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-slate-600 transition-all focus:outline-none">
                   <ChevronRightIcon className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </div>

          {/* Core Calendar Grid Structure Frame */}
          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] bg-white block w-full">
            <div className="min-w-[800px] flex flex-col h-full">
              
              {/* Days of Week Header using strict inline grid to prevent stacking breakdown */}
              <div className="border-b border-slate-200 bg-slate-50/80" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                {dayNames.map((dayName) => (
                  <div key={dayName} className={`py-3 text-center text-[11px] font-extrabold uppercase tracking-widest ${dayName === 'Sun' ? 'text-rose-500' : 'text-slate-500'} border-r border-slate-200 last:border-r-0`}>
                    {dayName}
                  </div>
                ))}
              </div>

              {/* Main Day Cells using strict inline grid */}
              <div className="bg-white" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                
                {/* Padding Previous Month */}
                {paddingDays.map((dateNum, idx) => {
                  const isSunday = idx % 7 === 6;
                  return (
                    <div 
                      key={`prev-${idx}`} 
                      className={`min-h-[130px] p-2 border-r border-b border-slate-100 last:border-r-0 ${isSunday ? 'bg-rose-50/20' : 'bg-slate-50/50'}`}
                    >
                      <div className="flex justify-center mb-1.5 mt-2">
                        <span className={`flex items-center justify-center w-8 h-8 text-sm font-bold ${isSunday ? 'text-rose-400/80' : 'text-slate-400/80'}`}>{dateNum}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Current Month Active Cells */}
                {days.map((dateNum, idx) => {
                  const dayEvents = events.filter(e => {
                      const eventDate = new Date(e.date);
                      return eventDate.getDate() === dateNum && 
                             eventDate.getMonth() === currentMonth && 
                             eventDate.getFullYear() === currentYear;
                  });

                  const isCurrentDay = isToday(dateNum);
                  const isSunday = (paddingDays.length + idx) % 7 === 6;
                  
                  const monthHolidays = getSriLankanHolidays(currentYear, currentMonth);
                  const holidayName = monthHolidays[dateNum];
                  const isHoliday = !!holidayName;
                  const isRedDay = isSunday || isHoliday;
                  
                  return (
                    <div 
                      key={`curr-${dateNum}`} 
                      className={`min-h-[130px] border-r border-b border-slate-100 hover:bg-slate-50/80 transition-colors relative group flex flex-col overflow-hidden ${isRedDay ? 'bg-rose-50/10' : ''}`}
                    >
                      {/* Background Image for Event */}
                      {dayEvents.length > 0 && dayEvents[0].imageUrl && (
                        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-900 pointer-events-none">
                          <img 
                            src={`http://localhost:5000/${dayEvents[0].imageUrl}`} 
                            alt={dayEvents[0].name}
                            className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}

                      {/* Cell Content Wrapper (relative z-10 above background) */}
                      <div className="relative z-10 flex flex-col h-full w-full p-2 sm:p-2.5">
                        <div className="flex justify-between items-start mb-1.5 mt-2">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full text-[15px] font-bold transition-all
                            ${isCurrentDay 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-white/90 shadow-sm backdrop-blur-sm ' + (isRedDay ? 'text-rose-500 group-hover:bg-rose-50 group-hover:text-rose-600' : 'text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700')}`}>
                            {dateNum}
                          </span>
                          
                          {/* If multiple events, we display a badge */}
                          {dayEvents.length > 1 && (
                            <div className="bg-white/95 backdrop-blur-sm shadow-sm text-indigo-700 border border-indigo-200 text-xs font-bold px-2 py-1 rounded-full">
                              +{dayEvents.length - 1} More
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1.5 mt-auto mb-auto">
                        {holidayName && (
                          <div 
                            className={`text-[11px] px-2 py-1.5 rounded truncate font-bold text-left shadow-sm transition-all hover:shadow hover:-translate-y-px cursor-pointer border-l-[3px] bg-rose-50 border-rose-400 text-rose-700`}
                            title={holidayName}
                          >
                            {holidayName}
                          </div>
                        )}
                        {dayEvents.map((evt, evtIdx) => (
                          <Link 
                            key={evtIdx} 
                            to={`/event/${evt._id}`}
                            className={`text-[11px] px-2 py-1.5 rounded truncate font-bold text-left shadow-sm transition-all hover:shadow hover:-translate-y-px cursor-pointer border-l-[3px] bg-indigo-50 border-indigo-400 text-indigo-700`}
                            title={evt.name}
                          >
                            {evt.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    </div>
                  );
                })}

                {/* Padding Next Month */}
                {Array.from({ length: (7 - ((paddingDays.length + daysInMonth) % 7)) % 7 }).map((_, idx) => {
                  const isSunday = (paddingDays.length + daysInMonth + idx) % 7 === 6;
                  return (
                    <div 
                      key={`next-${idx}`} 
                      className={`min-h-[130px] p-2 border-r border-b border-slate-100 last:border-r-0 ${isSunday ? 'bg-rose-50/20' : 'bg-slate-50/50'}`}
                    >
                      <div className="flex justify-center mb-1.5 mt-2">
                        <span className={`flex items-center justify-center w-8 h-8 text-sm font-bold ${isSunday ? 'text-rose-400/80' : 'text-slate-400/80'}`}>{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
                
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CalendarView;
