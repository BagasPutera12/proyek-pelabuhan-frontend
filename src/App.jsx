// frontend/src/App.jsx (VERSI BARU SEBAGAI ROUTER)

import { Routes, Route } from 'react-router-dom';

// Impor komponen layout dan halaman
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShipDetailPage from './pages/ShipDetailPage';
import FeedbackPage from './pages/FeedbackPage';

import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main>
        <Routes>
          {/* Rute untuk Halaman Utama */}
          <Route path="/" element={<HomePage />} />

          {/* Rute untuk Halaman Detail Kapal */}
          <Route path="/ship/:id" element={<ShipDetailPage />} />
          <Route path="/masukan" element={<FeedbackPage />} /> {/* <-- 2. TAMBAHKAN RUTE BARU */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;