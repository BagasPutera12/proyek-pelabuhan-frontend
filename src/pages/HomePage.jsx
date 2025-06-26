// frontend/src/pages/HomePage.jsx (FINAL DENGAN TAMPILAN HASIL SURVEI)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 
import PortSurveyModal from '../components/PortSurveyModal';

function HomePage() {
  const [ships, setShips] = useState([]);
  // 1. State baru untuk menampung data ringkasan survei
  const [surveySummary, setSurveySummary] = useState({ averageRatings: [], recentSuggestions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPortSurveyModalOpen, setIsPortSurveyModalOpen] = useState(false);

  // 2. Gabungkan semua pengambilan data dalam satu fungsi
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const shipsPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      const surveySummaryPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/port-surveys/summary`);

      // Jalankan keduanya secara bersamaan
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

  // Fungsi untuk menutup modal dan refresh data
  const handleCloseSurveyModal = () => {
    setIsPortSurveyModalOpen(false);
    // Ambil ulang data summary agar saran baru langsung muncul
    fetchData(); 
  }

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <>
      <div className="container">
        {/* ... Bagian header dan daftar kapal tidak berubah ... */}

        <section className="port-survey-section">
          {/* ... Bagian tombol survei tidak berubah ... */}
        </section>

        {/* --- 3. BAGIAN BARU UNTUK MENAMPILKAN HASIL --- */}
        <div className="survey-summary-section">
          <h3>Ringkasan Masukan Pengguna</h3>

          {/* Menampilkan 3 saran terbaru */}
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

          {/* Tombol untuk melihat semua masukan */}
          <Link to="/masukan" className="view-all-button">
            Lihat Semua Masukan & Rata-rata Penilaian
          </Link>
        </div>
        {/* --- AKHIR BAGIAN BARU --- */}

      </div>

      {isPortSurveyModalOpen && (
        <PortSurveyModal 
          onClose={handleCloseSurveyModal}
        />
      )}
    </>
  );
}

export default HomePage;