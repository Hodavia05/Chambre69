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
  const [selectedCollections, setSelectedCollections] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const brandSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeProductIndexes, setActiveProductIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/shop-data`);
        const data = await response.json();
        const cleanBrands = data.brands.filter((b: Brand) => 
          !['backend', 'project_room69', 'node_modules', 'project', '.git'].includes(b.name.toLowerCase())
        );
        setBrands(cleanBrands);
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
  }, [brands, selectedSubcategories, selectedCollections]);

  const scrollToBrand = (brandId: string) => {
    const section = brandSectionRefs.current[brandId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-serif text-[#C9A96E] animate-pulse italic">Chargement de votre univers de luxe...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-white pt-36 pb-20 px-4 text-gray-900 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-24 group">
            <h1 className="text-5xl md:text-8xl font-bold font-serif text-gray-900 mb-8 tracking-tighter leading-none transition-colors duration-500 hover:text-[#C9A96E] cursor-default">
              BIENVENUE DANS <br/>
              <span className="italic">LA CHAMBRE</span>
            </h1>
            <div className="w-24 h-px bg-[#C9A96E] mx-auto mb-8 transition-all duration-700 group-hover:w-48"></div>
            <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto italic tracking-wide transition-colors duration-500 hover:text-[#C9A96E]">
              "Découvrez notre collection complète de lingerie haut de gamme, servez-vous."
            </p>
          </div>

          {/* Grille des Marques (Bulles) */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-40 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => scrollToBrand(brand.id)}
                  className="group cursor-pointer flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C9A96E]/40 group-hover:border-[#C9A96E] group-hover:scale-110 transition-all duration-700 shadow-[0_0_15px_rgba(201,169,110,0.1)] group-hover:shadow-[0_0_25px_rgba(201,169,110,0.3)] relative">
                    <img
                      src={brand.image_url || 'https://via.placeholder.com/150?text=Indisponible'}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=' + brand.name)}
                    />
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#C9A96E]/50 rounded-full transition-all duration-700"></div>
                  </div>
                  <h3 className="text-[10px] font-black text-gray-400 text-center uppercase tracking-[0.3em] group-hover:text-[#C9A96E] transition-colors">
                    {brand.name}
                  </h3>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Sections par Marque */}
          {brands.map((brand) => {
            const subcategories = Array.from(new Set(brand.products.map(p => p.subcategory).filter(Boolean))) as string[];
            const selectedSub = selectedSubcategories[brand.id] || (subcategories.length > 0 ? subcategories[0] : null);
            
            const filteredBySub = selectedSub 
              ? brand.products.filter(p => p.subcategory === selectedSub)
              : brand.products;

            const collections = Array.from(new Set(filteredBySub.map(p => p.collection).filter(Boolean))) as string[];
            const selectedCol = selectedCollections[`${brand.id}-${selectedSub}`] || (collections.length > 0 ? collections[0] : null);

            const finalProducts = selectedCol
              ? filteredBySub.filter(p => p.collection === selectedCol)
              : filteredBySub;

            const scrollKey = `${brand.id}-${selectedSub}-${selectedCol}`;
            const activeIndex = activeProductIndexes[scrollKey] || 0;

            return (
              <RevealOnScroll key={brand.id} delay={0.15}>
                <div
                  ref={(el) => { brandSectionRefs.current[brand.id] = el; }}
                  className="mb-48 scroll-mt-24"
                >
                  {/* Header de Marque */}
                  <div className="text-center mb-16 px-4">
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-12 tracking-tight transition-colors duration-500 hover:text-[#C9A96E]">
                      {brand.name}
                    </h2>
                    
                    {/* Sélecteur de Sous-catégories */}
                    {subcategories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-6 mb-12 border-y border-gray-100 py-6">
                        {subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => {
                              setSelectedSubcategories(prev => ({ ...prev, [brand.id]: sub }));
                              setSelectedCollections(prev => {
                                const newCols = { ...prev };
                                delete newCols[`${brand.id}-${sub}`];
                                return newCols;
                              });
                            }}
                            className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 relative pb-2 ${
                              selectedSub === sub
                                ? 'text-[#C9A96E]'
                                : 'text-gray-300 hover:text-gray-900'
                            }`}
                          >
                            {sub}
                            {selectedSub === sub && (
                              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C9A96E] animate-pulse"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sélecteur de Collections */}
                    {collections.length > 1 && (
                      <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {collections.map((col) => (
                          <button
                            key={col}
                            onClick={() => setSelectedCollections(prev => ({ ...prev, [`${brand.id}-${selectedSub}`]: col }))}
                            className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${
                              selectedCol === col
                                ? 'bg-[#C9A96E] text-white shadow-xl scale-105'
                                : 'bg-white text-gray-400 border border-gray-100 hover:border-[#C9A96E] hover:text-[#C9A96E]'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Affichage des Produits */}
                  {finalProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/20 rounded-3xl border border-gray-50">
                      <p className="text-gray-300 italic font-serif">Arrivage prochainement...</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div
                        ref={(el) => { scrollContainerRefs.current[scrollKey] = el; }}
                        className="flex overflow-x-auto gap-12 pb-16 px-4 hide-scrollbar"
                        style={{ scrollSnapType: 'x mandatory' }}
                      >
                        {finalProducts.map((item, idx) => {
                          const isActive = idx === activeIndex;
                          const variant = item.variants[0];
                          return (
                            <div
                              key={item.id}
                              className={`flex-shrink-0 transition-all duration-1000 ease-in-out scroll-snap-align-center ${
                                isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-30 grayscale hover:grayscale-0 hover:opacity-100'
                              }`}
                              style={{ width: '320px' }}
                            >
                              <div
                                className="relative bg-white overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-2xl border border-gray-100"
                                style={{ height: '480px' }}
                                onClick={() => onNavigate('product', { slug: item.slug })}
                              >
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-110"
                                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/500?text=' + item.name)}
                                />
                                {/* Overlay On Hover - Should be transparent gold, not white */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#C9A96E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                                  <span className="text-white text-[9px] font-black uppercase tracking-[0.4em] mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">Détails</span>
                                  <div className="h-0.5 w-8 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                                </div>
                              </div>
                              <div className={`mt-10 text-center transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <h5 className="text-2xl font-serif font-bold text-gray-900 mb-2 transition-colors hover:text-[#C9A96E]">{item.name}</h5>
                                <p className="text-[9px] text-[#C9A96E] font-black uppercase tracking-[0.4em] mb-8">{selectedCol || 'Collection Exclusive'}</p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(item, variant); }}
                                  className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-10 py-4 rounded-full hover:bg-[#C9A96E] transition-all shadow-xl hover:-translate-y-1"
                                >
                                  Ajouter au Panier
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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