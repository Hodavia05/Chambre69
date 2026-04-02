// pages/Boutique.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Boutique = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || ''
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let filtered = [...products];

    // Filtre par catégorie (on vérifie si le produit a un champ category ou si le nom contient la catégorie)
    if (filters.category) {
      const catLower = filters.category.toLowerCase();
      filtered = filtered.filter(p =>
        (p.category && p.category.toLowerCase() === catLower) ||
        p.name.toLowerCase().includes(catLower) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(catLower)))
      );
    }

    // Filtre par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProducts(filtered);
  }, [filters]);

  // Mettre à jour les filtres quand l'URL change
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || ''
    });
  }, [searchParams]);

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1>Notre collection</h1>
      {filteredProducts.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Boutique;