// frontend/src/pages/ShipDetailPage.jsx (VERSI FINAL BERSIH)

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SurveyModal from '../components/SurveyModal';
import './ShipDetailPage.css';

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
        throw new Error("Format data dari server tidak sesuai");
      }
    } catch (err) {
      setError('Gagal memuat detail kapal. Mungkin kapal tidak ditemukan.');
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
      fetchShipDetails(); // Ambil ulang data untuk menampilkan rating terbaru
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

        <img 
          src={ship.photo || 'https://placehold.co/1200x600?text=Foto+Kapal'} 
          alt={`Foto ${ship.name}`}
          className="ship-main-image"
        />

        <section className="ship-info-section">
          <h2>Deskripsi & Informasi</h2>
          <p className="ship-description">{ship.description || 'Tidak ada deskripsi.'}</p>
          
          {ship.schedule_info && (
              <>
                  <h3>Jadwal & Rute</h3>
                  <p>{ship.schedule_info}</p>
              </>
          )}

          <div className="ship-actions">
            <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" className="ticket-link">Pesan Tiket</a>
            <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" className="track-link">Lacak Kapal</a>
          </div>
        </section>

        <section className="ship-ratings-section">
          <div className="ratings-header">
            <h2>History Penilaian</h2>
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
            <p>Belum ada penilaian untuk kapal ini. Jadilah yang pertama!</p>
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