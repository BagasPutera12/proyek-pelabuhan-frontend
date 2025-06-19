// frontend/src/components/Header.jsx (FINAL DENGAN LINK FUNGSIONAL)

import './Header.css';
// 1. Impor komponen Link
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        {/* 2. Bungkus logo dengan Link yang mengarah ke "/" */}
        <Link to="/" className="logo-link">
          <div className="logo">
            🚢 Pelabuhan Kita
          </div>
        </Link>
        <nav className="main-nav">
          {/* 3. Ganti <a> dengan Link */}
          <Link to="/">Home</Link>
          <a href="#">About Us</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;