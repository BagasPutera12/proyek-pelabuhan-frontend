// frontend/src/pages/HomePage.jsx (VERSI SEDERHANA TANPA MODAL)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 
// Import PortSurveyModal sudah tidak diperlukan lagi di sini
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

  // State dan fungsi untuk modal sudah dihapus dari sini

  const fetchData = useCallback(async () => {
    try {
      const summaryResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/aspect-ratings/summary`);
      if (summaryResponse.data) {
        setSummary(summaryResponse.data);
      }
    } catch (err) {
      console.error('Gagal mengambil data:', err);
      setError('Gagal mengambil data dari server. Coba refresh halaman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const overallAverage = summary.overallAverage || 0;

  if (loading) return <div className="container" style={{textAlign: 'center'}}><h1>Loading...</h1></div>;
  if (error) return <div className="container" style={{textAlign: 'center'}}><h1>{error}</h1></div>;

  return (
    // Fragment <> dan </> tidak lagi diperlukan karena modal sudah hilang
    <div>
      <section className="hero-section">
        <h1>Website Rating Pelabuhan Teluk Bayur</h1>
        <p className="intro-text">
          Pelabuhan Teluk Bayur, yang terletak di Kota Padang, Sumatera Barat, merupakan salah satu pelabuhan tertua di Indonesia dan pintu gerbang utama arus barang ekspor-impor di wilayah barat Sumatera. Dibangun sejak 1893 dan kini dikelola oleh PT Pelindo (Persero), pelabuhan ini telah menerapkan standar pelayanan berbasis ISO 9002. Survei ini disusun berdasarkan Peraturan Menteri Perhubungan Nomor PM 37 Tahun 2015 tentang Indeks Kepuasan Pengguna Jasa, guna mengukur dan meningkatkan kualitas pelayanan pelabuhan secara berkelanjutan.
        </p>
        <div className="overall-rating-summary">
          <StarRatingDisplay rating={overallAverage} />
          <p className="overall-rating-text">
            Rating Keseluruhan: <strong>{overallAverage.toFixed(2)}</strong> dari 5
          </p>
        </div>
      </section>

      <main className="container">
        <h2 className="aspects-title">Penilaian per Aspek</h2>
        <div className="aspects-grid">
          {ASPECTS.map((aspect) => {
            const aspectData = (summary.aspectAverages || []).find(a => a.aspect === aspect.name);
            const rating = aspectData ? aspectData.averageRating : 0;

            return (
              // Atribut onClick sudah dihapus dari div ini
              <div key={aspect.name} className="aspect-card">
                <h3>{aspect.name}</h3>
                <StarRatingDisplay rating={rating} />
                <p>({rating.toFixed(2)})</p>
              </div>
            );
          })}
        </div>

        <section className="port-survey-section">
            <h2>Bantu Kami Menjadi Lebih Baik</h2>
            <p>Bagaimana pendapat Anda mengenai fasilitas dan pelayanan di pelabuhan kami? Ikuti survei kepuasan lengkap melalui tombol di bawah ini.</p>
            <Link to="/survei-lengkap" className="open-survey-button">
                Mulai Isi Survei
            </Link>
        </section>
      </main>
    </div>
    // Bagian untuk render modal di sini juga sudah dihapus
  );
}

export default HomePage;