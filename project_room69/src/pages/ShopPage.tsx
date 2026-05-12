import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { API_URL } from '../config';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  image_url: string;
}

interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  care_instructions: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

interface ProductVariant {
  id: string;
  product_id: string;
  color: string;
  sizes: string[];
  created_at: string;
}

interface ShopPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategorySlug?: string;
}

const categoryOrder = [
  'Bodys',
  'Culottes & Strings',
  'Ensembles',
  'Grande Taille',
  'Lingerie de Nuit',
  'Lingerie Sculptante',
  'Maillots de Bain',
  'Pièces Sensuelles',
  'Soutiens-gorge'
];

export const ShopPage = ({ onNavigate, initialCategorySlug }: ShopPageProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, (Product & { variant?: ProductVariant })[]>>({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/shop-data`);
        const data = await response.json();
        setCategories(data.categories);
        setProductsByCategory(data.productsByCategory);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const categorySectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeProductIndexes, setActiveProductIndexes] = useState<Record<string, number>>({});

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    // Si pas de variant, on crée un variant par défaut
    const defaultVariant = variant || {
      id: 'default',
      product_id: product.id,
      color: 'Standard',
      sizes: ['S', 'M', 'L'],
      created_at: new Date().toISOString()
    } as ProductVariant;
    addToCart(product, defaultVariant, defaultVariant.sizes[0]);
  };

  const updateActiveIndex = (categoryId: string, container: HTMLDivElement) => {
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;
    const items = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement;
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    setActiveProductIndexes(prev => ({ ...prev, [categoryId]: closestIndex }));
  };

  // Attacher les écouteurs de scroll après chargement
  useEffect(() => {
    const refs = categoryScrollRefs.current;
    if (Object.keys(refs).length === 0) return;
    Object.entries(refs).forEach(([catId, ref]) => {
      if (ref) {
        const handler = () => updateActiveIndex(catId, ref);
        ref.addEventListener('scroll', handler);
        handler();
        return () => ref.removeEventListener('scroll', handler);
      }
    });
  }, [productsByCategory]);

  const scrollToCategory = (categoryId: string) => {
    const section = categorySectionRefs.current[categoryId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5F6] flex items-center justify-center">
        <div className="text-2xl font-semibold text-[#C9A96E] animate-pulse">Chargement de la boutique...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#F9F5F6] pt-36 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 breathe mb-4">
              Bienvenu dans la chambre, belle femme
            </h1>
            <p className="text-center text-gray-600 text-lg md:text-xl font-light">
              Découvrez notre collection complète de lingerie haut de gamme, servez vous.
            </p>
          </div>

          {/* Grille des catégories (blocs cliquables) */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-24 space-y-6">
              {/* Première ligne : 5 blocs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                {categories.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105 flex items-center p-4 gap-4 h-24"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 flex-shrink-0 border border-[#C9A96E]/30">
                      <img
                        src={category.image_url || 'https://via.placeholder.com/64?text=Image'}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=Image')}
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#C9A96E] leading-tight group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                  </div>
                ))}
              </div>
              
              {/* Deuxième ligne : 4 blocs, centrée */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                {categories.slice(5, 9).map((category) => (
                  <div
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] transition-all duration-300 hover:scale-105 flex items-center p-4 gap-4 h-24"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 flex-shrink-0 border border-[#C9A96E]/30">
                      <img
                        src={category.image_url || 'https://via.placeholder.com/64?text=Image'}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=Image')}
                      />
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-[#C9A96E] leading-tight group-hover:text-white transition-colors">
                      {category.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Carrousels par catégorie */}
          {categories.map((category) => {
            const products = productsByCategory[category.id] || [];
            const activeIndex = activeProductIndexes[category.id] || 0;

            return (
              <RevealOnScroll key={category.id} delay={0.15}>
                <div
                  ref={(el) => { categorySectionRefs.current[category.id] = el; }}
                  className="mb-24 scroll-mt-24"
                >
                  <div className="flex items-center justify-center gap-6 mb-12">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-[#C9A96E]"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center tracking-wide">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C9A96E]/50 to-[#C9A96E]"></div>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 border border-dashed border-[#C9A96E]/30 rounded-2xl">
                      <p className="text-gray-500 text-lg">Aucun produit disponible dans cette catégorie pour le moment.</p>
                      <p className="text-sm text-gray-400 mt-2">Revenez bientôt !</p>
                    </div>
                  ) : (
                    <div
                      ref={(el) => { categoryScrollRefs.current[category.id] = el; }}
                      className="flex overflow-x-auto gap-8 pb-12 px-4 hide-scrollbar"
                      style={{ scrollSnapType: 'x mandatory' }}
                    >
                      {products.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        const variant = item.variant;
                        const color = variant?.color || 'Standard';
                        const sizes = variant?.sizes || ['S', 'M', 'L'];
                        return (
                          <div
                            key={item.id}
                            className={`flex-shrink-0 transition-all duration-700 ease-out scroll-snap-align-center ${
                              isActive ? 'scale-105 z-10' : 'scale-95 opacity-60'
                            }`}
                            style={{ width: '300px' }}
                          >
                            <div
                              className="relative bg-white overflow-hidden rounded-2xl group cursor-pointer shadow-xl border border-[#C9A96E]/10"
                              style={{ height: '400px' }}
                              onClick={() => onNavigate('product', { slug: item.slug })}
                            >
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Image+manquante';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6 text-center">
                              <h3
                                className={`text-xl font-bold mb-3 transition-colors ${
                                  isActive ? 'text-[#C9A96E]' : 'text-gray-900 group-hover:text-[#C9A96E]'
                                }`}
                              >
                                {item.name}
                              </h3>
                              <div className="space-y-1 mb-4">
                                <p className="text-sm text-gray-600">Couleur: <span className="font-medium">{color}</span></p>
                                <p className="text-sm text-gray-600">Tailles: <span className="font-medium">{sizes.join(', ')}</span></p>
                              </div>
                              <div className="flex gap-3 justify-center">
                                <button
                                  onClick={() => onNavigate('product', { slug: item.slug })}
                                  className="bg-black text-white px-5 py-2.5 text-sm hover:bg-[#C9A96E] transition-all duration-300 rounded-full font-medium shadow-md"
                                >
                                  Voir produit
                                </button>
                                <button
                                  onClick={() => handleAddToCart(item, variant)}
                                  className="border-2 border-black text-black px-5 py-2.5 text-sm hover:bg-black hover:text-white transition-all duration-300 rounded-full font-medium"
                                >
                                  Ajouter
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </FadeInOnLoad>
  );
};