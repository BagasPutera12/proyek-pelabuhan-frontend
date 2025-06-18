// frontend/src/pages/HomePage.jsx (FINAL)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

function HomePage() {
  // ... (logika state tidak berubah)
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShips = useCallback(async () => { /* ... logika fetch tidak berubah ... */ }, []);
  useEffect(() => { /* ... logika useEffect tidak berubah ... */ }, [fetchShips]);

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <div className="container">
      <header className="page-title">
        <h1>Rating Kapal Penumpang</h1>
        <p>Pelabuhan Teluk Bayur</p>
      </header>
      <div className="ship-list">
        {ships.length > 0 ? (
          ships.map((ship) => (
            // Kita buat Link hanya membungkus konten utama, bukan tombol
            <div key={ship._id} className="ship-card">
              <Link to={`/ship/${ship._id}`} className="ship-card-link-area">
                <img 
                  src={ship.photo || 'https://placehold.co/600x400?text=Foto+Kapal'} 
                  alt={ship.name || 'Nama Kapal'}
                  className="ship-photo"
                />
                <h3>{ship.name}</h3>
                <div className="rating">
                  ⭐ {typeof ship.avgRating === 'number' ? parseFloat(ship.avgRating).toFixed(1) : 'N/A'}
                </div>
              </Link>
              {/* --- BAGIAN BARU YANG DITAMBAHKAN KEMBALI --- */}
              <div className="links">
                <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Pesan Tiket</a>
                <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Lacak Kapal</a>
              </div>
              {/* --- AKHIR BAGIAN BARU --- */}
            </div>
          ))
        ) : (
          <p>Belum ada data kapal yang tersedia.</p>
        )}
      </div>
    </div>
  );
}
export default HomePage;