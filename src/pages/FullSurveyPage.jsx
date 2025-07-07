// frontend/src/pages/FullSurveyPage.jsx (VERSI FINAL FUNGSIONAL)

import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ASPECTS } from '../data/surveyData';
import './FullSurveyPage.css';

// Komponen kecil untuk satu baris pertanyaan, tidak berubah
const SurveyQuestion = ({ question, aspectName, onRatingChange, rating }) => {
  return (
      <div className="full-survey-question-item">
          <p className="full-survey-question-text">{question}</p>
          <div className="full-survey-rating-scale">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                  <button
                      type="button" // Set type ke button agar tidak men-submit form
                      key={ratingValue}
                      className={`rating-button ${rating === ratingValue ? 'selected' : ''}`}
                      onClick={() => onRatingChange(aspectName, question, ratingValue)}
                  >
                      {ratingValue}
                  </button>
              ))}
          </div>
      </div>
  );
};

function FullSurveyPage() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [answers, setAnswers] = useState({});
  const [suggestion, setSuggestion] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');

  // Fungsi untuk menyimpan jawaban rating
  const handleRatingChange = (aspectName, indicator, rating) => {
    setAnswers(prev => ({
      ...prev,
      [indicator]: { aspect: aspectName, rating: rating }
    }));
  };

  // Fungsi untuk mengirim seluruh form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalQuestions = ASPECTS.reduce((total, aspect) => total + aspect.indicators.length, 0);

    if (Object.keys(answers).length < totalQuestions) {
      alert('Mohon jawab semua pertanyaan rating sebelum mengirimkan.');
      return;
    }

    setSubmitStatus('loading');

    const ratingsPayload = Object.entries(answers).map(([indicator, value]) => ({
      indicator: indicator,
      aspect: value.aspect,
      rating: value.rating
    }));

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/full-surveys`, {
        userName,
        userEmail,
        ratings: ratingsPayload,
        suggestion
      });
      setSubmitStatus('success');
    } catch (error) {
      console.error("Gagal mengirim survei lengkap:", error);
      setSubmitStatus('error');
    }
  };

  // Tampilan untuk status loading, sukses, dan error
  if (submitStatus === 'loading') {
    return <div className="container status-page"><div className="loader"></div><h3>Mengirim survei...</h3></div>;
  }
  if (submitStatus === 'success') {
    return <div className="container status-page"><div className="status-icon success">✓</div><h3>Terima Kasih!</h3><p>Masukan Anda telah berhasil dikirimkan. Kami juga telah mengirimkan salinan ke email Anda.</p><Link to="/" className="back-to-home-button">Kembali ke Halaman Utama</Link></div>;
  }
  if (submitStatus === 'error') {
    return <div className="container status-page"><div className="status-icon error">✗</div><h3>Gagal Mengirim</h3><p>Terjadi kesalahan. Mohon periksa koneksi Anda dan coba lagi.</p><button onClick={() => setSubmitStatus('idle')} className="try-again-button">Coba Lagi</button></div>;
  }

  // Tampilan Form Utama
  return (
    <div className="container">
        <header className="page-title">
            <h1>Survei Kepuasan Pelayanan</h1>
            <p>Berikan masukan Anda untuk peningkatan kualitas Pelabuhan Teluk Bayur.</p>
        </header>

        <form className="full-survey-form" onSubmit={handleSubmit}>
            <section className="user-info-section">
                <h2>Informasi Anda</h2>
                <div className="input-group">
                    <label htmlFor="name">Nama</label>
                    <input type="text" id="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Masukkan nama Anda" required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Masukkan email Anda" required />
                </div>
            </section>

            {ASPECTS.map(aspect => (
                <section key={aspect.name} className="aspect-survey-section">
                    <h3>Aspek: {aspect.name}</h3>
                    {aspect.indicators.map((indicator, index) => (
                        <SurveyQuestion 
                            key={index}
                            question={indicator}
                            aspectName={aspect.name}
                            onRatingChange={handleRatingChange}
                            rating={answers[indicator]?.rating}
                        />
                    ))}
                </section>
            ))}

            <section className="suggestion-section">
                <h2>Saran dan Masukan Tambahan (Opsional)</h2>
                <textarea 
                    rows="5" 
                    placeholder="Tuliskan saran Anda di sini..."
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                ></textarea>
            </section>

            <button type="submit" className="submit-full-survey-button">Kirim Survei</button>
        </form>
    </div>
  );
}

export default FullSurveyPage;