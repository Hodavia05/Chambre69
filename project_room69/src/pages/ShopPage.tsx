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

const brandConfig = [
  { name: 'Curvy Kate', subcategories: ['Slip', 'Soutien'] },
  { name: 'Dita Von Teese', subcategories: ['Culotte', 'Porte jarelle', 'Slip', 'Soutien gorge'] },
  { name: 'Elomi', subcategories: ['Slip', 'Soutien gorge'] },
  { name: 'Empreinte', subcategories: ['Cullotes', 'Soutien gorge'] },
  { name: 'Fantasie', subcategories: [] },
  { name: 'Freya', subcategories: [] },
  { name: 'Louisa bracq', subcategories: ['Slip', 'Soutien gorge'] },
  { name: 'Wacoal', subcategories: ['Slip', 'Soutien'] },
  { name: 'Ysabel Mora', subcategories: [] },
  { name: 'Quelques accessoires', subcategories: [] },
  { name: 'Senteurs', subcategories: [] },
  { name: 'Tenues Spéciales', subcategories: [] }
];

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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-2xl font-serif text-[#C9A96E] animate-pulse">Chargement de la collection...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#050505] pt-36 pb-20 px-4 text-white font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-[#C9A96E] breathe mb-6">
              Bienvenue dans la Chambre
            </h1>
            <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto italic">
              "Découvrez notre collection complète de lingerie haut de gamme, servez-vous."
            </p>
          </div>

          {/* Grille des Marques */}
          <RevealOnScroll delay={0.1}>
            <div className="mb-32 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => scrollToBrand(brand.id)}
                  className="group relative bg-[#0A0A0A] border border-[#C9A96E]/20 rounded-xl overflow-hidden cursor-pointer hover:border-[#C9A96E] transition-all duration-500 hover:-translate-y-2 flex flex-col items-center p-6 gap-4"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C9A96E]/30 group-hover:border-[#C9A96E] transition-colors">
                    <img
                      src={brand.image_url || 'https://via.placeholder.com/100'}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-[#C9A96E] text-center uppercase tracking-widest">
                    {brand.name}
                  </h3>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Sections par Marque */}
          {brands.map((brand) => {
            const config = brandConfig.find(c => c.name.toLowerCase() === brand.name.toLowerCase());
            const subcategories = config?.subcategories || [];
            const selectedSub = selectedSubcategories[brand.id] || (subcategories.length > 0 ? subcategories[0] : null);
            
            // Filter products by selected subcategory
            const filteredProducts = selectedSub 
              ? brand.products.filter(p => p.subcategory?.toLowerCase() === selectedSub.toLowerCase())
              : brand.products;

            // Group by collection
            const collections: Record<string, typeof filteredProducts> = {};
            filteredProducts.forEach(p => {
              const colName = p.collection || 'Default';
              if (!collections[colName]) collections[colName] = [];
              collections[colName].push(p);
            });

            return (
              <RevealOnScroll key={brand.id} delay={0.15}>
                <div
                  ref={(el) => { brandSectionRefs.current[brand.id] = el; }}
                  className="mb-40 scroll-mt-24 border-t border-[#C9A96E]/10 pt-20"
                >
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#C9A96E] mb-8 tracking-wider">
                      {brand.name}
                    </h2>
                    
                    {subcategories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-4">
                        {subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setSelectedSubcategories(prev => ({ ...prev, [brand.id]: sub }))}
                            className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${
                              selectedSub === sub
                                ? 'bg-[#C9A96E] text-black shadow-[0_0_20px_rgba(201,169,110,0.4)]'
                                : 'bg-transparent text-gray-500 border border-gray-800 hover:border-[#C9A96E] hover:text-[#C9A96E]'
                            }`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {Object.entries(collections).map(([colName, products]) => {
                    const scrollKey = `${brand.id}-${colName}`;
                    const activeIndex = activeProductIndexes[scrollKey] || 0;

                    return (
                      <div key={colName} className="mb-20">
                        {colName !== 'Default' && (
                          <div className="flex items-center gap-4 mb-10 px-4">
                            <div className="h-px bg-[#C9A96E]/30 flex-1"></div>
                            <h4 className="text-lg font-serif italic text-[#C9A96E] tracking-widest">
                              Collection {colName}
                            </h4>
                            <div className="h-px bg-[#C9A96E]/30 flex-1"></div>
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
                                  isActive ? 'scale-105 z-10' : 'scale-95 opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
                                }`}
                                style={{ width: '300px' }}
                              >
                                <div
                                  className="relative bg-[#111] overflow-hidden rounded-2xl group cursor-pointer shadow-2xl border border-[#C9A96E]/10"
                                  style={{ height: '420px' }}
                                  onClick={() => onNavigate('product', { slug: item.slug })}
                                >
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-[#C9A96E] text-xs font-bold uppercase tracking-widest mb-1">{brand.name}</p>
                                    <h5 className="text-white font-serif text-lg">{item.name}</h5>
                                  </div>
                                </div>
                                <div className={`mt-6 text-center transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                  <div className="flex gap-4 justify-center">
                                    <button
                                      onClick={() => onNavigate('product', { slug: item.slug })}
                                      className="text-xs font-bold uppercase tracking-tighter text-[#C9A96E] border-b border-[#C9A96E] pb-1 hover:text-white hover:border-white transition-colors"
                                    >
                                      Détails
                                    </button>
                                    <button
                                      onClick={() => handleAddToCart(item, variant)}
                                      className="text-xs font-bold uppercase tracking-tighter text-white bg-[#C9A96E] px-4 py-1 rounded hover:bg-white hover:text-black transition-all"
                                    >
                                      Ajouter au Panier
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </FadeInOnLoad>
  );
};