import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import { fetchProducts, setFilter, clearFilters } from '../store/slices/productsSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const ProductsPage = () => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState('grid');
  
  const location = useLocation();
  const dispatch = useDispatch();
  const { items, filteredItems, filters, loading } = useSelector((state) => state.products);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    // Load products if not already loaded
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
    
    // Apply URL filters
    if (categoryParam) {
      dispatch(setFilter({ type: 'category', value: categoryParam }));
    }
    
    if (searchParam) {
      dispatch(setFilter({ type: 'searchQuery', value: searchParam }));
    }
  }, [dispatch, location.search, items.length]);
  
  const handleCategoryChange = (category) => {
    dispatch(setFilter({ type: 'category', value: category }));
  };
  
  const updatePriceRange = (event, index) => {
    const newValue = parseInt(event.target.value);
    const updatedRange = [...priceRange];
    updatedRange[index] = newValue;
    setPriceRange(updatedRange);
  };
  
  const applyPriceFilter = () => {
    dispatch(setFilter({ type: 'priceRange', value: priceRange }));
  };
  
  const resetAllFilters = () => {
    setPriceRange([0, 2000]);
    dispatch(clearFilters());
  };
  
  const hasActiveFilters = filters.category !== null || 
                          filters.priceRange !== null || 
                          filters.searchQuery !== '';
  
  if (loading && items.length === 0) {
    return <LoadingSpinner size="lg" />;
  }
  
  const availableCategories = Array.from(new Set(items.map(item => item.category)));
  
  const animationVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.4,
        },
      },
    }
  };
  
  const toggleMobileFilters = () => setShowMobileFilters(!showMobileFilters);
  const closeMobileFilters = () => setShowMobileFilters(false);
  
  const removeFilter = (filterType, value = null) => {
    dispatch(setFilter({ type: filterType, value }));
  };
  
  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? "mt-6" : "sticky top-24 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-slate-200"}>
      <div className="border-b border-slate-200 pb-4 md:pb-6">
        <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`block text-sm md:text-base w-full text-left ${
              filters.category === null
                ? 'text-blue-500 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {availableCategories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`block text-sm md:text-base w-full text-left ${
                filters.category === category
                  ? 'text-blue-500 font-medium'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="border-b border-slate-200 py-4 md:py-6">
        <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Min: ${priceRange[0]}</span>
            <span className="text-sm text-slate-600">Max: ${priceRange[1]}</span>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => updatePriceRange(e, 0)}
              className="w-full"
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => updatePriceRange(e, 1)}
              className="w-full"
            />
          </div>
          <Button onClick={applyPriceFilter} className="w-full text-sm">
            Apply Price Filter
          </Button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="py-4 md:py-6">
          <Button variant="outline" onClick={resetAllFilters} className="w-full text-sm">
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
  
  const ActiveFilters = () => {
    if (!hasActiveFilters) return null;
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {filters.category && (
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded-full px-2.5 py-1">
            {filters.category}
            <button
              onClick={() => removeFilter('category')}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
        
        {filters.priceRange && (
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs rounded-full px-2.5 py-1">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
            <button
              onClick={() => removeFilter('priceRange')}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
      <div className="pb-6 md:pb-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Shop Our Products
        </h1>
        <p className="text-slate-600 text-base md:text-lg font-medium">
          {filteredItems.length} products available
        </p>
      </div>
      
      <div className="lg:flex lg:gap-x-6 xl:gap-x-8">
        {/* Mobile filter overlay */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileFilters}
          />
        )}
        
        {/* Mobile filter sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-full bg-white px-4 md:px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10 lg:hidden transform ${
            showMobileFilters ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <button
              type="button"
              className="-mr-2 p-2 text-slate-400 hover:text-slate-500"
              onClick={closeMobileFilters}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <FilterSidebar isMobile={true} />
        </div>
        
        {/* Desktop filters */}
        <div className="hidden lg:block w-1/4 xl:w-1/5">
          <FilterSidebar />
        </div>
        
        {/* Main content area */}
        <div className="mt-6 lg:mt-0 lg:w-3/4 xl:w-4/5">
          {/* Mobile filter button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 md:pb-6 lg:hidden gap-4">
            <Button
              variant="outline"
              onClick={toggleMobileFilters}
              className="flex items-center text-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <ActiveFilters />
          </div>
          
          {/* Desktop controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 md:pb-6 border-b border-slate-200 gap-4">
            <div className="hidden lg:flex lg:items-center">
              <ActiveFilters />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <Button
                variant="text"
                className="flex items-center text-sm font-medium text-slate-700"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>
          
          {/* Products grid */}
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your filters or search term.
              </p>
              <Button variant="outline" onClick={resetAllFilters}>
                Reset All Filters
              </Button>
            </div>
          ) : (
            <motion.div
              variants={animationVariants.container}
              initial="hidden"
              animate="visible"
              className={`pt-6 md:pt-8 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8' 
                  : 'space-y-6'
              }`}
            >
              {filteredItems.map(product => (
                <motion.div key={product.id} variants={animationVariants.item}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;