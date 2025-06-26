// frontend/src/pages/HomePage.jsx (VERSI FINAL LENGKAP)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 
import PortSurveyModal from '../components/PortSurveyModal';

function HomePage() {
  const [ships, setShips] = useState([]);
  const [surveySummary, setSurveySummary] = useState({ averageRatings: [], recentSuggestions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPortSurveyModalOpen, setIsPortSurveyModalOpen] = useState(false);

  // Fungsi untuk mengambil semua data yang dibutuhkan halaman ini
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const shipsPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      const surveySummaryPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/port-surveys/summary`);

      // Jalankan keduanya secara bersamaan untuk efisiensi
      const [shipsResponse, summaryResponse] = await Promise.all([shipsPromise, surveySummaryPromise]);

      // Set state untuk kapal
      if (Array.isArray(shipsResponse.data)) {
        setShips(shipsResponse.data);
      } else {
        setShips([]);
      }

      // Set state untuk ringkasan survei
      if (summaryResponse.data) {
        setSurveySummary(summaryResponse.data);
      }

    } catch (err) {
      console.error('Gagal mengambil data:', err);
      setError('Gagal mengambil data dari server. Coba refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi untuk menutup modal dan refresh data agar saran baru muncul
  const handleCloseSurveyModal = () => {
    setIsPortSurveyModalOpen(false);
    fetchData(); 
  };

  // Fungsi yang akan dipanggil dari dalam modal
  // Kita tidak perlu memindah logika POST ke sini, modal sudah menanganinya
  // Kita hanya perlu memastikan data di-refresh setelah modal ditutup
  const handleSurveySubmit = () => {
    // Logika ini sekarang ada di dalam PortSurveyModal,
    // tapi kita tetap butuh fungsi ini untuk di-pass sebagai prop jika diperlukan
    // Untuk sekarang, kita refresh datanya di onClose
    console.log("Survei telah dikirim dari modal.");
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <>
      <div className="container">
        <header className="page-title">
          <h1>Website Rating Kapal</h1>
          <p>Pelabuhan Teluk Bayur</p>
        </header>

        {/* Bagian Daftar Kapal */}
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

        {/* Bagian Tombol Survei Pelabuhan */}
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

        {/* Bagian Ringkasan Hasil Survei */}
        <div className="survey-summary-section">
          <h3>Ringkasan Masukan Pengguna</h3>
          
          <div className="recent-suggestions-list">
            <h4>Saran Terbaru:</h4>
            {surveySummary.recentSuggestions && surveySummary.recentSuggestions.length > 0 ? (
              surveySummary.recentSuggestions.map((item) => (
                <div key={item._id} className="suggestion-card">
                  <p>"{item.suggestion}"</p>
                  <small>
                    Dikirim pada: {new Date(item.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </small>
                </div>
              ))
            ) : (
              <p>Belum ada saran yang masuk.</p>
            )}
          </div>
          
          <Link to="/masukan" className="view-all-button">
            Lihat Semua Masukan & Rata-rata Penilaian
          </Link>
        </div>
      </div>

      {/* Render Modal Survei Pelabuhan */}
      {isPortSurveyModalOpen && (
        <PortSurveyModal 
          onClose={handleCloseSurveyModal}
          onSubmit={handleSurveySubmit} // onSubmit bisa di-pass walaupun logika utama ada di dalam modal
        />
      )}
    </>
  );
}

export default HomePage;