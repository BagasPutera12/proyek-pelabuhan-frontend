// frontend/src/pages/HomePage.jsx (VERSI FINAL LENGKAP & BERSIH)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

function HomePage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // INI ADALAH LOGIKA PENTING YANG HILANG
  const fetchShips = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      if (Array.isArray(response.data)) {
        setShips(response.data);
      } else {
        setShips([]); // Fallback ke array kosong jika format salah
      }
    } catch (err) {
      console.error('Gagal mengambil data kapal:', err);
      setError('Gagal mengambil data dari server. Coba refresh halaman.');
    } finally {
      // Baris ini akan menghentikan "Loading..."
      setLoading(false);
    }
  }, []);

  // INI JUGA LOGIKA PENTING YANG HILANG
  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  // Tampilan saat loading
  if (loading) return <div className="container"><h1>Loading...</h1></div>;

  // Tampilan jika ada error
  if (error) return <div className="container"><h1>{error}</h1></div>;

  // Tampilan utama
  return (
    <div className="container">
      <header className="page-title">
        <h1>Website Rating Kapal</h1>
        <p>Pelabuhan Teluk Bayur</p>
      </header>
      <div className="ship-list">
        {ships.length > 0 ? (
          ships.map((ship) => (
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
              <div className="links">
                <a href={ship.ticket_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Pesan Tiket</a>
                <a href={ship.vessel_finder_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Lacak Kapal</a>
              </div>
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