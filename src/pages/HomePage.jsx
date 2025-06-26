// frontend/src/pages/HomePage.jsx (FINAL DENGAN FITUR SURVEI PELABUHAN)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 
import PortSurveyModal from '../components/PortSurveyModal'; // <-- 1. Impor modal baru

function HomePage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. State baru untuk mengontrol modal survei pelabuhan
  const [isPortSurveyModalOpen, setIsPortSurveyModalOpen] = useState(false);

  // Logika untuk mengambil data kapal (tidak berubah)
  const fetchShips = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      if (Array.isArray(response.data)) {
        setShips(response.data);
      } else {
        setShips([]);
      }
    } catch (err) {
      console.error('Gagal mengambil data kapal:', err);
      setError('Gagal mengambil data dari server. Coba refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  // 3. Fungsi baru untuk mengirim data survei pelabuhan
  const handlePortSurveySubmit = async (surveyData) => {
    try {
      // Menampilkan pesan loading atau status pengiriman
      alert('Mengirim survei Anda...');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/port-surveys`, surveyData);
      alert(response.data.message || 'Terima kasih atas masukan Anda!');
      setIsPortSurveyModalOpen(false); // Tutup modal setelah berhasil
    } catch (err) {
      alert('Gagal mengirim survei. Mohon coba lagi.');
      console.error("Error submitting port survey:", err);
    }
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  // Tampilan utama sekarang dibungkus dengan Fragment <> ... </>
  return (
    <>
      <div className="container">
        <header className="page-title">
          <h1>Website Rating Kapal</h1>
          <p>Pelabuhan Teluk Bayur</p>
        </header>
        <div className="ship-list">
          {ships.length > 0 ? (
            ships.map((ship) => (
              <div key={ship._id} className="ship-card">
                <Link to={`/ship/${ship._id}`} className="ship-card-link-area">
                  <img 
                    src={ship.photo || 'https://placehold.co/600x400?text=Foto+Kapal'} 
                    alt={ship.name || 'Nama Kapal'}
                    className="ship-photo"
                  />
                  <h3>{ship.name}</h3>
                  <div className="rating">
                    ⭐ {typeof ship.avgRating === 'number' ? parseFloat(ship.avgRating).toFixed(1) : 'N/A'}
                  </div>
                </Link>
                <div className="links">
                  <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Pesan Tiket</a>
                  <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Lacak Kapal</a>
                </div>
              </div>
            ))
          ) : (
            <p>Belum ada data kapal yang tersedia.</p>
          )}
        </div>

        {/* --- 4. BAGIAN BARU UNTUK TOMBOL SURVEI --- */}
        <section className="port-survey-section">
          <h2>Bantu Kami Menjadi Lebih Baik</h2>
          <p>Bagaimana pendapat Anda mengenai fasilitas dan pelayanan di pelabuhan kami? Berikan masukan Anda melalui survei singkat di bawah ini.</p>
          <button 
            className="open-survey-button"
            onClick={() => setIsPortSurveyModalOpen(true)}
          >
            Berikan Masukan Anda
          </button>
        </section>
        {/* --- AKHIR BAGIAN BARU --- */}

      </div>

      {/* 5. Tampilkan modal jika state-nya true */}
      {isPortSurveyModalOpen && (
        <PortSurveyModal 
          onClose={() => setIsPortSurveyModalOpen(false)}
          onSubmit={handlePortSurveySubmit}
        />
      )}
    </>
  );
}

export default HomePage;