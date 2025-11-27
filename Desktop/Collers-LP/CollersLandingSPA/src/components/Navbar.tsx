import { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="section-inner navbar-inner">
        <div className="navbar-left">
          <div className="logo">Collers</div>

          <nav className={`nav-links ${open ? 'active' : ''}`}>
            <a href="#hero" onClick={() => setOpen(false)}>Products</a>
            <a href="#why" onClick={() => setOpen(false)}>Solutions</a>
            <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
            <a href="#articles" onClick={() => setOpen(false)}>Resources</a>
          </nav>
        </div>

        <div className="navbar-actions">
          <button className="btn ghost">Log in</button>
          <button className="btn primary">Sign up now</button>

          {/* ✅ HAMBURGER ICON */}
          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
