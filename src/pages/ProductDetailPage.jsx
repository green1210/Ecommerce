import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus, Heart, Share, ShoppingBag, Star, TruckIcon, Loader2 } from 'lucide-react';
import { fetchProductById } from '../store/slices/productsSlice';
import { addItemToCart } from '../store/slices/cartSlice';
import { showNotification } from '../store/slices/uiSlice';
import Button from '../components/ui/Button';
import ProductCard from '../components/products/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, items, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    
    return () => {
      setQuantity(1);
      setActiveImageIndex(0);
    };
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    if (selectedProduct) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addItemToCart(selectedProduct));
      }
      
      dispatch(showNotification({
        message: `${selectedProduct.name} (×${quantity}) added to cart`,
        type: 'success',
      }));
    }
  };
  
  const handleToggleWishlist = () => {
    setIsWishlist(!isWishlist);
    
    if (selectedProduct) {
      dispatch(showNotification({
        message: isWishlist 
          ? `${selectedProduct.name} removed from wishlist` 
          : `${selectedProduct.name} added to wishlist`,
        type: 'info',
      }));
    }
  };
  
  const relatedProducts = selectedProduct
    ? items
        .filter(
          (product) =>
            product.category === selectedProduct.category && product.id !== selectedProduct.id
        )
        .slice(0, 4)
    : [];
  
  if (loading && !selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  if (error || !selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-neutral-600 mb-6">
          Sorry, the product you're looking for doesn't exist or is no longer available.
        </p>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-neutral-500 hover:text-neutral-700">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-neutral-400" />
              <Link to="/products" className="ml-1 text-neutral-500 hover:text-neutral-700">Products</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-neutral-400" />
              <Link to={`/products?category=${selectedProduct.category}`} className="ml-1 text-neutral-500 hover:text-neutral-700">{selectedProduct.category}</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="h-4 w-4 text-neutral-400" />
              <span className="ml-1 text-neutral-700 font-medium" aria-current="page">
                {selectedProduct.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      
      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-square overflow-hidden rounded-lg bg-neutral-100"
          >
            <img
              src={selectedProduct.images[activeImageIndex]}
              alt={selectedProduct.name}
              className="h-full w-full object-cover object-center"
            />
          </motion.div>
          
          {selectedProduct.images.length > 1 && (
            <div className="flex space-x-4">
              {selectedProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative h-20 w-20 rounded-md overflow-hidden ${
                    activeImageIndex === index
                      ? 'ring-2 ring-primary-500'
                      : 'ring-1 ring-neutral-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${selectedProduct.name} - View ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-2 text-sm text-neutral-500">{selectedProduct.brand}</div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">{selectedProduct.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5"
                  fill={i < Math.floor(selectedProduct.rating) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-neutral-600">
              {selectedProduct.rating} rating
            </span>
          </div>
          
          {/* Price */}
          <div className="text-2xl font-bold text-neutral-900 mb-6">
            ${selectedProduct.price.toFixed(2)}
          </div>
          
          {/* Description */}
          <div className="prose prose-sm mb-8 text-neutral-600">
            <p>{selectedProduct.description}</p>
          </div>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-neutral-300 rounded-l-md hover:bg-neutral-100"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="text"
                id="quantity"
                className="w-16 p-2 text-center border-t border-b border-neutral-300"
                value={quantity}
                readOnly
              />
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="p-2 border border-neutral-300 rounded-r-md hover:bg-neutral-100"
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Add to Cart & Wishlist */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
            <Button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center"
              disabled={selectedProduct.countInStock === 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {selectedProduct.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              className="flex items-center justify-center"
            >
              <Heart
                className={`h-5 w-5 ${isWishlist ? 'fill-accent-500 text-accent-500' : ''}`}
              />
              <span className="ml-2 hidden sm:inline">{isWishlist ? "Added to Wishlist" : "Add to Wishlist"}</span>
            </Button>
          </div>
          
          {/* Shipping & Returns */}
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <div className="flex items-start">
              <TruckIcon className="h-5 w-5 text-neutral-500 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium">Free Shipping</h3>
                <p className="text-sm text-neutral-500">Free standard shipping on orders over $75</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-5 w-5 text-neutral-500 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium">Easy Returns</h3>
                <p className="text-sm text-neutral-500">Return within 30 days for a full refund</p>
              </div>
            </div>
          </div>
          
          {/* Share */}
          <div className="mt-6 flex items-center">
            <span className="text-sm text-neutral-500 mr-3">Share:</span>
            <div className="flex space-x-4">
              <button className="text-neutral-400 hover:text-primary-500">
                <Share className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;