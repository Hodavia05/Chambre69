// components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--rose-nude)', color: 'var(--noir)', padding: '3rem 0', marginTop: '4rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '2rem' }}>
        <div>
          <h3>Chambre 69</h3>
          <p>Luxe accessible, sensualité assumée.</p>
        </div>
        <div>
          <h4>Liens utiles</h4>
          <ul style={{ listStyle: 'none' }}>
            <li><Link to="/guide-tailles">Guide des tailles</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/a-propos">Notre histoire</Link></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>WhatsApp : +123 456 7890</p>
          <p>Instagram : @chambre69</p>
        </div>
      </div>
      <div className="container" style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem' }}>
        © 2025 Chambre 69 – Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;