// components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Link to={`/produit/${product.id}`}>
        <img src={product.images[0]} alt={product.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
        <h3>{product.name}</h3>
        <p style={{ color: 'var(--gris)' }}>{product.price} €</p>
      </Link>
      {product.tags && product.tags.includes('best-seller') && <span style={{ background: 'var(--dore)', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Best seller</span>}
    </div>
  );
};

export default ProductCard;