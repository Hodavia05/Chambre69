// pages/Contact.js
import React from 'react';

const Contact = () => {
  return (
    <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
      <h1>Contactez-nous</h1>
      <p>Nous répondons sous 24h sur WhatsApp.</p>
      <a href="https://wa.me/1234567890" className="btn-whatsapp" style={{ margin: '1rem 0', display: 'inline-flex' }}>💬 WhatsApp</a>
      <p>Instagram : @chambre69</p>
      <p>Email : bonjour@chambre69.com</p>
    </div>
  );
};

export default Contact;