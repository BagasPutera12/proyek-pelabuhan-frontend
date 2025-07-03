// frontend/src/pages/HomePage.jsx (PERBAIKAN FINAL UNTUK HEROKU)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 
import PortSurveyModal from '../components/PortSurveyModal';
import { ASPECTS } from '../data/surveyData.js';

const StarRatingDisplay = ({ rating }) => {
  const totalStars = 5;
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
  const [summary, setSummary] = useState({ overallAverage: 0, aspectAverages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState(null);

  const fetchData = useCallback(async () => {
    // Jangan set loading di sini agar tidak berkedip saat refresh
    try {
      // --- BAGIAN YANG DIUBAH ---
      // Minta data kapal, tunggu sampai selesai.
      const shipsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      if (Array.isArray(shipsResponse.data)) {
        setShips(shipsResponse.data);
      } else {
        setShips([]);
      }

      // SETELAH data kapal selesai, BARU minta data summary.
      const summaryResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/port-surveys/summary`);
      if (summaryResponse.data) {
        setSummary(summaryResponse.data);
      }
      // --- AKHIR BAGIAN YANG DIUBAH ---

    } catch (err) {
      console.error('Gagal mengambil data:', err);
      setError('Gagal mengambil data dari server. Coba refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Kita panggil fetchData hanya sekali saat halaman dimuat
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (aspect) => {
    setSelectedAspect(aspect);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAspect(null);
    fetchData(); 
  };

  if (loading) return <div className="container" style={{textAlign: 'center'}}><h1>Loading...</h1></div>;
  if (error) return <div className="container" style={{textAlign: 'center'}}><h1>{error}</h1></div>;

  return (
    <>
      <div>
        <section className="hero-section">
          <h1>Website Rating Pelabuhan Teluk Bayur</h1>
          <p className="intro-text">
            Pelabuhan Teluk Bayur, yang terletak di Kota Padang, Sumatera Barat, merupakan salah satu pelabuhan tertua di Indonesia dan pintu gerbang utama arus barang ekspor-impor di wilayah barat Sumatera. Dibangun sejak 1893 dan kini dikelola oleh PT Pelindo (Persero), pelabuhan ini telah menerapkan standar pelayanan berbasis ISO 9002. Survei ini disusun berdasarkan Peraturan Menteri Perhubungan Nomor PM 37 Tahun 2015 tentang Indeks Kepuasan Pengguna Jasa, guna mengukur dan meningkatkan kualitas pelayanan pelabuhan secara berkelanjutan.
          </p>
          <div className="overall-rating-summary">
            <StarRatingDisplay rating={summary.overallAverage} />
            <p className="overall-rating-text">
              Rating Keseluruhan: <strong>{summary.overallAverage.toFixed(2)}</strong> dari 5
            </p>
          </div>
        </section>

        <main className="container">
          <h2 className="aspects-title">Klik untuk Memberi Penilaian per Aspek</h2>
          <div className="aspects-grid">
            {ASPECTS.map((aspect) => {
              const aspectData = summary.aspectAverages.find(a => a.aspect === aspect.name);
              const rating = aspectData ? aspectData.averageRating : 0;

              return (
                <div key={aspect.name} className="aspect-card" onClick={() => handleOpenModal(aspect)}>
                  <h3>{aspect.name}</h3>
                  <StarRatingDisplay rating={rating} />
                  <p>({rating.toFixed(2)})</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <PortSurveyModal 
          aspect={selectedAspect}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default HomePage;