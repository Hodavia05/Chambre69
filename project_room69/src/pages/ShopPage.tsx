import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
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
  const { addToCart } = useCart();

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

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#F9F5F6] pt-36 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 breathe">
              Bienvenue dans la chambre, belle femme
            </h1>
            <p className="text-center text-gray-600 mt-2 text-lg">
              Découvrez notre collection complète de lingerie haut de gamme, servez-vous.
            </p>
          </div>

          {/* Grille des catégories (blocs cliquables) */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {categories.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={category.image_url || 'https://via.placeholder.com/64?text=Image'}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=Image')}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-[#C9A96E] group-hover:text-white transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {categories.slice(5, 9).map((category) => (
                  <div
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="group bg-black border-2 border-[#C9A96E] rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                        <img
                          src={category.image_url || 'https://via.placeholder.com/64?text=Image'}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64?text=Image')}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-[#C9A96E] group-hover:text-white transition-colors">
                        {category.name}
                      </h3>
                    </div>
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
                  className="mb-20 scroll-mt-24"
                >
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12 bg-white/50 rounded-xl">
                      <p className="text-gray-500">Aucun produit disponible dans cette catégorie pour le moment.</p>
                      <p className="text-sm text-gray-400 mt-2">Revenez bientôt !</p>
                    </div>
                  ) : (
                    <div
                      ref={(el) => { categoryScrollRefs.current[category.id] = el; }}
                      className="flex overflow-x-auto gap-6 pb-8 px-4"
                      style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
                    >
                      {products.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        const variant = item.variant;
                        const color = variant?.color || 'Standard';
                        const sizes = variant?.sizes || ['S', 'M', 'L'];
                        return (
                          <div
                            key={item.id}
                            className={`flex-shrink-0 transition-all duration-500 ${
                              isActive ? 'scale-105 z-10' : 'scale-95 opacity-70'
                            }`}
                            style={{ width: '260px' }}
                          >
                            <div
                              className="relative bg-gray-100 overflow-hidden rounded-lg group cursor-pointer"
                              style={{ height: '300px' }}
                              onClick={() => onNavigate('product', { slug: item.slug })}
                            >
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=Image+manquante';
                                }}
                              />
                            </div>
                            <div className="p-4 text-center">
                              <h3
                                className={`text-base font-medium mb-2 transition-colors ${
                                  isActive ? 'text-[#C9A96E]' : 'text-gray-900 group-hover:text-[#C9A96E]'
                                }`}
                              >
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2">Couleur: {color}</p>
                              <p className="text-xs text-gray-600 mb-3">Tailles: {sizes.join(', ')}</p>
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => onNavigate('product', { slug: item.slug })}
                                  className="bg-black text-white px-3 py-1.5 text-xs hover:bg-[#C9A96E] transition-colors rounded"
                                >
                                  Voir produit
                                </button>
                                <button
                                  onClick={() => handleAddToCart(item, variant)}
                                  className="border border-black text-black px-3 py-1.5 text-xs hover:bg-black hover:text-white transition-colors rounded"
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