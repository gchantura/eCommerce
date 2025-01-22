import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItemsCount: number;
  onCartClick: () => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  isAdmin: boolean;
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  cartItemsCount,
  onCartClick,
  isLoggedIn,
  onLoginClick,
  isAdmin
}: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const getCurrentSection = () => {
    return location.pathname.split('/')[1] || 'home';
  };

  const handleNavigation = (section: string) => {
    setIsMobileMenuOpen(false);
    navigate(section === 'home' ? '/' : `/${section}`);
  };

  const isActive = (section: string) => {
    return getCurrentSection() === section;
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              className="sm:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => handleNavigation('home')}
              className="text-2xl font-bold text-gray-900"
            >
              ShopStyle
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('home')}
              className={`text-gray-700 hover:text-gray-900 ${isActive('home') ? 'font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('shop')}
              className={`text-gray-700 hover:text-gray-900 ${isActive('shop') ? 'font-semibold' : ''}`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavigation('categories')}
              className={`text-gray-700 hover:text-gray-900 ${isActive('categories') ? 'font-semibold' : ''}`}
            >
              Categories
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className={`text-gray-700 hover:text-gray-900 ${isActive('about') ? 'font-semibold' : ''}`}
            >
              About
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavigation('admin')}
                className={`text-gray-700 hover:text-gray-900 ${isActive('admin') ? 'font-semibold' : ''}`}
              >
                Admin
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </button>
            <button
              className="p-2 relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={onLoginClick}
              className="text-gray-700 hover:text-gray-900"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (getCurrentSection() !== 'shop') {
                  handleNavigation('shop');
                }
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation('home')}
                className={`text-gray-700 hover:text-gray-900 ${isActive('home') ? 'font-semibold' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('shop')}
                className={`text-gray-700 hover:text-gray-900 ${isActive('shop') ? 'font-semibold' : ''}`}
              >
                Shop
              </button>
              <button
                onClick={() => handleNavigation('categories')}
                className={`text-gray-700 hover:text-gray-900 ${isActive('categories') ? 'font-semibold' : ''}`}
              >
                Categories
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className={`text-gray-700 hover:text-gray-900 ${isActive('about') ? 'font-semibold' : ''}`}
              >
                About
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleNavigation('admin')}
                  className={`text-gray-700 hover:text-gray-900 ${isActive('admin') ? 'font-semibold' : ''}`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}