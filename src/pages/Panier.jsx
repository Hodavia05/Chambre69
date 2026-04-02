// pages/Panier.js
import React from 'react';
import { useCart } from '../context/CartContext';
import WhatsAppButton from '../components/WhatsAppButton';

const Panier = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, getWhatsAppMessage } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Votre panier est vide</h2>
        <a href="/boutique" className="btn-primary">Continuer les achats</a>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1>Mon panier</h1>
      {cart.map(item => (
        <div key={`${item.id}-${item.size}-${item.color}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--rose-nude)', padding: '1rem 0' }}>
          <div>
            <strong>{item.name}</strong> ({item.color}, {item.size})
          </div>
          <div>
            <input type="number" value={item.quantity} min="1" onChange={e => updateQuantity(item.id, item.size, item.color, parseInt(e.target.value))} style={{ width: '60px', textAlign: 'center' }} />
            <span style={{ margin: '0 1rem' }}>{item.price * item.quantity} €</span>
            <button onClick={() => removeFromCart(item.id, item.size, item.color)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '2rem' }}>
        <h3>Total : {totalPrice} €</h3>
        <WhatsAppButton message={getWhatsAppMessage()} text="Commander tout via WhatsApp" />
      </div>
    </div>
  );
};

export default Panier;