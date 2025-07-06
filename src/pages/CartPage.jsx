import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { removeItemFromCart, removeEntireItem, clearCart } from '../store/slices/cartSlice';
import { closeCart } from '../store/slices/uiSlice';
import Button from '../components/ui/Button';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  const getShippingCost = () => {
    if (totalAmount >= 75) return 0;
    
    switch (shippingMethod) {
      case 'express':
        return 14.99;
      case 'nextDay':
        return 24.99;
      case 'standard':
      default:
        return 5.99;
    }
  };
  
  const getTaxAmount = () => {
    return totalAmount * 0.085;
  };
  
  const calculateTotal = () => {
    return totalAmount + getShippingCost() + getTaxAmount();
  };
  
  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };
  
  const handleRemoveEntireItem = (id) => {
    dispatch(removeEntireItem(id));
  };

  const handleCheckoutClick = () => {
    // Ensure cart sidebar is closed when navigating to checkout
    dispatch(closeCart());
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };
  
  return (
    <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-6">
            <ShoppingBag className="h-16 w-16 mx-auto text-slate-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-slate-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4 md:space-y-6"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex flex-col sm:flex-row border border-slate-200 rounded-xl p-4 md:p-6 bg-white shadow-sm"
              >
                <div className="w-full sm:w-24 md:w-32 h-24 md:h-32 mb-4 sm:mb-0 flex-shrink-0">
                  <Link to={`/products/${item.id}`}>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </Link>
                </div>
                
                <div className="flex-1 sm:ml-4 md:ml-6">
                  <div className="flex flex-col sm:flex-row justify-between mb-4">
                    <div className="flex-1">
                      <Link to={`/products/${item.id}`} className="text-base md:text-lg font-semibold text-slate-900 hover:text-blue-500 line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">{item.brand}</p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0 sm:ml-4">
                      <p className="text-base md:text-lg font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 hover:bg-slate-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <span className="px-3 md:px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => {}}
                        className="p-2 hover:bg-slate-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <span className="font-bold text-lg">+</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveEntireItem(item.id)}
                      className="text-slate-500 hover:text-red-500 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="mt-3 text-right">
                    <p className="text-sm text-slate-600">
                      Item total: <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-200 gap-4">
              <Link to="/products" className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Continue Shopping</span>
              </Link>
              
              <Button variant="outline" onClick={() => dispatch(clearCart())}>
                Clear Cart
              </Button>
            </div>
          </motion.div>
          
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-4 md:p-6 rounded-xl sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 md:space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal ({totalQuantity} items)</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div>
                  <span className="text-slate-600 block mb-2">Shipping</span>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 mr-2"
                      />
                      <span>
                        Standard Shipping (3-5 business days) - 
                        {totalAmount >= 75 ? (
                          <span className="text-green-500 font-medium"> Free</span>
                        ) : (
                          <span> $5.99</span>
                        )}
                      </span>
                    </label>
                    
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 mr-2"
                      />
                      <span>Express Shipping (2-3 business days) - $14.99</span>
                    </label>
                    
                    <label className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="shipping"
                        value="nextDay"
                        checked={shippingMethod === 'nextDay'}
                        onChange={() => setShippingMethod('nextDay')}
                        className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 mr-2"
                      />
                      <span>Next Day Delivery - $24.99</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">${getShippingCost().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax (8.5%)</span>
                  <span className="font-medium">${getTaxAmount().toFixed(2)}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <Link to="/checkout" onClick={handleCheckoutClick}>
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;