import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Upload from '../pages/Upload';
import Auth from '../pages/Auth';
import RouteDetailScreen from '../pages/RouteDetailScreen';
import { AboutScreen } from '../pages/Aboutscreen';
import { LegalScreen } from '../pages/Legalscreen';
import VerifyRedirect from '../pages/VerifyRedirect';

const AppRouter: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/route/:routeId" element={<RouteDetailScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/legal" element={<LegalScreen />} />
          <Route path="/verify/:token" element={<VerifyRedirect />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRouter;