// frontend/src/pages/ShipDetailPage.jsx (FINAL)

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SurveyModal from '../components/SurveyModal';
import './ShipDetailPage.css';

function ShipDetailPage() {
  // ... (semua logika state dan fetch tidak berubah) ...
  const { id } = useParams();
  const [ship, setShip] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchShipDetails = useCallback(async () => { /* ... */ }, [id]);
  useEffect(() => { /* ... */ }, [fetchShipDetails]);
  const handleSubmitRating = async (ratingData) => { /* ... */ };

  if (loading) return <div className="container"><h1>Memuat Detail Kapal...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;
  if (!ship) return <div className="container"><h1>Kapal tidak ditemukan.</h1></div>;

  return (
    <>
      <div className="ship-detail-page">
        <header className="ship-detail-header">
          <h1>{ship.name}</h1>
        </header>

        <section className="ship-info-section">
          <h2>Detail Aktivitas & Informasi</h2>
          <div className="details-grid">
            <div className="detail-item"><strong>GT / LOA:</strong><span>{ship.gtLoa || 'N/A'}</span></div>
            <div className="detail-item"><strong>Agen:</strong><span>{ship.agen || 'N/A'}</span></div>
            <div className="detail-item"><strong>Waktu Labuh:</strong><span>{ship.labuh || 'N/A'}</span></div>
            <div className="detail-item"><strong>Rencana Sandar:</strong><span>{ship.rencanaSandar || 'N/A'}</span></div>
            <div className="detail-item"><strong>Komoditi:</strong><span>{ship.komoditi || 'N/A'}</span></div>
            <div className="detail-item"><strong>Bongkar / Muat:</strong><span>{ship.bongkarMuat || 'N/A'}</span></div>
            <div className="detail-item full-width"><strong>Asal - Tujuan:</strong><span>{ship.asalTujuan || 'N/A'}</span></div>
          </div>

          {/* --- BAGIAN BARU YANG DITAMBAHKAN KEMBALI --- */}
          <div className="ship-actions">
            <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" className="ticket-link">Pesan Tiket</a>
            <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" className="track-link">Lacak Kapal</a>
          </div>
          {/* --- AKHIR BAGIAN BARU --- */}
        </section>

        <section className="ship-ratings-section">
            {/* ... bagian rating tidak berubah ... */}
        </section>
      </div>

      {isModalOpen && ( <SurveyModal /* ... */ /> )}
    </>
  );
}

export default ShipDetailPage;