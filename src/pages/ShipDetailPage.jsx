// frontend/src/pages/ShipDetailPage.jsx (VERSI DETEKTOR)

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
    // --- LOGGING DIMULAI ---
    console.log("===================================");
    console.log("MEMULAI PROSES FETCH DETAIL KAPAL");
    console.log("ID Kapal dari URL:", id);
    
    // Ini akan mencetak URL API yang digunakan oleh Vercel
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/ships/${id}`;
    console.log("Mencoba fetch ke URL:", apiUrl);
    // --- AKHIR LOGGING ---

    try {
      setLoading(true); 
      const response = await axios.get(apiUrl);
      
      console.log("SUCCESS: Respons diterima dari server:", response);

      if (response.data && typeof response.data === 'object') {
        setShip(response.data.ship);
        setRatings(response.data.ratings || []);
      } else {
        throw new Error("Format data tidak sesuai");
      }
    } catch (err) {
      setError('Gagal memuat detail kapal. Cek Console untuk detail error.');
      
      // --- INI ADALAH LOG PALING PENTING JIKA GAGAL ---
      console.error("===================================");
      console.error("!!! TERJADI ERROR SAAT FETCH !!!");
      console.error("URL yang dituju:", apiUrl);
      console.error("Detail error dari Axios:", err);
      console.error("===================================");
      // --- AKHIR LOG PALING PENTING ---

    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShipDetails();
  }, [fetchShipDetails]);

  const handleSubmitRating = async (ratingData) => { /* ... kode tidak berubah ... */ };

  // ... sisa kode tidak berubah ...
  if (loading) return <div className="container"><h1>Memuat Detail Kapal...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;
  if (!ship) return <div className="container"><h1>Kapal tidak ditemukan.</h1></div>;

  return (
    // ... JSX tampilan tidak berubah ...
    <>
      <div className="ship-detail-page">
        {/* ... */}
      </div>
      {isModalOpen && ( <SurveyModal /* ... */ /> )}
    </>
  );
}

export default ShipDetailPage;