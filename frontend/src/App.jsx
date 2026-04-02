import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserGroupIcon, CalendarIcon, UserCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// Layout Imports
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// My Branch Imports (Club Memberships & Events)
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

// firstMerge Branch Imports (Core System)
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
import ContactUs from './pages/ContactUs';

function App() {
  console.log("App.jsx: Rendering");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  return (
    <div className={`flex flex-col min-h-screen ${isAdminRoute ? 'bg-[#F8FAFC]' : 'bg-[#F9FAFB]'}`}>
      {!isAdminRoute && <Header />}
      <main className="flex-grow w-full">
        <Routes>
          {/* Base Platform Routes (from firstMerge) */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Club Membership Routes (our feature branch) */}
          <Route path="/clubs" element={<ClubsGallery />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/clubs/:id/request" element={<MembershipRequest />} />
          <Route path="/clubs/:clubId/events/:eventId/register" element={<EventRegistration />} />
          <Route path="/create-club" element={<CreateClub />} />
          <Route path="/clubs/:id/edit" element={<EditClub />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/my-events" element={<MyEventRequests />} />
          <Route path="/my-bookmarks" element={<MyBookmarks />} />

          {/* Unified Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} /> 
          
          {/* From firstMerge Admin Panel */}
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/payments" element={<AdminPaymentsPortal />} />
          <Route path="/admin/payments/events" element={<AdminEventPayments />} />
          <Route path="/admin/payments/memberships" element={<AdminPayments />} />
          <Route path="/admin/payments/clubs" element={<AdminClubPayments />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/clubs" element={<AdminClubs />} />
          <Route path="/admin/memberships" element={<AdminMemberships />} />

          {/* From our feature branch Admin Panel */}
          <Route path="/admin/clubs-gallery" element={<Clubs />} />
          <Route path="/admin/clubs/:id" element={<AdminClubDetails />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/event-requests" element={<AdminEventRequests />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
