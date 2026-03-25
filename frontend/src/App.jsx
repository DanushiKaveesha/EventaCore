import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Basic Navbar across the app */}
      <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center font-bold text-xl">
              <span className="mr-2">📅</span> EventaCore
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="border-b-2 border-white px-1 pt-1 text-sm font-medium">Home</a>
              <a href="/events" className="border-transparent text-blue-100 hover:text-white px-1 pt-1 text-sm font-medium">Events</a>
              <a href="/clubs" className="border-transparent text-blue-100 hover:text-white px-1 pt-1 text-sm font-medium">Clubs</a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">JD</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
        </Routes>
      </main>
      
      {/* Basic Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2026 EventaCore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
