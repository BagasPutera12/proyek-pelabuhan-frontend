// frontend/src/components/Footer.jsx

import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Tentang Kami</h4>
          <p>Platform rating kapal penumpang untuk meningkatkan kualitas layanan di Pelabuhan Teluk Bayur.</p>
        </div>
        <div className="footer-section">
          <h4>Kontak Kami</h4>
          <p>Email: kontak@pelabuhan-kita.com</p>
          <p>Telepon: (021) 123-4567</p>
          <p>Alamat: Jl. Pelabuhan Raya No. 1, Padang, Sumatera Barat</p>
        </div>
        <div className="footer-section">
          <h4>Media Sosial</h4>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Pelabuhan Kita. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
