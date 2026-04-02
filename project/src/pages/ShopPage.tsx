import { useState, useEffect } from 'react';
import { supabase, Category, Product, ProductVariant } from '../lib/supabase';
import { useCart } from '../context/CartContext';

interface ShopPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialCategorySlug?: string;
}

export const ShopPage = ({ onNavigate, initialCategorySlug }: ShopPageProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<(Product & { variant: ProductVariant })[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategorySlug || null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (data) setCategories(data);
  };

  const loadProducts = async () => {
    let query = supabase.from('products').select('*');

    if (selectedCategory) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    const { data } = await query;

    if (data) {
      const productsWithVariants = await Promise.all(
        data.map(async (product) => {
          const { data: variants } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id)
            .limit(1)
            .maybeSingle();
          return { ...product, variant: variants! };
        })
      );
      setProducts(productsWithVariants);
    }
  };

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    addToCart(product, variant, variant.sizes[0]);
  };

  return (
    <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-4 text-gray-900">
          Boutique
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Découvrez notre collection complète de lingerie haut de gamme
        </p>

        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 text-sm tracking-wide transition-all ${
                selectedCategory === null
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tous les produits
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 text-sm tracking-wide transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Aucun produit disponible dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white group cursor-pointer"
              >
                <div
                  className="relative h-96 bg-gray-100 overflow-hidden mb-4"
                  onClick={() => onNavigate('product', { slug: item.slug })}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="text-lg font-medium mb-2 text-gray-900 group-hover:text-[#E8B4B8] transition-colors cursor-pointer"
                    onClick={() => onNavigate('product', { slug: item.slug })}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Couleur: {item.variant?.color}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Tailles: {item.variant?.sizes.join(', ')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate('product', { slug: item.slug })}
                      className="flex-1 bg-[#111111] text-white px-4 py-2 text-sm hover:bg-[#E8B4B8] transition-colors"
                    >
                      Voir produit
                    </button>
                    <button
                      onClick={() => handleAddToCart(item, item.variant)}
                      className="flex-1 border border-[#111111] text-[#111111] px-4 py-2 text-sm hover:bg-[#111111] hover:text-white transition-colors"
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
