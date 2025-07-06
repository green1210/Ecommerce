import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck, Headphones, Star, Award, Users, Globe, Zap, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import LazyImage from '../components/ui/LazyImage';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  // Get featured products for display
  const featuredProducts = items.filter(product => product.featured).slice(0, 8);
  
  // Animation configurations
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };
  
  if (loading && items.length === 0) {
    return <LoadingSpinner size="lg" />;
  }
  
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free delivery on orders over $75 worldwide",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Your payment information is safe and secure",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it, day or night",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Only the finest products make it to our store",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ];
  
  const stats = [
    { number: "50K+", label: "Happy Customers", hoverColor: "group-hover:text-blue-600" },
    { number: "1000+", label: "Premium Products", hoverColor: "group-hover:text-purple-600" },
    { number: "4.9", label: "Average Rating", hoverColor: "group-hover:text-pink-600" }
  ];
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 md:space-y-8 text-center lg:text-left"
            >
              <div className="space-y-4 md:space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  New Collection Available
                </motion.div>
                
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tight">
                  Find Your
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Zen Style
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                  Discover premium products that bring balance to your lifestyle. 
                  Shop mindfully with Zenlify's curated collection.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products">
                  <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/products?featured=true">
                  <Button variant="outline" size="lg" className="border-2 border-slate-300 hover:border-blue-500 hover:text-blue-600 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                    View Featured
                  </Button>
                </Link>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-slate-200">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`text-2xl md:text-3xl font-black text-slate-900 ${stat.hoverColor} transition-colors`}>
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm text-slate-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative order-first lg:order-last"
            >
              <div className="relative">
                {/* Floating animation elements */}
                <motion.div 
                  className="absolute -top-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-20 blur-xl"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 blur-xl"
                  animate={{ 
                    rotate: [360, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-white/20">
                  <LazyImage
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Premium Shopping Experience"
                    className="w-full h-64 md:h-96 object-cover rounded-xl md:rounded-2xl shadow-lg"
                  />
                  
                  {/* Floating badges */}
                  <motion.div 
                    className="absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ✨ Premium Quality
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg"
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🚚 Free Shipping
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6">
              Why Choose Zenlify?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              We're committed to providing you with the most zen shopping experience possible
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="text-center group cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.bgColor} rounded-2xl md:rounded-3xl mb-4 md:mb-6 group-hover:shadow-xl transition-all duration-300 border border-white/50`}>
                  <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 md:mb-0"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 md:mb-4">
                Featured Products
              </h2>
              <p className="text-slate-600 text-base md:text-lg font-medium">Handpicked items for your zen lifestyle</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/products" className="group flex items-center text-blue-600 hover:text-blue-700 font-semibold text-base md:text-lg transition-colors">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
          >
            {featuredProducts.map(product => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">
                Stay in the Loop
              </h2>
              <p className="text-lg md:text-xl mb-8 md:mb-10 text-blue-100 font-medium">
                Subscribe to our newsletter and get 15% off your first order
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg font-medium text-sm md:text-base"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
                >
                  Subscribe
                </Button>
              </form>
              
              <p className="text-sm text-blue-200 mt-4 md:mt-6 font-medium">
                No spam, unsubscribe at any time
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;