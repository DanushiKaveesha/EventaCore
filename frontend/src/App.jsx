import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { UserGroupIcon, CalendarIcon, UserCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CreateClub from './pages/CreateClub';
import Clubs from './pages/Clubs';
import EditClub from './pages/EditClub';
import AdminDashboard from './pages/AdminDashboard';
import ClubsGallery from './pages/ClubsGallery';
import ClubDetails from './pages/ClubDetails';
import AdminClubDetails from './pages/AdminClubDetails';
import MyRequests from './pages/MyRequests';
import MyEventRequests from './pages/MyEventRequests';
import MyBookmarks from './pages/MyBookmarks';
import MembershipRequest from './pages/MembershipRequest';
import AdminRequests from './pages/AdminRequests';
import AdminPayments from './pages/AdminPayments';
import EventRegistration from './pages/EventRegistration';
import AdminEventRequests from './pages/AdminEventRequests';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyBookings from './pages/MyBookings';
import AdminEvents from './pages/admin/AdminEvents';
import AdminPaymentsPortal from './pages/admin/AdminPayments';
import AdminEventPayments from './pages/admin/AdminEventPayments';
import AdminClubPayments from './pages/admin/AdminClubPayments';
import AdminUsers from './pages/admin/AdminUsers';
import AdminClubs from './pages/admin/AdminClubs';
import AdminMemberships from './pages/admin/AdminMemberships';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#2563EB] mb-4">
                EventaCore
              </h1>
              <p className="text-gray-600">
                Header and Footer Demo
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link to="/clubs" className="px-6 py-3 bg-[#2563EB] text-white rounded-full text-sm font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-2">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>Browse Clubs</span>
                </Link>
                <Link to="/admin/clubs" className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center space-x-2">
                  <UserCircleIcon className="h-4 w-4 text-blue-500" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            </div>
          } />
          {/* Club Management Routes */}
          <Route path="/admin/clubs" element={<Clubs />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/event-requests" element={<AdminEventRequests />} />
          <Route path="/clubs" element={<ClubsGallery />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/clubs/:id/request" element={<MembershipRequest />} />
          <Route path="/clubs/:clubId/events/:eventId/register" element={<EventRegistration />} />
          <Route path="/admin/clubs/:id" element={<AdminClubDetails />} />
          <Route path="/create-club" element={<CreateClub />} />
          <Route path="/clubs/:id/edit" element={<EditClub />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-events" element={<MyEventRequests />} />
          <Route path="/my-bookmarks" element={<MyBookmarks />} />
          {/* Admin Dashboard / Event Management Route */}
          <Route path="/admin/events" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} /> {/* Default admin route */}
    <div className={`flex flex-col min-h-screen ${isAdminRoute ? 'bg-[#F8FAFC]' : 'bg-[#F9FAFB]'}`}>
      {!isAdminRoute && <Header />}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/payments" element={<AdminPaymentsPortal />} />
          <Route path="/admin/payments/events" element={<AdminEventPayments />} />
          <Route path="/admin/payments/clubs" element={<AdminClubPayments />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/clubs" element={<AdminClubs />} />
          <Route path="/admin/memberships" element={<AdminMemberships />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;