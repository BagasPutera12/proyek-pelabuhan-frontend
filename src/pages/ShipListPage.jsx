// frontend/src/pages/ShipListPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Menggunakan styling yang sama

function ShipListPage() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShips = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ships`);
      if (Array.isArray(response.data)) {
        setShips(response.data);
      } else {
        setShips([]);
      }
    } catch (err) {
      console.error('Gagal mengambil data kapal:', err);
      setError('Gagal mengambil data dari server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShips();
  }, [fetchShips]);

  if (loading) return <div className="container" style={{textAlign: 'center'}}><h1>Memuat Daftar Kapal...</h1></div>;
  if (error) return <div className="container" style={{textAlign: 'center'}}><h1>{error}</h1></div>;

  return (
    <div className="container">
      <header className="page-title">
        <h1>Daftar Aktivitas Kapal</h1>
        <p>Informasi Kapal di Area Pelabuhan Teluk Bayur</p>
      </header>
      <div className="aspects-grid"> {/* Menggunakan class 'aspects-grid' agar layoutnya sama bagus */}
        {ships.length > 0 ? (
          ships.map((ship) => (
            <div key={ship._id} className="aspect-card">
              <Link to={`/kapal/${ship._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <h3>{ship.name}</h3>
                <p>Agen: {ship.agen || 'N/A'}</p>
                <p>Status: {ship.rencanaSandar || 'N/A'}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>Belum ada data kapal yang tersedia.</p>
        )}
      </div>
    </div>
  );
}

export default ShipListPage;