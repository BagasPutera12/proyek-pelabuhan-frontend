// frontend/src/components/Header.jsx

import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          🚢 Pelabuhan Kita
        </div>
        <nav className="main-nav">
          <a href="#">Home</a>
          <a href="#">About Us</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
