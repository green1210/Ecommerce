import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleMobileMenu, toggleCart } from '../../store/slices/uiSlice';
import { setFilter } from '../../store/slices/productsSlice';
import { Search, ShoppingBag, User, Menu, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { cartOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setFilter({ type: 'searchQuery', value: searchQuery.trim() }));
      navigate('/products');
    }
  };

  const updateSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Cart button clicked, current cartOpen state:', cartOpen);
    dispatch(toggleCart());
  };

  const openMobileMenu = () => dispatch(toggleMobileMenu());

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/products?category=electronics", label: "Electronics" },
    { to: "/products?category=men's clothing", label: "Men's" },
    { to: "/products?category=women's clothing", label: "Women's" }
  ];

  const headerClasses = `fixed w-full z-50 transition-all duration-500 ${
    isScrolled 
      ? 'bg-white/95 backdrop-blur-xl shadow-xl py-2 md:py-3 border-b border-slate-200/50' 
      : 'bg-transparent py-4 md:py-6'
  }`;

  const searchInputClasses = `w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 rounded-xl md:rounded-2xl transition-all duration-300 font-medium text-sm md:text-base ${
    isScrolled 
      ? 'bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-300 shadow-lg' 
      : 'bg-white/90 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-blue-300 shadow-lg'
  }`;

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={headerClasses}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <motion.div 
              className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <ShoppingCart className="text-white h-4 w-4 md:h-6 md:w-6" />
            </motion.div>
            <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Zenlify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6 lg:space-x-8">
            {navigationLinks.map((link, index) => (
              <Link key={index} to={link.to} className="nav-link relative group font-semibold">
                <span className="text-slate-700 hover:text-blue-600 transition-colors text-sm lg:text-base">{link.label}</span>
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Search & Actions */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <motion.div 
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'w-72 xl:w-80' : 'w-48 xl:w-64'
                }`}
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className={searchInputClasses}
                  value={searchQuery}
                  onChange={updateSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <Search className="absolute left-3 md:left-4 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-slate-500" />
                
                <AnimatePresence>
                  {isSearchFocused && searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl md:rounded-2xl shadow-2xl border border-slate-200 p-4 backdrop-blur-xl z-50"
                    >
                      <div className="text-sm text-slate-600 font-medium">
                        Press Enter to search for "{searchQuery}"
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </form>
            
            {/* Cart Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCartClick}
              className="relative p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors group shadow-lg bg-white/80 backdrop-blur-sm"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
              <AnimatePresence>
                {totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 md:-top-2 -right-1 md:-right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center font-bold shadow-lg"
                  >
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            {/* User Account */}
            <Link 
              to={isAuthenticated ? "/profile" : "/login"}
              className="p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-slate-100 transition-colors group shadow-lg bg-white/80 backdrop-blur-sm"
              aria-label="User account"
            >
              <User className="h-5 w-5 md:h-6 md:w-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
            </Link>
          </div>

          {/* Mobile Search & Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 lg:hidden">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-32 md:w-40 pl-8 pr-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchQuery}
                onChange={updateSearchQuery}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            </form>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCartClick}
              className="relative p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
              <AnimatePresence>
                {totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  >
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openMobileMenu}
              className="p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
