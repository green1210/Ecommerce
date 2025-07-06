import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, User, Home, ShoppingBag, Phone, ShoppingCart } from 'lucide-react';
import { closeMobileMenu } from '../../store/slices/uiSlice';
import { setFilter } from '../../store/slices/productsSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MobileMenu = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const closeMenu = () => {
    dispatch(closeMobileMenu());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setFilter({ type: 'searchQuery', value: searchQuery.trim() }));
      navigate('/products');
      closeMenu();
    }
  };
  
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3,
      },
    },
  };
  
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        delay: 0.2,
        duration: 0.3,
      },
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={closeMenu}
          />
          
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-xl flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-500 to-purple-500">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-xl font-bold text-white">Zenlify</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Search */}
            <div className="p-4 border-b bg-slate-50">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-300 transition-all border border-slate-200 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                </div>
              </form>
            </div>
            
            {/* Navigation */}
            <nav className="flex-grow overflow-y-auto">
              <ul className="py-2">
                <li>
                  <Link
                    to="/"
                    className="flex items-center space-x-3 px-4 py-4 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors border-b border-slate-100"
                    onClick={closeMenu}
                  >
                    <Home className="h-5 w-5" />
                    <span className="font-medium">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="flex items-center space-x-3 px-4 py-4 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors border-b border-slate-100"
                    onClick={closeMenu}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="font-medium">All Products</span>
                  </Link>
                </li>
                
                {/* Categories */}
                <li className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  Categories
                </li>
                <li>
                  <Link
                    to="/products?category=electronics"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors pl-8"
                    onClick={closeMenu}
                  >
                    <span className="font-medium">Electronics</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=men's clothing"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors pl-8"
                    onClick={closeMenu}
                  >
                    <span className="font-medium">Men's Fashion</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=women's clothing"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors pl-8"
                    onClick={closeMenu}
                  >
                    <span className="font-medium">Women's Fashion</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products?category=jewelery"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors pl-8 border-b border-slate-100"
                    onClick={closeMenu}
                  >
                    <span className="font-medium">Jewelry</span>
                  </Link>
                </li>
                
                {/* Account */}
                <li>
                  <Link
                    to={isAuthenticated ? "/profile" : "/login"}
                    className="flex items-center space-x-3 px-4 py-4 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors border-b border-slate-100"
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{isAuthenticated ? "My Account" : "Sign In"}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="flex items-center space-x-3 px-4 py-4 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors"
                    onClick={closeMenu}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;