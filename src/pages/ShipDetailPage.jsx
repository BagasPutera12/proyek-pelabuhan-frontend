// frontend/src/pages/ShipDetailPage.jsx (VERSI FINAL SESUAI DATA BARU)

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SurveyModal from '../components/SurveyModal';
import './ShipDetailPage.css'; // Kita akan gunakan CSS yang sama

function ShipDetailPage() {
  const { id } = useParams();

  const [ship, setShip] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchShipDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships/${id}`);
      if (response.data && response.data.ship) {
        setShip(response.data.ship);
        setRatings(response.data.ratings || []);
      } else {
        throw new Error("Format data tidak sesuai");
      }
    } catch (err) {
      setError('Gagal memuat detail kapal. Pastikan ID benar dan server berjalan.');
      console.error("Error fetching ship details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShipDetails();
  }, [fetchShipDetails]);

  const handleSubmitRating = async (ratingData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/ratings`, { ...ratingData, shipId: id });
      setIsModalOpen(false);
      fetchShipDetails();
    } catch (err) {
      alert('Gagal mengirim penilaian. Mohon coba lagi.');
      console.error(err);
    }
  };

  if (loading) return <div className="container"><h1>Memuat Detail Kapal...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;
  if (!ship) return <div className="container"><h1>Kapal tidak ditemukan.</h1></div>;

  return (
    <>
      <div className="ship-detail-page">
        <header className="ship-detail-header">
          <h1>{ship.name}</h1>
        </header>

        {/* Kita akan menampilkan detail dalam bentuk daftar, bukan tabel */}
        <section className="ship-info-section">
          <h2>Detail Aktivitas Kapal</h2>
          <div className="details-grid">
            <div className="detail-item"><strong>GT / LOA:</strong><span>{ship.gtLoa || 'N/A'}</span></div>
            <div className="detail-item"><strong>Agen:</strong><span>{ship.agen || 'N/A'}</span></div>
            <div className="detail-item"><strong>Waktu Labuh:</strong><span>{ship.labuh || 'N/A'}</span></div>
            <div className="detail-item"><strong>Rencana Sandar:</strong><span>{ship.rencanaSandar || 'N/A'}</span></div>
            <div className="detail-item"><strong>Komoditi:</strong><span>{ship.komoditi || 'N/A'}</span></div>
            <div className="detail-item"><strong>Bongkar / Muat:</strong><span>{ship.bongkarMuat || 'N/A'}</span></div>
            <div className="detail-item full-width"><strong>Asal - Tujuan:</strong><span>{ship.asalTujuan || 'N/A'}</span></div>
          </div>
        </section>

        <section className="ship-ratings-section">
          <div className="ratings-header">
            <h2>History Penilaian Pengguna</h2>
            <button className="give-rating-button" onClick={() => setIsModalOpen(true)}>
              Beri Penilaian
            </button>
          </div>

          {ratings.length > 0 ? (
            ratings.map((rating) => (
              <div key={rating._id} className="rating-card">
                <div className="rating-card-header">
                  {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                </div>
                {rating.comment && (
                    <p className="rating-card-comment">"{rating.comment}"</p>
                )}
              </div>
            ))
          ) : (
            <p>Belum ada penilaian untuk kapal ini.</p>
          )}
        </section>
      </div>
      
      {isModalOpen && (
        <SurveyModal
          ship={ship}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitRating}
        />
      )}
    </>
  );
}

export default ShipDetailPage;