import React from 'react';
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
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
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
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;