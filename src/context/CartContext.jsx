// context/CartContext.js
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, selectedSize, selectedColor) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === selectedSize && item.color === selectedColor);
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === selectedSize && item.color === selectedColor
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, size: selectedSize, color: selectedColor, quantity: 1 }];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, size, color);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Génération du message WhatsApp
  const getWhatsAppMessage = () => {
    let message = "Bonjour, je souhaite commander ces articles :\n";
    cart.forEach(item => {
      message += `- ${item.name} (${item.color}, taille ${item.size}) x${item.quantity} = ${item.price * item.quantity}€\n`;
    });
    message += `\nTotal : ${totalPrice}€\n\nMerci !`;
    return encodeURIComponent(message);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      getWhatsAppMessage
    }}>
      {children}
    </CartContext.Provider>
  );
};