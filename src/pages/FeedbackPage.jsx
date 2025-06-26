// frontend/src/pages/FeedbackPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './FeedbackPage.css'; // Kita akan buat file CSS-nya nanti

// Daftar pertanyaan ini kita perlukan untuk mengurutkan hasil rata-rata
const surveyQuestions = [
  "Informasi dan fasilitas keselamatan seperti alat pemadam dan jalur evakuasi tersedia.",
  "Fasilitas kesehatan darurat seperti P3K, tandu, kursi roda, dan petugas tersedia.",
  "Terminal menyediakan CCTV dan ruang tunggu untuk menjaga keamanan dan ketertiban.",
  "Mesin cetak tiket tersedia dan pencetakan dilakukan kurang dari 5 menit.",
  "Informasi jadwal kapal tersedia dan mudah dibaca di layar atau papan pengumuman.",
  "Ruang tunggu bersih dan cukup luas untuk menampung penumpang.",
  "Area boarding memiliki tempat duduk dan dijaga kebersihannya.",
  "Toilet tersedia dalam jumlah cukup dan dalam kondisi bersih.",
  "Tempat ibadah (musholla) tersedia dan dalam kondisi layak.",
  "Penerangan di area terminal memadai untuk kenyamanan pengguna.",
  "Suhu ruangan dijaga maksimal 27°C dan sirkulasi udara baik.",
  "Tempat sampah tersedia dalam kondisi bersih dan tidak berbau.",
  "Informasi pelayanan ditampilkan secara visual dan audio yang jelas.",
  "Jadwal kedatangan/keberangkatan kapal disampaikan secara visual dan audio.",
  "Informasi gangguan perjalanan diumumkan maksimal 10 menit setelah terjadi.",
  "Informasi angkutan lanjutan mudah dilihat dan terbaca di terminal.",
  "Tersedia meja informasi dan petugas yang fasih berbahasa Inggris.",
  "Tersedia tangga embarkasi dan debarkasi yang beratap.",
  "Area parkir cukup luas dan kendaraan dapat keluar-masuk dengan lancar.",
  "Tersedia trolley dan porter yang mudah dikenali dan berfungsi baik.",
  "Ruang pelayanan kesehatan tersedia dalam kondisi bersih dan lengkap.",
  "Area khusus merokok tersedia bagi penumpang.",
  "Fasilitas khusus seperti tandu tersedia untuk penyandang difabel.",
  "Tersedia ruang khusus menyusui yang lengkap dan nyaman."
];


function FeedbackPage() {
  const [summary, setSummary] = useState({ averageRatings: [], recentSuggestions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk menampilkan/menyembunyikan teks saran yang panjang
  const [expandedSuggestions, setExpandedSuggestions] = useState({});

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/port-surveys/summary`);

      // Urutkan hasil rata-rata berdasarkan daftar pertanyaan asli
      const sortedRatings = surveyQuestions.map(questionText => {
        const foundRating = response.data.averageRatings.find(r => r.questionText === questionText);
        return {
          questionText,
          averageRating: foundRating ? foundRating.averageRating : 0 // Default 0 jika belum ada rating
        };
      });

      setSummary({
          ...response.data,
          averageRatings: sortedRatings
      });

    } catch (err) {
      setError('Gagal memuat data masukan. Mohon coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const toggleSuggestion = (id) => {
    setExpandedSuggestions(prev => ({ ...prev, [id]: !prev[id] }));
  };


  if (loading) return <div className="container"><h1>Memuat Data Masukan...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <div className="container">
      <header className="page-title">
        <h1>Rekapitulasi Masukan Pengguna</h1>
        <p>Hasil Survei Kepuasan Fasilitas Pelabuhan Teluk Bayur</p>
      </header>

      <div className="feedback-page-content">
        {/* Bagian Rata-rata Penilaian */}
        <section className="average-ratings-section">
          <h2>Rata-rata Penilaian per Kategori</h2>
          <div className="ratings-list">
            {summary.averageRatings.map((item, index) => (
              <div key={index} className="rating-item">
                <span className="rating-question">{index + 1}. {item.questionText}</span>
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
            {summary.recentSuggestions.length > 0 ? (
               summary.recentSuggestions.map((item) => (
                <div key={item._id} className="suggestion-card-full">
                  <p className={expandedSuggestions[item._id] ? 'expanded' : ''}>
                    "{item.suggestion}"
                  </p>
                  {item.suggestion.length > 150 && ( // Tampilkan tombol jika teks panjang
                    <button onClick={() => toggleSuggestion(item._id)}>
                      {expandedSuggestions[item._id] ? 'Baca lebih sedikit' : 'Baca selengkapnya...'}
                    </button>
                  )}
                  <small>
                     Dikirim pada: {new Date(item.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
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