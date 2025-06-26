// frontend/src/pages/HomePage.jsx (FINAL LENGKAP DENGAN RATING BINTANG)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 
import PortSurveyModal from '../components/PortSurveyModal';

// 1. KOMPONEN KECIL UNTUK MENAMPILKAN BINTANG
// Dibuat di sini agar praktis, tugasnya hanya mengubah angka menjadi ikon bintang.
const StarRatingDisplay = ({ rating }) => {
  const totalStars = 5;
  // Bulatkan rating ke angka terdekat untuk menentukan jumlah bintang kuning
  const filledStars = Math.round(rating); 

  return (
    <div className="star-rating-display">
      {[...Array(totalStars)].map((_, index) => (
        <span key={index} className={index < filledStars ? 'filled' : ''}>★</span>
      ))}
    </div>
  );
};


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

      if (Array.isArray(shipsResponse.data)) {
        setShips(shipsResponse.data);
      } else {
        setShips([]);
      }
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

  const handleCloseSurveyModal = () => {
    setIsPortSurveyModalOpen(false);
    fetchData(); 
  };

  // 2. FUNGSI UNTUK MENGHITUNG RATA-RATA DARI SEMUA ASPEK
  const calculateOverallAverage = () => {
    const ratings = surveySummary.averageRatings;
    if (!ratings || ratings.length === 0) {
      return 0; // Kembalikan 0 jika tidak ada data rating
    }
    const sum = ratings.reduce((total, item) => total + item.averageRating, 0);
    return sum / ratings.length;
  };

  const overallAverage = calculateOverallAverage();


  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <>
      <div className="container">
        {/* --- 3. BAGIAN HEADER YANG TELAH DIPERBARUI --- */}
        <header className="page-title">
          <h1>Website Rating Pelabuhan Teluk Bayur</h1>
          <StarRatingDisplay rating={overallAverage} />
          <p className="overall-rating-text">
            Rating Pelabuhan: <strong>{overallAverage.toFixed(2)}</strong>/5
          </p>
        </header>

        <h2>Rating per Kapal</h2>
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
        />
      )}
    </>
  );
}

export default HomePage;