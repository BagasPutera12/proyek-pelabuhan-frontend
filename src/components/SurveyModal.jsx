// frontend/src/components/SurveyModal.jsx

import { useState } from 'react';
import './SurveyModal.css'; // Kita buat file CSS-nya nanti

function SurveyModal({ ship, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Mohon pilih rating bintang terlebih dahulu.');
      return;
    }
    // Kirim data ke komponen App
    onSubmit({
      shipId: ship._id,
      rating,
      comment,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Beri Penilaian untuk</h2>
        <h3>{ship.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? 'star-filled' : 'star-empty'}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Tulis komentar Anda (opsional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="submit-rating-button">
            Kirim Penilaian
          </button>
        </form>
      </div>
    </div>
  );
}

export default SurveyModal;