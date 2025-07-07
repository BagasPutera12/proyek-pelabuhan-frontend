// frontend/src/components/PortSurveyModal.jsx (VERSI DINAMIS)

import { useState } from 'react';
import axios from 'axios';
import './PortSurveyModal.css';

// Komponen ini sekarang menerima 'aspect' yang berisi nama dan daftar indikatornya
function PortSurveyModal({ aspect, onClose }) {
  const [answers, setAnswers] = useState({});
  const [suggestion, setSuggestion] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const handleRatingChange = (indicator, rating) => {
    setAnswers(prev => ({ ...prev, [indicator]: rating }));
  };

  const handleSubmit = async () => {
    // Cek apakah semua pertanyaan untuk aspek ini sudah dijawab
    if (Object.keys(answers).length < aspect.indicators.length) {
      alert('Mohon jawab semua pertanyaan rating sebelum mengirimkan.');
      return;
    }

    // Format data untuk dikirim ke API
    const surveyData = {
      aspect: aspect.name,
      ratings: Object.entries(answers).map(([indicator, rating]) => ({ indicator, rating })),
      suggestion: suggestion,
    };

    setSubmitStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/aspect-ratings`, surveyData);
      setSubmitStatus('success');
    } catch (error) {
      console.error("Gagal mengirim survei:", error);
      setSubmitStatus('error');
    }
  };

  const handleTryAgain = () => {
    setSubmitStatus('idle');
  };

  const renderContent = () => {
    switch (submitStatus) {
      case 'loading':
        return (
          <div className="status-container">
            <div className="loader"></div>
            <h3>Mengirim masukan Anda...</h3>
          </div>
        );
      case 'success':
        return (
          <div className="status-container">
            <div className="status-icon success">✓</div>
            <h3>Terima Kasih!</h3>
            <p>Masukan Anda sangat berharga bagi kami.</p>
            <button className="port-survey-submit-button" onClick={onClose}>Tutup</button>
          </div>
        );
      case 'error':
        return (
          <div className="status-container">
            <div className="status-icon error">✗</div>
            <h3>Gagal Mengirim</h3>
            <p>Terjadi kesalahan. Mohon periksa koneksi Anda.</p>
            <button className="try-again-button" onClick={handleTryAgain}>Coba Lagi</button>
          </div>
        );
      default: // 'idle'
        return (
          <>
            <button className="port-survey-close-button" onClick={onClose}>×</button>
            <h2>Survei Aspek: {aspect.name}</h2>
            <p>Skala: 1 = Sangat Tidak Setuju, 5 = Sangat Setuju</p>
            <div className="port-survey-questions-container">
              {aspect.indicators.map((indicator, index) => (
                <div key={index} className="port-survey-question-item">
                  <p className="port-survey-question-text">{index + 1}. {indicator}</p>
                  <div className="port-survey-rating-scale">
                    {[1, 2, 3, 4, 5].map((ratingValue) => (
                      <button 
                        key={ratingValue}
                        className={`rating-button ${answers[indicator] === ratingValue ? 'selected' : ''}`}
                        onClick={(e) => {
  e.stopPropagation(); // Mencegah klik "menembus" ke latar belakang
  handleRatingChange(indicator, ratingValue);
}}
                      >
                        {ratingValue}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="port-survey-suggestion-area">
                <label htmlFor="suggestion">Saran Tambahan untuk Aspek Ini (Opsional)</label>
                <textarea id="suggestion" rows="3" placeholder="Tulis saran Anda di sini..." value={suggestion} onChange={(e) => setSuggestion(e.target.value)}></textarea>
              </div>
            </div>
            <button className="port-survey-submit-button" onClick={handleSubmit}>
              Kirim Survei Aspek Ini
            </button>
          </>
        );
    }
  };

  return (
    <div className="port-survey-modal-overlay" onClick={onClose}>
      <div className="port-survey-modal-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default PortSurveyModal;