// frontend/src/pages/HomePage.jsx (VERSI FINAL ANTI-CRASH)

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

function HomePage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShips = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      
      // --- BAGIAN PERBAIKAN UTAMA ---
      // Cek dengan sangat aman apakah data yang diterima adalah array.
      if (Array.isArray(response.data)) {
        // Jika ya, langsung gunakan.
        setShips(response.data);
      } else {
        // Jika tidak, set state menjadi array kosong untuk mencegah crash.
        console.error("Data yang diterima dari server bukan array:", response.data);
        setShips([]);
      }
      // --- AKHIR BAGIAN PERBAIKAN ---

    } catch (err) {
      console.error('Terjadi error saat fetch:', err);
      setError('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  return (
    <div className="container">
      <header className="page-title">
        <h1>Rating Kapal Penumpang</h1>
        <p>Pelabuhan Teluk Bayur</p>
      </header>
      <div className="ship-list">
        {/* Tambahkan pengecekan jika ships kosong */}
        {ships.length > 0 ? (
          ships.map((ship) => (
            <Link to={`/ship/${ship._id}`} key={ship._id} className="ship-card-link">
              <div className="ship-card">
                <img 
                  src={ship.photo || 'https://placehold.co/600x400?text=Foto+Kapal'} 
                  alt={ship.name || 'Nama Kapal'}
                  className="ship-photo"
                />
                <h3>{ship.name}</h3>
                <p className="description">{ship.description}</p>
                <div className="rating">
                  ⭐ {typeof ship.avgRating === 'number' ? parseFloat(ship.avgRating).toFixed(1) : 'N/A'}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>Belum ada data kapal yang tersedia.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;