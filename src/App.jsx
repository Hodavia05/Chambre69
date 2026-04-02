// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav'; // Nouvel import
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Boutique from './pages/Boutique';
import Produit from './pages/Produit';
import Panier from './pages/Panier';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import Connexion from './pages/Connexion';
import './styles/global.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <CategoryNav /> {/* Les catégories apparaissent juste en dessous du header */}
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/produit/:id" element={<Produit />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/connexion" element={<Connexion />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;