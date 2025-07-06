import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, LogOut, CreditCard, Heart, ShoppingCart } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import Button from '../components/ui/Button';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    dispatch(showNotification({
      message: 'You have been logged out',
      type: 'info',
    }));
    navigate('/');
  };
  
  const orders = [
    {
      id: 'ORD12345',
      date: '2023-05-15',
      total: 349.97,
      status: 'Delivered',
      items: [
        { name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 },
        { name: 'Premium Leather Wallet', quantity: 1, price: 49.98 }
      ]
    },
    {
      id: 'ORD12346',
      date: '2023-06-02',
      total: 159.99,
      status: 'Processing',
      items: [
        { name: 'Designer Sunglasses', quantity: 1, price: 159.99 }
      ]
    }
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={user?.name || ''}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full p-2 border border-slate-300 rounded-xl bg-slate-50"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="(123) 456-7890"
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4 mt-8">Change Password</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder="••••••••"
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="••••••••"
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="w-full p-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
          </div>
        );
      
      case 'orders':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-xl text-center">
                <p className="text-slate-600">You haven't placed any orders yet.</p>
                <Button onClick={() => navigate('/products')} className="mt-4">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between">
                      <div>
                        <p className="font-medium text-slate-900">Order #{order.id}</p>
                        <p className="text-sm text-slate-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                        <Button variant="outline" size="sm" className="ml-4">
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <div>
                            <p className="text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                      
                      <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between">
                        <p className="font-medium">Total</p>
                        <p className="font-bold">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'wishlist':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Wishlist</h2>
            
            <div className="bg-slate-50 p-6 rounded-xl text-center">
              <Heart className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">Your wishlist is empty.</p>
              <Button onClick={() => navigate('/products')} className="mt-4">
                Discover Products
              </Button>
            </div>
          </div>
        );
      
      case 'payment':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
            
            <div className="bg-slate-50 p-6 rounded-xl text-center">
              <CreditCard className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">You haven't added any payment methods yet.</p>
              <Button className="mt-4">
                Add Payment Method
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200"
          >
            <div className="mb-6 text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white mx-auto mb-4">
                <User className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-slate-500">{user?.email}</p>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="h-5 w-5 mr-3" />
                <span>Orders</span>
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className="h-5 w-5 mr-3" />
                <span>Wishlist</span>
              </button>
              
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                  activeTab === 'payment'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-3" />
                <span>Payment Methods</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-3/4 bg-white p-6 rounded-2xl shadow-lg border border-slate-200"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;