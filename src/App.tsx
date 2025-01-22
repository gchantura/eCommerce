import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CategoryCard from './components/CategoryCard';
import CartModal from './components/CartModal';
import ProductDetails from './components/ProductDetails';
import ProductFilters from './components/ProductFilters';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import { FilterState, Product, Category } from './types';
import { api } from './services/api';
import { ErrorBoundary } from './components/ErrorBoundary';

function MainContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('authState');
    if (!saved) return false;
    const { timestamp, isLoggedIn } = JSON.parse(saved);
    return Date.now() - timestamp < 2 * 60 * 1000 ? isLoggedIn : false;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('authState');
    if (!saved) return false;
    const { timestamp, isAdmin } = JSON.parse(saved);
    return Date.now() - timestamp < 2 * 60 * 1000 ? isAdmin : false;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'featured',
    minPrice: 0,
    maxPrice: 0,
    rating: 0,
    onSale: false,
    inStock: false
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        
        // Ensure we have arrays
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to connect to the server. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      if (isLoggedIn) {
        localStorage.setItem('authState', JSON.stringify({
          isLoggedIn,
          isAdmin,
          timestamp: Date.now()
        }));
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    const intervalId = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime >= 2 * 60 * 1000) {
        handleLogout();
      }
    }, 30000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(intervalId);
    };
  }, [isLoggedIn, isAdmin, lastActivity]);

  const currentSection = location.pathname.split('/')[1] || 'home';

  const handleLogin = (isAdminUser: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdminUser);
    setLastActivity(Date.now());
    setIsAuthModalOpen(false);
    localStorage.setItem('authState', JSON.stringify({
      isLoggedIn: true,
      isAdmin: isAdminUser,
      timestamp: Date.now()
    }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('authState');
    if (currentSection === 'admin') navigate('/');
  };

  const handleLoginClick = () => {
    isLoggedIn ? handleLogout() : setIsAuthModalOpen(true);
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const product = await api.createProduct(newProduct);
      setProducts([...products, product]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery.toLowerCase().trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesPrice = (!filters.minPrice || parseFloat(String(product.price)) >= filters.minPrice) &&
      (!filters.maxPrice || parseFloat(String(product.price)) <= filters.maxPrice);
    const matchesRating = !filters.rating || product.rating >= filters.rating;
    const matchesSale = !filters.onSale || product.onSale;
    const matchesStock = !filters.inStock || product.stock > 0;

    return matchesSearch && matchesCategory && matchesPrice &&
      matchesRating && matchesSale && matchesStock;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc': return parseFloat(String(a.price)) - parseFloat(String(b.price));
      case 'price-desc': return parseFloat(String(b.price)) - parseFloat(String(a.price));
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'rating-desc': return b.rating - a.rating;
      default: return 0;
    }
  });

  const addToCart = (productId: number) => {
    setCartItems([...cartItems, productId]);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(id => id !== productId));
  };

  const cartProducts = cartItems.map(id => products.find(p => p.id === id)!);
  const cartTotal = cartProducts.reduce((sum, product) => 
    sum + parseFloat(String(product.price)), 0);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigate('/shop');
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const handleAddCategory = (newCategory: Category) => {
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category?.image) {
      try {
        await api.deleteImage(category.image);
      } catch (error) {
        console.error('Error deleting category image:', error);
      }
    }
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'admin':
        return isAdmin ? (
          <AdminDashboard
            onAddProduct={addProduct}
            onDeleteProduct={handleDeleteProduct}
            onEditProduct={handleEditProduct}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            products={products}
            categories={categories}
          />
        ) : (
          <Navigate to="/" replace />
        );
      case 'shop':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onCategoryChange={setSelectedCategory}
                  categories={categories}
                  selectedCategory={selectedCategory}
                />
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'categories':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category.name)}
                />
              ))}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Us</h2>
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700">
                Welcome to ShopStyle, your premier destination for premium lifestyle products.
                We curate the finest selection of electronics, accessories, and fashion items
                to help you express your unique style.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="relative">
              <div className="absolute inset-0">
                <img
                  className="w-full h-[500px] object-cover"
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
                  alt="Hero"
                />
                <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
              </div>

              <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Discover Your Style
                </h1>
                <p className="mt-6 text-xl text-gray-100 max-w-3xl">
                  Explore our curated collection of premium products designed to elevate your lifestyle.
                </p>
                <div className="mt-10">
                  <button
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-100"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => handleCategoryClick(category.name)}
                  />
                ))}
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItemsCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        isAdmin={isAdmin}
      />

      <Routes>
        <Route path="/" element={<div className="pt-16">{renderSection()}</div>} />
        <Route path="/shop" element={<div className="pt-16">{renderSection()}</div>} />
        <Route path="/categories" element={<div className="pt-16">{renderSection()}</div>} />
        <Route path="/about" element={<div className="pt-16">{renderSection()}</div>} />
        <Route path="/admin" element={<div className="pt-16">{renderSection()}</div>} />
        <Route
          path="/product/:id"
          element={
            <div className="pt-16">
              <ProductDetails
                products={products}
                onAddToCart={addToCart}
              />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={cartProducts}
        onRemoveItem={removeFromCart}
        total={cartTotal}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md w-full"
                />
                <button className="w-full sm:w-auto px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-100">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">ShopStyle</h3>
              <p className="text-sm">
                Your destination for premium lifestyle products.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => navigate('/shop')} className="hover:text-white">Shop</button></li>
                <li><button onClick={() => navigate('/categories')} className="hover:text-white">Categories</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white">About</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><button className="hover:text-white">Contact Us</button></li>
                <li><button className="hover:text-white">Shipping Policy</button></li>
                <li><button className="hover:text-white">Returns & Exchanges</button></li>
                <li><button className="hover:text-white">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
              <ul className="space-y-2">
                <li><button className="hover:text-white">Instagram</button></li>
                <li><button className="hover:text-white">Facebook</button></li>
                <li><button className="hover:text-white">Twitter</button></li>
                <li><button className="hover:text-white">Pinterest</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            <p>&copy; 2024 ShopStyle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MainContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;