// frontend/src/App.jsx (VERSI BARU)

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import SurveyModal from './components/SurveyModal'; // <-- 1. Impor komponen modal

function App() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State untuk Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShip, setSelectedShip] = useState(null);

  // --- Fungsi untuk mengambil data kapal ---
  // Kita bungkus dengan useCallback agar tidak dibuat ulang terus-menerus
  const fetchShips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      setShips(response.data);
    } catch (err) {
      setError('Gagal mengambil data dari server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Jalankan fetchShips saat komponen pertama kali dimuat
  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  // --- Fungsi-fungsi untuk menangani Modal ---
  const handleOpenModal = (ship) => {
    setSelectedShip(ship);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShip(null);
  };

  const handleSubmitRating = async (ratingData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/ratings`, ratingData);
      alert('Terima kasih atas penilaian Anda!');
      handleCloseModal();
      // Ambil ulang data kapal agar ratingnya terupdate
      fetchShips();
    } catch (err) {
      alert('Gagal mengirim penilaian. Mohon coba lagi.');
      console.error(err);
    }
  };


  // --- Tampilan ---
  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <> {/* Gunakan Fragment agar bisa menampung modal di luar .container */}
      <div className="container">
        <header>
          <h1>🚢 Rating Kapal Penumpang</h1>
          <p>Pelabuhan Teluk Bayur</p>
        </header>
        <main>
          <h2>Daftar Kapal</h2>
          <div className="ship-list">
            {ships.map((ship) => (
              <div key={ship._id} className="ship-card">
                <img src={ship.photo || 'https://via.placeholder.com/300x200.png?text=Foto+Kapal'} alt={`Foto ${ship.name}`} className="ship-photo"/>
                <h3>{ship.name}</h3>
                <p className="description">{ship.description}</p>
                <div className="rating">⭐ {parseFloat(ship.avgRating).toFixed(1)}</div>
                <div className="links">
                  <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer">Pesan Tiket</a>
                  <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer">Lacak Kapal</a>
                </div>
                {/* 2. Tambahkan onClick untuk membuka modal */}
                <button className="survey-button" onClick={() => handleOpenModal(ship)}>
                  Beri Penilaian
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* 3. Tampilkan modal jika isModalOpen adalah true */}
      {isModalOpen && (
        <SurveyModal
          ship={selectedShip}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRating}
        />
      )}
    </>
  );
}

export default App;
