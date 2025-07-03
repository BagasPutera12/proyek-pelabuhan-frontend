// frontend/src/pages/HomePage.jsx (FINAL DENGAN MODAL DINAMIS)

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
  const [summary, setSummary] = useState({ overallAverage: 0, aspectAverages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk mengelola modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState(null);

  const fetchData = useCallback(async () => {
    // Jangan set loading di sini agar tidak berkedip saat refresh data
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/aspect-ratings/summary`);
      if (response.data) {
        setSummary(response.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data summary:', err);
      setError('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi untuk membuka modal dengan data aspek yang diklik
  const handleOpenModal = (aspect) => {
    setSelectedAspect(aspect);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal dan me-refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAspect(null);
    // Ambil data terbaru setelah survei ditutup untuk update rating
    fetchData(); 
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <>
      <div>
        <section className="hero-section">
          <h1>Website Rating Pelabuhan Teluk Bayur</h1>
          <p className="intro-text">
            Pelabuhan Teluk Bayur, yang terletak di Kota Padang, Sumatera Barat, merupakan salah satu pelabuhan tertua di Indonesia... (dst)
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
                // Tambahkan onClick di sini
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

      {/* Render modal dengan prop yang benar */}
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