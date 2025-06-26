// frontend/src/components/PortSurveyModal.jsx (DENGAN UX BARU)

import { useState } from 'react';
import axios from 'axios'; // Kita pindahkan axios ke sini
import './PortSurveyModal.css';

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

function PortSurveyModal({ onClose }) {
  const [answers, setAnswers] = useState({});
  const [suggestion, setSuggestion] = useState('');

  // State baru untuk mengontrol status: 'idle', 'loading', 'success', 'error'
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleRatingChange = (questionIndex, rating) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: rating }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < surveyQuestions.length) {
      alert('Mohon jawab semua pertanyaan rating sebelum mengirimkan.');
      return;
    }

    const formattedAnswers = surveyQuestions.map((questionText, index) => ({
      questionText: questionText,
      rating: answers[index]
    }));

    const surveyData = { 
      answers: formattedAnswers,
      suggestion: suggestion 
    };

    setSubmitStatus('loading'); // 1. Ubah status menjadi 'loading'

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/port-surveys`, surveyData);
      setSubmitStatus('success'); // 2. Jika berhasil, ubah status menjadi 'success'
    } catch (error) {
      console.error("Gagal mengirim survei:", error);
      setSubmitStatus('error'); // 3. Jika gagal, ubah status menjadi 'error'
    }
  };

  // Fungsi untuk kembali dari halaman error ke form
  const handleTryAgain = () => {
    setSubmitStatus('idle');
  }

  // Fungsi untuk merender konten modal berdasarkan status
  const renderContent = () => {
    switch (submitStatus) {
      case 'loading':
        return (
          <div className="status-container">
            <div className="loader"></div>
            <h3>Mengirim survei Anda...</h3>
          </div>
        );
      case 'success':
        return (
          <div className="status-container">
            <div className="status-icon success">✓</div>
            <h3>Terima Kasih!</h3>
            <p>Masukan Anda telah berhasil dikirimkan.</p>
            <button className="port-survey-submit-button" onClick={onClose}>Tutup</button>
          </div>
        );
      case 'error':
        return (
          <div className="status-container">
            <div className="status-icon error">✗</div>
            <h3>Gagal Mengirim</h3>
            <p>Terjadi kesalahan. Mohon periksa koneksi Anda dan coba lagi.</p>
            <button className="try-again-button" onClick={handleTryAgain}>Coba Lagi</button>
          </div>
        );
      default: // 'idle'
        return (
          <>
            <button className="port-survey-close-button" onClick={onClose}>×</button>
            <h2>Survei Kepuasan Fasilitas Pelabuhan</h2>
            <p>Skala: 1 = Sangat Tidak Setuju, 5 = Sangat Setuju</p>
            <div className="port-survey-questions-container">
              {surveyQuestions.map((question, index) => (
                <div key={index} className="port-survey-question-item">
                  <p className="port-survey-question-text">{index + 1}. {question}</p>
                  <div className="port-survey-rating-scale">
                    {[1, 2, 3, 4, 5].map((ratingValue) => (
                      <button 
                        key={ratingValue}
                        className={`rating-button ${answers[index] === ratingValue ? 'selected' : ''}`}
                        onClick={() => handleRatingChange(index, ratingValue)}
                      >
                        {ratingValue}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="port-survey-suggestion-area">
                <label htmlFor="suggestion">Saran dan Masukan Lainnya (Opsional)</label>
                <textarea id="suggestion" rows="4" placeholder="Tulis saran Anda di sini..." value={suggestion} onChange={(e) => setSuggestion(e.target.value)}></textarea>
              </div>
            </div>
            <button className="port-survey-submit-button" onClick={handleSubmit}>
              Kirim Masukan
            </button>
          </>
        );
    }
  };

  return (
    <div className="port-survey-modal-overlay">
      <div className="port-survey-modal-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default PortSurveyModal;