// frontend/src/components/Header.jsx

import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <div className="logo">
            🚢 Pelabuhan Kita
          </div>
        </Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          {/* --- LINK BARU --- */}
          <Link to="/kapal">Daftar Kapal</Link>
          <a href="#">About Us</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;