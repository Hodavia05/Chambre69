import React, { useState } from 'react';
import { loginUser, registerUser } from '../lib/api';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const Connexion = () => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const action = mode === 'login' ? loginUser : registerUser;
      const payload = mode === 'login'
        ? { email: formData.email, password: formData.password }
        : formData;

      const result = await action(payload);
      setMessage(result.message);

      if (mode === 'register') {
        setMode('login');
        setFormData((current) => ({
          ...current,
          password: '',
        }));
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '460px', margin: '4rem auto', textAlign: 'center' }}>
      <h2>{mode === 'login' ? 'Se connecter' : 'Creer un compte'}</h2>
      <p style={{ color: '#666' }}>
        {mode === 'login'
          ? 'Connecte ton compte client pour retrouver tes commandes.'
          : 'Enregistre un compte pour simplifier tes prochaines commandes.'}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button type="button" className="btn-primary" onClick={() => setMode('login')} disabled={mode === 'login'}>
          Connexion
        </button>
        <button type="button" className="btn-primary" onClick={() => setMode('register')} disabled={mode === 'register'}>
          Inscription
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {mode === 'register' && (
          <>
            <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" placeholder="Prenom" style={{ padding: '0.75rem' }} />
            <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" placeholder="Nom" style={{ padding: '0.75rem' }} />
          </>
        )}
        <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" style={{ padding: '0.75rem' }} required />
        <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Mot de passe" style={{ padding: '0.75rem' }} required />
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S inscrire'}
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: '#1f7a1f' }}>{message}</p>}
      {error && <p style={{ marginTop: '1rem', color: '#b42318' }}>{error}</p>}
    </div>
  );
};

export default Connexion;
