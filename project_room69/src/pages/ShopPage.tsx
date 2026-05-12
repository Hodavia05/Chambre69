import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { API_URL } from '../config';

interface Product {
  id: string;
  category_id: string;
  brand_id?: string;
  subcategory?: string;
  collection?: string;
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

interface Brand {
  id: string;
  name: string;
  description: string;
  image_url: string;
  products: (Product & { variants: ProductVariant[] })[];
}

interface ShopPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const ShopPage = ({ onNavigate }: ShopPageProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeProductIndexes, setActiveProductIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/shop-data`);
        const data = await response.json();
        setBrands(data.brands);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    const defaultVariant = variant || {
      id: 'default',
      product_id: product.id,
      color: 'Standard',
      sizes: ['S', 'M', 'L'],
      created_at: new Date().toISOString()
    } as ProductVariant;
    addToCart(product, defaultVariant, defaultVariant.sizes[0]);
  };

  const updateActiveIndex = (key: string, container: HTMLDivElement) => {
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
    setActiveProductIndexes(prev => ({ ...prev, [key]: closestIndex }));
  };

  useEffect(() => {
    const refs = scrollContainerRefs.current;
    Object.entries(refs).forEach(([key, ref]) => {
      if (ref) {
        const handler = () => updateActiveIndex(key, ref);
        ref.addEventListener('scroll', handler);
        handler();
        return () => ref.removeEventListener('scroll', handler);
      }
    });
  }, [brands, selectedSubcategories]);

  const scrollToBrand = (brandId: string) => {
    const section = brandSectionRefs.current[brandId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-serif text-[#C9A96E] animate-pulse italic">Préparation de la boutique...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#FDFDFD] pt-36 pb-20 px-4 text-gray-900 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-gray-900 mb-6 tracking-tight">
              Bienvenue dans <span className="text-[#C9A96E]">la Chambre</span>
            </h1>
            <p className="text-gray-500 text-xl font-light max-w-2xl mx-auto italic">
              "Découvrez notre collection complète de lingerie haut de gamme, servez-vous."
            </p>
          </div>

          {/* Grille des Marques (Design Light & Gold) */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-32 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => scrollToBrand(brand.id)}
                  className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center p-6 gap-4"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C9A96E]/20 group-hover:border-[#C9A96E] transition-colors shadow-sm">
                    <img
                      src={brand.image_url || 'https://via.placeholder.com/100?text=Brand'}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=Brand')}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-gray-800 text-center uppercase tracking-widest group-hover:text-[#C9A96E] transition-colors">
                    {brand.name}
                  </h3>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Sections par Marque */}
          {brands.map((brand) => {
            // Get unique subcategories for this brand's products
            const subcategories = Array.from(new Set(brand.products.map(p => p.subcategory).filter(Boolean))) as string[];
            const selectedSub = selectedSubcategories[brand.id] || (subcategories.length > 0 ? subcategories[0] : null);
            
            // Filter products
            const filteredProducts = selectedSub 
              ? brand.products.filter(p => p.subcategory === selectedSub)
              : brand.products;

            // Group by collection
            const collections: Record<string, typeof filteredProducts> = {};
            filteredProducts.forEach(p => {
              const colName = p.collection || 'Standard';
              if (!collections[colName]) collections[colName] = [];
              collections[colName].push(p);
            });

            return (
              <RevealOnScroll key={brand.id} delay={0.15}>
                <div
                  ref={(el) => { brandSectionRefs.current[brand.id] = el; }}
                  className="mb-40 scroll-mt-24"
                >
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 tracking-tight">
                      {brand.name}
                    </h2>
                    
                    {subcategories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-3">
                        {subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubcategories(prev => ({ ...prev, [brand.id]: sub }))}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                              selectedSub === sub
                                ? 'bg-black text-white shadow-xl scale-105'
                                : 'bg-white text-gray-400 border border-gray-100 hover:border-[#C9A96E] hover:text-[#C9A96E]'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {Object.entries(collections).length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 italic">Aucun article dans cette section pour le moment.</p>
                    </div>
                  ) : (
                    Object.entries(collections).map(([colName, products]) => {
                      const scrollKey = `${brand.id}-${colName}`;
                      const activeIndex = activeProductIndexes[scrollKey] || 0;

                      return (
                        <div key={colName} className="mb-20">
                          {colName !== 'Standard' && (
                            <div className="flex items-center gap-6 mb-10 px-4">
                              <h4 className="text-sm font-serif italic text-[#C9A96E] tracking-[0.2em] whitespace-nowrap">
                                {colName}
                              </h4>
                              <div className="h-px bg-gray-100 flex-1"></div>
                            </div>
                          )}

                          <div
                            ref={(el) => { scrollContainerRefs.current[scrollKey] = el; }}
                            className="flex overflow-x-auto gap-8 pb-12 px-4 hide-scrollbar"
                            style={{ scrollSnapType: 'x mandatory' }}
                          >
                            {products.map((item, idx) => {
                              const isActive = idx === activeIndex;
                              const variant = item.variants[0];
                              return (
                                <div
                                  key={item.id}
                                  className={`flex-shrink-0 transition-all duration-700 ease-out scroll-snap-align-center ${
                                    isActive ? 'scale-105 z-10' : 'scale-95 opacity-50'
                                  }`}
                                  style={{ width: '300px' }}
                                >
                                  <div
                                    className="relative bg-white overflow-hidden rounded-3xl group cursor-pointer shadow-xl border border-gray-50"
                                    style={{ height: '420px' }}
                                    onClick={() => onNavigate('product', { slug: item.slug })}
                                  >
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400?text=Image+manquante')}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                      <button className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-[#C9A96E] transition-colors">
                                        Voir Détails
                                      </button>
                                    </div>
                                  </div>
                                  <div className={`mt-6 text-center transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <h5 className="text-lg font-serif font-bold text-gray-900 mb-1">{item.name}</h5>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">{brand.name}</p>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleAddToCart(item, variant); }}
                                      className="inline-block border-b border-black text-[10px] font-bold uppercase tracking-widest pb-1 hover:text-[#C9A96E] hover:border-[#C9A96E] transition-all"
                                    >
                                      Ajouter au Panier
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
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