import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { createOrder } from '../services/api';
import { clearCart } from '../store/slices/cartSlice';
import { showNotification } from '../store/slices/uiSlice';
import Button from '../components/ui/Button';

const CheckoutPage = () => {
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(isAuthenticated ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  });
  
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [guestEmail, setGuestEmail] = useState('');
  
  const shippingCost = 5.99;
  const taxAmount = totalAmount * 0.085;
  const orderTotal = totalAmount + shippingCost + taxAmount;
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmailChange = (e) => {
    setGuestEmail(e.target.value);
  };
  
  const handleContinueAsGuest = (e) => {
    e.preventDefault();
    if (guestEmail.trim() !== '') {
      setStep(1);
    }
  };
  
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        orderItems: items.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.quantity,
          image: item.images[0],
          price: item.price,
          product: item.id,
        })),
        shippingAddress: {
          address: shippingData.address,
          city: shippingData.city,
          postalCode: shippingData.zipCode,
          country: shippingData.country,
        },
        paymentMethod: 'Credit Card',
        taxPrice: taxAmount,
        shippingPrice: shippingCost,
        totalPrice: orderTotal,
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      await createOrder(orderData);
      
      dispatch(clearCart());
      setIsComplete(true);
      
      dispatch(showNotification({
        message: 'Order placed successfully!',
        type: 'success',
      }));
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to place order. Please try again.',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (items.length === 0 && !isComplete) {
    return (
      <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-slate-600 mb-6">
          Add some products to your cart before proceeding to checkout.
        </p>
        <Link to="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }
  
  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32 max-w-md text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-slate-600 mb-8">
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
          <p className="text-slate-500 mb-8">
            You will receive an email confirmation shortly.
          </p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
        <Link 
          to="/cart" 
          className="text-blue-500 hover:text-blue-600 flex items-center text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to Cart</span>
        </Link>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${
            step >= 0 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            1
          </div>
          <div className={`h-1 flex-1 ${
            step >= 1 ? 'bg-blue-500' : 'bg-slate-200'
          }`} />
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${
            step >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            2
          </div>
          <div className={`h-1 flex-1 ${
            step >= 2 ? 'bg-blue-500' : 'bg-slate-200'
          }`} />
          <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${
            step >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs md:text-sm">
          <span className={step >= 0 ? 'text-blue-500 font-medium' : 'text-slate-500'}>
            {isAuthenticated ? 'Account' : 'Guest Checkout'}
          </span>
          <span className={step >= 1 ? 'text-blue-500 font-medium' : 'text-slate-500'}>
            Shipping
          </span>
          <span className={step >= 2 ? 'text-blue-500 font-medium' : 'text-slate-500'}>
            Payment
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6 border border-slate-200">
              <h2 className="text-lg md:text-xl font-bold mb-4">Guest Checkout</h2>
              <p className="text-slate-600 mb-4 text-sm md:text-base">
                Enter your email to continue as a guest, or 
                <Link to="/login" className="text-blue-500 hover:text-blue-600 ml-1">
                  login
                </Link> to use your saved information.
              </p>
              
              <form onSubmit={handleContinueAsGuest}>
                <div className="mb-4">
                  <label htmlFor="guestEmail" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="guestEmail"
                    name="guestEmail"
                    value={guestEmail}
                    onChange={handleEmailChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    placeholder="your@email.com"
                  />
                </div>
                
                <Button type="submit" className="w-full">Continue as Guest</Button>
              </form>
            </div>
          )}
          
          {step === 1 && (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6 border border-slate-200">
              <h2 className="text-lg md:text-xl font-bold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleShippingSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingData.firstName}
                      onChange={handleShippingChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingData.lastName}
                      onChange={handleShippingChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingData.address}
                    onChange={handleShippingChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-1">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingData.zipCode}
                      onChange={handleShippingChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingData.country}
                    onChange={handleShippingChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingData.phone}
                    onChange={handleShippingChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
                
                <Button type="submit" className="w-full">Continue to Payment</Button>
              </form>
            </div>
          )}
          
          {step === 2 && (
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm mb-6 border border-slate-200">
              <h2 className="text-lg md:text-xl font-bold mb-4">Payment Information</h2>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label htmlFor="cardName" className="block text-sm font-medium text-slate-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      required
                      placeholder="•••• •••• •••• ••••"
                      className="w-full p-3 pl-10 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handlePaymentChange}
                      required
                      placeholder="MM/YY"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-slate-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handlePaymentChange}
                      required
                      placeholder="•••"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Processing</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </>
                  ) : (
                    `Pay $${orderTotal.toFixed(2)}`
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 p-4 md:p-6 rounded-xl sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            
            <div className="divide-y divide-slate-200">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex">
                  <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-3 md:ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-sm font-medium">
                      <h3 className="line-clamp-1">{item.name}</h3>
                      <p className="ml-2">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-500">
                      <p>Qty {item.quantity}</p>
                      <p>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (8.5%)</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold">Total</span>
                <span className="font-bold">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;