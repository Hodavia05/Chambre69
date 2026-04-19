import { useState, useEffect } from 'react';
import { supabase, Product, ProductVariant } from '../lib/supabase';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductPageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

export const ProductPage = ({ slug, onNavigate }: ProductPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (productData) {
      setProduct(productData);

      const { data: variantData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productData.id)
        .limit(1)
        .maybeSingle();

      if (variantData) {
        setVariant(variantData);
        setSelectedSize(variantData.sizes[0]);
      }
    }
  };

  const handleAddToCart = () => {
    if (product && variant && selectedSize) {
      addToCart(product, variant, selectedSize);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Bonjour, je suis intéressé par ce produit :\n\n${product?.name}\nCouleur: ${variant?.color}\nTaille: ${selectedSize}`;
    window.open(`https://wa.me/33123456789?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!product || !variant) {
    return (
      <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5F6] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => onNavigate('shop')}
          className="text-gray-600 hover:text-[#E8B4B8] mb-8 text-sm"
        >
          ← Retour à la boutique
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8">
          <div className="relative h-[600px] bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">
              {product.name}
            </h1>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-gray-900">Couleur:</span> {variant.color}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Taille disponible:
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-[#111111] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-[#E8B4B8]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Entretien</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {product.care_instructions}
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#111111] text-white px-8 py-4 text-sm tracking-wide hover:bg-[#E8B4B8] transition-colors"
              >
                Ajouter au panier
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] text-white px-8 py-4 text-sm tracking-wide hover:bg-[#20BD5A] transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Commander sur WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
