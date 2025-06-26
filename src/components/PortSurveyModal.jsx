// frontend/src/components/PortSurveyModal.jsx

import { useState } from 'react';
import './PortSurveyModal.css';

// Daftar pertanyaan kita simpan di sini
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

function PortSurveyModal({ onClose, onSubmit }) {
  // State untuk menyimpan jawaban, formatnya { indexPertanyaan: rating }
  const [answers, setAnswers] = useState({});

  const handleRatingChange = (questionIndex, rating) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: rating }));
  };

  const handleSubmit = () => {
    // Cek apakah semua pertanyaan sudah dijawab
    if (Object.keys(answers).length < surveyQuestions.length) {
      alert('Mohon jawab semua pertanyaan sebelum mengirimkan.');
      return;
    }

    // Ubah format data sebelum dikirim ke parent
    const formattedAnswers = surveyQuestions.map((questionText, index) => ({
      questionText: questionText,
      rating: answers[index]
    }));

    onSubmit({ answers: formattedAnswers });
  };

  return (
    <div className="port-survey-modal-overlay" onClick={onClose}>
      <div className="port-survey-modal-content" onClick={(e) => e.stopPropagation()}>
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
        </div>
        <button className="port-survey-submit-button" onClick={handleSubmit}>
          Kirim Masukan
        </button>
      </div>
    </div>
  );
}

export default PortSurveyModal;