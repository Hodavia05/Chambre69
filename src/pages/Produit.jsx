// pages/Produit.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import WhatsAppButton from '../components/WhatsAppButton';

const Produit = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');

  if (!product) return <div>Produit non trouvé</div>;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    alert('Ajouté au panier !');
  };

  const whatsappMessage = `Bonjour, je souhaite commander le produit : ${product.name} (${selectedColor}, taille ${selectedSize}) – ${product.price}€.`;

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', padding: '3rem 0' }}>
      <div>
        <img src={product.images[0]} alt={product.name} style={{ width: '100%' }} />
      </div>
      <div>
        <h1>{product.name}</h1>
        <p style={{ color: 'var(--gris)' }}>{product.description}</p>
        <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>{product.price} €</p>

        <div style={{ margin: '1rem 0' }}>
          <label>Taille : </label>
          <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
            {product.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <label>Couleur : </label>
          <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
            {product.colors.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={handleAddToCart} className="btn-primary">Ajouter au panier</button>
          <WhatsAppButton message={whatsappMessage} text="Commander via WhatsApp" />
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--gris)' }}>
          <p>Livraison offerte dès 80€</p>
          <p>Conseils taille : <a href="/guide-tailles">voir le guide</a></p>
        </div>
      </div>
    </div>
  );
};

export default Produit;