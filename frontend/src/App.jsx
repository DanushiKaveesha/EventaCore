import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { UserGroupIcon, CalendarIcon, UserCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

// Layout Imports
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Chatbot from './components/Chatbot/Chatbot';

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
import AdminReviews from './pages/admin/AdminReviews';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// Auth and User Management
import Login from './components/Login';
import SignUpMultiStep from './components/SignUpMultiStep';
import ForgotPassword from './pages/ForgotPassword';
import Notifications from './pages/Notifications';

// Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// User Profile and Settings
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SecuritySettings from './pages/SecuritySettings';
import EditAccount from './pages/EditAccount';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';

// Main application router and global session activity tracker
function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname === '/dashboard';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isEditAccountRoute = location.pathname === '/edit-account';

  return (
    <div className={`flex flex-col min-h-screen ${isAdminRoute ? 'bg-[#F8FAFC]' : 'bg-[#F9FAFB]'}`}>
      {!isAdminRoute && !isEditAccountRoute && <Header />}
      <main className="flex-grow w-full">
        <Routes>
          {/* Base Platform Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><SignUpMultiStep /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignUpMultiStep /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* User Options */}
          <Route path="/profile" element={<ProtectedRoute userOnly={true}><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute userOnly={true}><Settings /></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute userOnly={true}><SecuritySettings /></ProtectedRoute>} />
          <Route path="/edit-account" element={<ProtectedRoute><EditAccount /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute userOnly={true}><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute userOnly={true}><CalendarView /></ProtectedRoute>} />

          <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/edit-event/:id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/my-bookings" element={<ProtectedRoute userOnly={true}><MyBookings /></ProtectedRoute>} />

          {/* Club Membership Routes */}
          <Route path="/clubs" element={<ClubsGallery />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/clubs/:id/request" element={<ProtectedRoute userOnly={true}><MembershipRequest /></ProtectedRoute>} />
          <Route path="/clubs/:clubId/events/:eventId/register" element={<ProtectedRoute userOnly={true}><EventRegistration /></ProtectedRoute>} />
          <Route path="/create-club" element={<ProtectedRoute><CreateClub /></ProtectedRoute>} />
          <Route path="/clubs/:id/edit" element={<ProtectedRoute><EditClub /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute userOnly={true}><MyRequests /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute userOnly={true}><MyEventRequests /></ProtectedRoute>} />
          <Route path="/my-bookmarks" element={<ProtectedRoute userOnly={true}><MyBookmarks /></ProtectedRoute>} />

          {/* Unified Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute adminOnly={true}><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute adminOnly={true}><AdminPaymentsPortal /></ProtectedRoute>} />
          <Route path="/admin/payments/events" element={<ProtectedRoute adminOnly={true}><AdminEventPayments /></ProtectedRoute>} />
          <Route path="/admin/payments/memberships" element={<ProtectedRoute adminOnly={true}><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/payments/clubs" element={<ProtectedRoute adminOnly={true}><AdminClubPayments /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/clubs" element={<ProtectedRoute adminOnly={true}><AdminClubs /></ProtectedRoute>} />
          <Route path="/admin/memberships" element={<ProtectedRoute adminOnly={true}><AdminMemberships /></ProtectedRoute>} />
          <Route path="/admin/clubs-gallery" element={<ProtectedRoute adminOnly={true}><Clubs /></ProtectedRoute>} />
          <Route path="/admin/clubs/:id" element={<ProtectedRoute adminOnly={true}><AdminClubDetails /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute adminOnly={true}><AdminRequests /></ProtectedRoute>} />
          <Route path="/admin/event-requests" element={<ProtectedRoute adminOnly={true}><AdminEventRequests /></ProtectedRoute>} />
          <Route path="/admin/ratings" element={<ProtectedRoute adminOnly={true}><AdminReviews /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAdminRoute && !isEditAccountRoute && <Footer />}
      <Chatbot />
    </div>
  );
}

export default App;
