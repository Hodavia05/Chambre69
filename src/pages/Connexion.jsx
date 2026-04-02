// pages/Connexion.js
import React from 'react';

const Connexion = () => {
  return (
    <div className="container" style={{ maxWidth: '400px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>Se connecter</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <input type="email" placeholder="Email" style={{ padding: '0.5rem' }} />
        <input type="password" placeholder="Mot de passe" style={{ padding: '0.5rem' }} />
        <button type="submit" className="btn-primary">Se connecter</button>
      </form>
      <p style={{ marginTop: '1rem' }}>Pas encore de compte ? <a href="/inscription">S’inscrire</a></p>
    </div>
  );
};

export default Connexion;