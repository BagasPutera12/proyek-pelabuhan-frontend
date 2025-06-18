// frontend/src/pages/ShipDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ShipDetailPage.css'; // Impor CSS yang baru kita buat

function ShipDetailPage() {
  // 1. Ambil 'id' dari URL menggunakan useParams
  const { id } = useParams();

  // 2. Siapkan state untuk menyimpan data
  const [ship, setShip] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect untuk mengambil data saat halaman dimuat
  useEffect(() => {
    const fetchShipDetails = async () => {
      try {
        const response = await axios.get(`<span class="math-inline">\{import\.meta\.env\.VITE\_API\_URL\}/api/ships/</span>{id}`);
        setShip(response.data.ship);
        setRatings(response.data.ratings);
      } catch (err) {
        setError('Gagal memuat detail kapal. Mungkin kapal tidak ditemukan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipDetails();
  }, [id]); // Efek ini akan berjalan lagi jika ID di URL berubah

  // Tampilan saat loading atau error
  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  // Tampilan jika kapal tidak ditemukan setelah selesai loading
  if (!ship) return <div className="container"><h1>Kapal tidak ditemukan.</h1></div>;

  // 4. Tampilan utama halaman detail
  return (
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
        <h2>Deskripsi Kapal</h2>
        <p className="ship-description">{ship.description || 'Tidak ada deskripsi.'}</p>

        {/* Informasi Jadwal & Rute (jika ada) */}
        {ship.schedule_info && (
            <>
                <h3>Informasi Jadwal & Rute</h3>
                <p>{ship.schedule_info}</p>
            </>
        )}

        <div className="ship-actions">
          <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" className="ticket-link">Pesan Tiket</a>
          <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" className="track-link">Lacak Kapal</a>
        </div>
      </section>

      <section className="ship-ratings-section">
        <h2>History Penilaian</h2>
        {ratings.length > 0 ? (
          ratings.map((rating) => (
            <div key={rating._id} className="rating-card">
              <div className="rating-card-header">
                {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
              </div>
              <p className="rating-card-comment">
                {rating.comment || 'Tidak ada komentar.'}
              </p>
            </div>
          ))
        ) : (
          <p>Belum ada penilaian untuk kapal ini.</p>
        )}
      </section>
    </div>
  );
}

export default ShipDetailPage;