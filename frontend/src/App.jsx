import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CreateClub from './pages/CreateClub';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#2563EB] mb-4">
                EventaCore
              </h1>
              <p className="text-gray-600">
                Header and Footer Demo
              </p>
            </div>
          } />
          <Route path="/create-club" element={<CreateClub />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;