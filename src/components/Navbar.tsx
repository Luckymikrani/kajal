import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import SearchDropdown from './SearchDropdown';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/cart', label: 'Cart' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchDropdown(value.length > 0);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchDropdown(false);
      setSearchTerm('');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setShowSearchDropdown(false);
    setSearchTerm('');
  }, [location.pathname]);

  const handleProductClick = () => {
    setShowSearchDropdown(false);
    setSearchTerm('');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center">
              <img 
                src="/my-logo.jpg" 
                alt="KAJAL Boutique" 
                className="h-12 w-12 object-contain mr-3"
              />
              <div>
                <div className="text-xl font-bold text-little-black" style={{ fontFamily: "'Georgia', serif" }}>
                  KAJAL
                </div>
                <div className="text-sm text-gray-600 font-medium -mt-1" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Boutique
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-little-black bg-custom-from'
                    : 'text-gray-700 hover:text-little-black hover:bg-custom-from'
                }`}
              >
                {link.label}
                {link.path === '/cart' && getTotalItems() > 0 && (
                  <span className="ml-1 bg-little-black text-white text-xs rounded-full px-2 py-1">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => searchTerm.length > 0 && setShowSearchDropdown(true)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black sm:text-sm"
                  />
                </div>
              </form>
              {showSearchDropdown && (
                <SearchDropdown
                  products={filteredProducts}
                  searchTerm={searchTerm}
                  onProductClick={handleProductClick}
                />
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.role === 'admin' && <Shield className="h-4 w-4 text-little-black" />}
                  <span className="text-sm font-medium text-little-black">
                    {user.name}
                  </span>
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-little-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-little-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-little-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-little-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-little-black" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-little-black text-white text-xs rounded-full px-2 py-1">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-little-black hover:bg-custom-from"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-custom-from">
              {/* Search on mobile */}
              <div className="relative mb-3" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => searchTerm.length > 0 && setShowSearchDropdown(true)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black sm:text-sm"
                    />
                  </div>
                </form>
                {showSearchDropdown && (
                  <SearchDropdown
                    products={filteredProducts}
                    searchTerm={searchTerm}
                    onProductClick={() => {
                      handleProductClick();
                      setIsMenuOpen(false);
                    }}
                  />
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-little-black bg-white'
                      : 'text-gray-700 hover:text-little-black hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="pt-4 border-t border-gray-300">
                  <div className="flex items-center px-3 py-2">
                    {user.role === 'admin' && <Shield className="h-4 w-4 text-little-black mr-2" />}
                    <span className="text-base font-medium text-little-black">
                      {user.name}
                    </span>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-little-black hover:bg-white"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-white"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-300 space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-little-black text-white hover:opacity-90"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;