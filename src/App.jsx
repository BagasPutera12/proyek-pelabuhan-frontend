// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Impor komponen layout dan halaman
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShipListPage from './pages/ShipListPage'; // Halaman baru untuk daftar kapal
import ShipDetailPage from './pages/ShipDetailPage';
import FeedbackPage from './pages/FeedbackPage';

import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kapal" element={<ShipListPage />} /> {/* Rute baru untuk daftar kapal */}
          <Route path="/kapal/:id" element={<ShipDetailPage />} /> {/* Ubah dari /ship ke /kapal */}
          <Route path="/masukan" element={<FeedbackPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;