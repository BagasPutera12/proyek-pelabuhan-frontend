// frontend/src/App.jsx (VERSI FINAL)

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 1. Impor komponen-komponen baru
import Header from './components/Header';
import Footer from './components/Footer';
import SurveyModal from './components/SurveyModal';

import './App.css';

function App() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  const fetchShips = useCallback(async () => {
    try {
      // setLoading(true) dipindah agar tidak muncul saat re-fetch
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      setShips(response.data);
    } catch (err) {
      setError('Gagal mengambil data dari server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  const handleOpenModal = (ship) => {
    setSelectedShip(ship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShip(null);
  };

  // --- Perbaikan pada fungsi handleSubmitRating ---
  const handleSubmitRating = async (ratingData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/ratings`, ratingData);
      // 3. HILANGKAN alert() dari sini
      // alert('Terima kasih atas penilaian Anda!');

      // Ambil ulang data kapal agar ratingnya terupdate
      await fetchShips();
      
      // 4. Tutup modal SECARA OTOMATIS setelah data baru diambil
      handleCloseModal();
    } catch (err) {
      alert('Gagal mengirim penilaian. Mohon coba lagi.');
      console.error(err);
    }
  };


  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <div className="app-layout">
      {/* 2. Tampilkan komponen Header di sini */}
      <Header />

      <main className="container">
        <header className="page-title">
          <h1>Rating Kapal Penumpang</h1>
          <p>Pelabuhan Teluk Bayur</p>
        </header>
        <div className="ship-list">
          {ships.map((ship) => (
            <div key={ship._id} className="ship-card">
              <img src={ship.photo || 'https://placehold.co/600x400?text=Foto+Kapal'} alt={`Foto ${ship.name}`} className="ship-photo"/>
              <h3>{ship.name}</h3>
              <p className="description">{ship.description}</p>
              <div className="rating">⭐ {parseFloat(ship.avgRating).toFixed(1)}</div>
              <div className="links">
                <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer">Pesan Tiket</a>
                <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer">Lacak Kapal</a>
              </div>
              <button className="survey-button" onClick={() => handleOpenModal(ship)}>
                Beri Penilaian
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* 5. Tampilkan komponen Footer di sini */}
      <Footer />

      {isModalOpen && (
        <SurveyModal
          ship={selectedShip}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  );
}

export default App;
