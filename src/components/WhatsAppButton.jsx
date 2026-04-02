// components/WhatsAppButton.js
import React from 'react';

const WhatsAppButton = ({ message, text = "Commander via WhatsApp" }) => {
  const url = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
      💬 {text}
    </a>
  );
};

export default WhatsAppButton;