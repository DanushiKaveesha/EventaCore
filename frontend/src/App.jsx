import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import Events from './pages/Events';
import AdminEvents from './pages/admin/AdminEvents';
import Home from './pages/Home';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin/events" element={<AdminEvents />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;