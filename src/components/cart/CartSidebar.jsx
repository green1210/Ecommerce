import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { closeCart } from '../../store/slices/uiSlice';
import { removeItemFromCart, removeEntireItem } from '../../store/slices/cartSlice';
import CartItem from './CartItem';
import Button from '../ui/Button';

const CartSidebar = ({ isOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  
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
  
  const handleCloseCart = () => {
    dispatch(closeCart());
  };
  
  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };
  
  const handleRemoveEntireItem = (id) => {
    dispatch(removeEntireItem(id));
  };

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    // Close the cart first
    dispatch(closeCart());
    // Small delay to ensure cart closes before navigation
    setTimeout(() => {
      navigate('/checkout');
    }, 100);
  };

  const handleContinueShoppingClick = () => {
    dispatch(closeCart());
  };
  
  const cartVariants = {
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
            onClick={handleCloseCart}
          />
          
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-96 md:w-[28rem] bg-white z-50 shadow-xl flex flex-col"
            initial="closed"
            animate="open"
            exit="closed"
            variants={cartVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3 text-blue-600" />
                <span className="text-lg md:text-xl font-bold text-slate-900">
                  Cart ({totalQuantity})
                </span>
              </div>
              <button
                onClick={handleCloseCart}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 md:px-6 text-center">
                  <ShoppingBag className="h-16 w-16 md:h-20 md:w-20 text-slate-300 mb-4 md:mb-6" />
                  <h3 className="text-lg md:text-xl font-semibold text-slate-700 mb-2">Your cart is empty</h3>
                  <p className="text-slate-500 mb-6 md:mb-8 text-sm md:text-base">
                    Discover amazing products and add them to your cart
                  </p>
                  <Button onClick={handleContinueShoppingClick} className="w-full max-w-xs">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-4 md:p-6">
                  <ul className="space-y-4 md:space-y-6">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={() => handleRemoveItem(item.id)}
                        onRemoveEntire={() => handleRemoveEntireItem(item.id)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 md:p-6 border-t bg-slate-50">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold text-slate-900">Subtotal</span>
                    <span className="text-lg md:text-xl font-bold text-slate-900">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 text-center">
                    Shipping and taxes calculated at checkout
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleCheckoutClick}
                      className="w-full text-sm md:text-base py-3 md:py-4"
                    >
                      Checkout
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleContinueShoppingClick} 
                      className="w-full text-sm md:text-base py-2 md:py-3"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
