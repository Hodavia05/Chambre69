import { Search, User, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleWhatsApp = () => {
    window.open('https://wa.me/33123456789', '_blank');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = form.search.value.trim();
    if (query) {
      onNavigate(`shop?search=${encodeURIComponent(query)}`);
    } else {
      onNavigate('shop');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Première ligne : recherche | logo | icônes */}
        <div className="flex items-center justify-between h-20">
          {/* Recherche */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative max-w-xs">
              <input
                type="text"
                name="search"
                placeholder="Vous recherchez quelque chose ?"
                className="w-full border-b border-[#C9A96E] py-2 pr-8 text-white placeholder-gray-400 bg-transparent focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#C9A96E] hover:text-white transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Logo centré */}
          <div className="flex-1 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="focus:outline-none cursor-pointer"
              aria-label="Accueil"
            >
              <img
                src="src/assets/logo-chambre69.png"
                alt="Chambre 69"
                className="max-w-[300px] mx-auto h-auto"
              />
            </button>
          </div>

          {/* Icônes à droite avec texte */}
          <div className="flex-1 flex items-center justify-end space-x-6">
            <button
              onClick={() => onNavigate('login')}
              className="flex flex-col items-center text-[#C9A96E] hover:text-white transition-colors"
              aria-label="Se connecter"
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Se connecter</span>
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex flex-col items-center text-[#C9A96E] hover:text-white transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="text-xs mt-1">Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C9A96E] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center text-[#C9A96E] hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs mt-1">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center space-x-8 py-3 border-t border-[#C9A96E]/30">
          <button
            onClick={() => onNavigate('home')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'home'
                ? 'text-white'
                : 'text-[#C9A96E] hover:text-white'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'shop'
                ? 'text-white'
                : 'text-[#C9A96E] hover:text-white'
            }`}
          >
            Boutique
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'about'
                ? 'text-white'
                : 'text-[#C9A96E] hover:text-white'
            }`}
          >
            À propos
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`text-sm tracking-wide transition-colors ${
              currentPage === 'contact'
                ? 'text-white'
                : 'text-[#C9A96E] hover:text-white'
            }`}
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
};