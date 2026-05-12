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

// Composant Modal pour les détails du produit
const ProductModal = ({ product, onClose, onAddToCart }: { product: Product & { variants: ProductVariant[] }, onClose: () => void, onAddToCart: (p: Product, v: ProductVariant) => void }) => {
  const variant = product.variants[0] || { color: 'Standard', sizes: ['S', 'M', 'L'] };
  
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Bonjour Chambre 69, je souhaite commander l'article : ${product.name} (Marque: ${product.brand_id || ''})`);
    window.open(`https://wa.me/22900000000?text=${message}`, '_blank'); // Remplacez par le vrai numéro
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>
          <p className="text-[#C9A96E] text-xs font-black uppercase tracking-[0.4em] mb-8">{product.collection || 'Collection Exclusive'}</p>
          
          <div className="space-y-6 mb-10">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description || 'Une pièce d\'exception conçue pour sublimer votre élégance naturelle.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Couleur</h4>
                <p className="text-gray-900 font-medium">{variant.color}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tailles</h4>
                <p className="text-gray-900 font-medium">{variant.sizes.join(', ')}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Entretien</h4>
              <p className="text-gray-600 text-sm italic">{product.care_instructions || 'Lavage à la main recommandé, séchage à plat.'}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { onAddToCart(product, variant as ProductVariant); onClose(); }}
              className="w-full bg-black text-white text-[10px] font-bold uppercase tracking-widest py-4 rounded-full hover:bg-gray-800 transition-all shadow-xl"
            >
              Ajouter au Panier
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-widest py-4 rounded-full hover:bg-[#128C7E] transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ShopPage = ({ onNavigate }: ShopPageProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<string, string>>({});
  const [selectedCollections, setSelectedCollections] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<(Product & { variants: ProductVariant[] }) | null>(null);
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
          !['backend', 'project_room69', 'node_modules', 'project', '.git', '.vscode'].includes(b.name.toLowerCase())
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
        <div className="text-xl font-serif text-[#C9A96E] animate-pulse italic">Préparation de votre univers...</div>
      </div>
    );
  }

  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-white pt-36 pb-20 px-4 text-gray-900 font-sans">
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={handleAddToCart}
          />
        )}

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

          {/* Grille des Marques */}
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
                      src={brand.image_url || 'https://via.placeholder.com/150'}
                      alt={brand.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=' + brand.name)}
                    />
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
                  <div className="text-center mb-16 px-4">
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-12 tracking-tight transition-colors duration-500 hover:text-[#C9A96E]">
                      {brand.name}
                    </h2>
                    
                    {subcategories.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-6 mb-12 border-y border-gray-50 py-6">
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

                  {finalProducts.length === 0 ? (
                    <div className="text-center py-20">
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
                                isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-20 grayscale hover:grayscale-0 hover:opacity-100'
                              }`}
                              style={{ width: '320px' }}
                            >
                              <div
                                className="relative bg-white overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-2xl border border-gray-50"
                                style={{ height: '480px' }}
                              >
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-110"
                                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/500?text=' + item.name)}
                                />
                                
                                {/* Overlay On Hover - Buttons appear ONLY on hover */}
                                <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item, variant); }}
                                    className="bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:bg-[#C9A96E] transition-all shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-500"
                                  >
                                    Ajouter au Panier
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); }}
                                    className="bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded-full hover:bg-gray-100 transition-all shadow-2xl transform translate-y-4 group-hover:translate-y-0 duration-700"
                                  >
                                    Détails
                                  </button>
                                </div>
                              </div>
                              <div className={`mt-10 text-center transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <h5 className="text-2xl font-serif font-bold text-gray-900 mb-2">{item.name}</h5>
                                <p className="text-[9px] text-[#C9A96E] font-black uppercase tracking-[0.4em]">{selectedCol || 'Collection Exclusive'}</p>
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