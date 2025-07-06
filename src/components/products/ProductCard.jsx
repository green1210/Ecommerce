import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Eye, Zap } from 'lucide-react';
import { addItemToCart } from '../../store/slices/cartSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Button from '../ui/Button';
import LazyImage from '../ui/LazyImage';

const ProductCard = memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch = useDispatch();
  
  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemToCart(product));
    dispatch(showNotification({
      message: `${product.name} added to cart`,
      type: 'success',
    }));
  };
  
  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
    const message = isWishlist 
      ? `${product.name} removed from wishlist` 
      : `${product.name} added to wishlist`;
    
    dispatch(showNotification({
      message: message,
      type: 'info',
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Calculate discount randomly for some products
  const hasDiscount = Math.random() > 0.7;
  const discountPercent = hasDiscount ? Math.floor(Math.random() * 30) + 10 : null;
  const originalPrice = hasDiscount ? product.price * (1 + discountPercent / 100) : null;
  
  const isLowStock = product.countInStock < 5;
  const isOutOfStock = product.countInStock === 0;
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality would go here
  };
  
  return (
    <div className="group relative h-full">
      <Link 
        to={`/products/${product.id}`}
        className="block h-full bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 transform hover:-translate-y-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Product Image Container */}
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-slate-50 to-slate-100">
          <LazyImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            effect="blur"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Product Badges */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-2 rounded-full shadow-lg z-10">
              Only {product.countInStock} left!
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-2 rounded-full shadow-lg z-10">
              Out of Stock
            </div>
          )}
          
          {product.featured && !hasDiscount && !isLowStock && (
            <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-2 rounded-full shadow-lg flex items-center z-10">
              <Zap className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-2 rounded-full shadow-lg z-10">
              -{discountPercent}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className={`absolute top-2 md:top-4 right-2 md:right-4 p-2 md:p-3 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white transition-all shadow-lg hover:shadow-xl border border-white/20 z-20 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-3 w-3 md:h-4 md:w-4 transition-colors ${isWishlist ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'}`} />
          </button>
          
          {/* Action Buttons */}
          <div className={`absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex gap-2 z-10 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button 
              onClick={addToCart}
              className="flex-1 bg-white/95 backdrop-blur-sm text-slate-900 hover:bg-white border-0 shadow-lg hover:shadow-xl font-semibold text-xs md:text-sm py-2 md:py-3"
              size="sm"
              disabled={isOutOfStock}
            >
              <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl p-2 md:p-3"
              onClick={handleQuickView}
            >
              <Eye className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-3 md:p-6 space-y-2 md:space-y-4">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {product.brand}
          </div>
          
          <h3 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors text-sm md:text-lg line-clamp-2">
            {truncateText(product.name, 50)}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, index) => (
                <Star 
                  key={index} 
                  className={`h-3 w-3 md:h-4 md:w-4 ${
                    index < Math.floor(product.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-slate-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs md:text-sm text-slate-600 font-medium">
              {product.rating.toFixed(1)} ({Math.floor(Math.random() * 100) + 10})
            </span>
          </div>
          
          {/* Price and Category */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-lg md:text-xl font-black text-slate-900">
                  {formatPrice(product.price)}
                </div>
                {originalPrice && (
                  <span className="text-xs md:text-sm text-slate-500 line-through font-medium">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold inline-block">
                  Save {discountPercent}%
                </div>
              )}
            </div>
            
            <div className="text-xs bg-slate-100 text-slate-600 px-2 md:px-3 py-1 md:py-2 rounded-full capitalize font-medium">
              {product.category.replace(/['"]/g, '')}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;