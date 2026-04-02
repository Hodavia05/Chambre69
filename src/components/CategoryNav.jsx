// components/CategoryNav.js
import React from 'react';
import { Link } from 'react-router-dom';

const CategoryNav = () => {
  const categories = [
    "Nouveautés", "Marques", "Soutiens-gorge", "Culottes", "Shortys", "Tangas", "Strings",
    "Ensembles de lingerie", "Lingerie sculptante", "Bodys élégants", "Maillots de bain haut de gamme",
    "Nuisettes et lingerie de nuit", "Lingerie grande taille", "Pièces sensuelles et sophistiquées"
  ];

  return (
    <div style={{ backgroundColor: 'var(--blanc-casse)', borderBottom: '1px solid var(--rose-nude)' }}>
      <div className="container" style={{ padding: '0.5rem 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.8rem', rowGap: '0.4rem' }}>
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/boutique?category=${encodeURIComponent(cat)}`}
              style={{
                fontSize: '0.75rem',
                textDecoration: 'none',
                color: 'var(--gris)',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--dore)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--gris)'}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;