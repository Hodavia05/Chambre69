// pages/Accueil.js
import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Accueil = () => {
  const bestSellers = products.filter(p => p.tags?.includes('best-seller')).slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--rose-nude) 0%, var(--blanc-casse) 100%)', textAlign: 'center', padding: '6rem 1rem' }}>
        <h1 style={{ fontSize: '3rem', maxWidth: '800px', margin: '0 auto' }}>Révélez votre pouvoir de séduction</h1>
        <Link to="/boutique" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Découvrir la collection</Link>
      </section>

      {/* Catégories */}
      <section className="container" style={{ margin: '4rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nos catégories</h2>
        <div className="products-grid">
          <div>Ensembles</div>
          <div>Bodys</div>
          <div>Maillots</div>
          <div>Grande taille</div>
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="container" style={{ margin: '4rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nos best-sellers</h2>
        <div className="products-grid">
          {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Section Séduction */}
      <section style={{ backgroundColor: 'var(--noir)', color: 'white', padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--dore)' }}>Dans l'intimité de la chambre</h2>
        <p style={{ maxWidth: '600px', margin: '1rem auto' }}>Des pièces audacieuses pour affirmer votre sensualité.</p>
        <Link to="/boutique?tag=sensuel" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>Explorer</Link>
      </section>

      {/* Avis WhatsApp */}
      <section className="container" style={{ margin: '4rem auto', textAlign: 'center' }}>
        <h2>Elles ont adoré 💬</h2>
        <div className="products-grid" style={{ marginTop: '2rem' }}>
          <div>“Superbe qualité, je recommande !” – Marie</div>
          <div>“La livraison WhatsApp super pratique” – Sarah</div>
        </div>
      </section>

      {/* Bloc WhatsApp */}
      <section className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h3>Commandez facilement via WhatsApp</h3>
        <a href="https://wa.me/1234567890" className="btn-whatsapp" style={{ marginTop: '1rem' }}>💬 Écrire maintenant</a>
      </section>
    </main>
  );
};

export default Accueil;