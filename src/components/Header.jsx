// components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Icônes SVG (lignes fines)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const Header = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/boutique?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/boutique');
    }
  };

  return (
    <header style={{ backgroundColor: 'var(--blanc-casse)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
          {/* Recherche minimaliste */}
          <div style={{ flex: 1 }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--gris)', paddingBottom: '0.25rem', width: 'fit-content' }}>
              <input
                type="text"
                name="search"
                placeholder="Recherchez quelque chose..."
                style={{
                  padding: '0.3rem 0',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '200px',
                  color: 'var(--noir)',          // Texte en noir
                  backgroundColor: 'transparent', // Fond transparent
                }}
              />
              <button type="submit" style={{ cursor: 'pointer', color: 'var(--gris)' }}>
                <SearchIcon />
              </button>
            </form>
          </div>

          {/* Logo centré */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Link to="/">
              <img
                src="src/assets/logo-chambre69.png"
                alt="Chambre 69"
                style={{ maxWidth: '300px', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Icônes à droite */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '1.5rem' }}>
            <Link to="/connexion" style={{ textAlign: 'center', textDecoration: 'none', color: 'var(--noir)' }}>
              <div><UserIcon /></div>
              <span style={{ fontSize: '0.7rem' }}>Se connecter</span>
            </Link>
            <Link to="/panier" style={{ textAlign: 'center', textDecoration: 'none', color: 'var(--noir)', position: 'relative' }}>
              <div><CartIcon /></div>
              <span style={{ fontSize: '0.7rem' }}>Panier</span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-12px',
                  background: 'var(--dore)', borderRadius: '50%',
                  padding: '0 4px', fontSize: '0.6rem', color: 'white'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;