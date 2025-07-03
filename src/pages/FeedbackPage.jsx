// frontend/src/pages/FeedbackPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ASPECTS } from '../data/surveyData'; // Kita gunakan lagi kamus aspek kita
import './FeedbackPage.css'; // CSS khusus untuk halaman ini

function FeedbackPage() {
  const [summary, setSummary] = useState({ averageRatings: [] });
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSuggestions, setExpandedSuggestions] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Ambil data summary (yang berisi rata-rata per aspek & indikator)
      const summaryPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/aspect-ratings/summary`);
      // Ambil daftar SEMUA saran
      const suggestionsPromise = axios.get(`${import.meta.env.VITE_API_URL}/api/aspect-ratings/suggestions`);

      const [summaryResponse, suggestionsResponse] = await Promise.all([summaryPromise, suggestionsPromise]);

      if (summaryResponse.data) {
        setSummary(summaryResponse.data);
      }
      if (suggestionsResponse.data) {
        setAllSuggestions(suggestionsResponse.data);
      }

    } catch (err) {
      setError('Gagal memuat data masukan. Mohon coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSuggestion = (id) => {
    setExpandedSuggestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="container" style={{textAlign: 'center'}}><h1>Memuat Data Masukan...</h1></div>;
  if (error) return <div className="container" style={{textAlign: 'center'}}><h1>{error}</h1></div>;

  return (
    <div className="container">
      <header className="page-title">
        <h1>Rekapitulasi Masukan Pengguna</h1>
        <p>Hasil Survei Kepuasan Fasilitas Pelabuhan Teluk Bayur</p>
      </header>

      <div className="feedback-page-content">
        {/* Bagian Rata-rata Penilaian per Aspek */}
        <section className="average-ratings-section">
          <h2>Rata-rata Penilaian per Aspek</h2>
          <div className="ratings-list">
            {summary.aspectAverages && summary.aspectAverages.map((item, index) => (
              <div key={index} className="rating-item">
                <span className="rating-question">{item.aspect}</span>
                <span className="rating-score">
                  ⭐ {item.averageRating.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian Semua Saran */}
        <section className="all-suggestions-section">
          <h2>Semua Saran dan Masukan</h2>
          <div className="suggestions-list">
            {allSuggestions.length > 0 ? (
               allSuggestions.map((item) => (
                <div key={item._id} className="suggestion-card-full">
                  <p className={expandedSuggestions[item._id] ? 'expanded' : ''}>
                    "{item.suggestion}"
                  </p>
                  {/* Tampilkan tombol hanya jika teksnya panjang */}
                  {item.suggestion.length > 150 && ( 
                    <button onClick={() => toggleSuggestion(item._id)}>
                      {expandedSuggestions[item._id] ? 'Baca lebih sedikit' : 'Baca selengkapnya...'}
                    </button>
                  )}
                  <small>
                     Dikirim pada: {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </small>
                </div>
              ))
            ) : (
              <p>Belum ada saran yang masuk.</p>
            )}
          </div>
        </section>
      </div>

      <Link to="/" className="back-to-home-button">
        &larr; Kembali ke Halaman Utama
      </Link>
    </div>
  );
}

export default FeedbackPage;