import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, ShoppingCart, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-white h-4 w-4 md:h-5 md:w-5" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">Zenlify</h3>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-base">
              Premium shopping experience with curated products for the discerning customer. 
              Elevating your lifestyle with quality and style.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className="p-2 md:p-3 rounded-xl bg-slate-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300 group" 
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 md:h-5 md:w-5 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white">Shop</h3>
            <ul className="space-y-2 md:space-y-3 text-slate-400">
              {[
                { to: "/products", label: "All Products" },
                { to: "/products?category=electronics", label: "Electronics" },
                { to: "/products?category=men's clothing", label: "Men's Fashion" },
                { to: "/products?category=women's clothing", label: "Women's Fashion" },
                { to: "/products?category=jewelery", label: "Jewelry" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="hover:text-white transition-colors font-medium hover:translate-x-1 transform duration-200 inline-block text-sm md:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white">Customer Service</h3>
            <ul className="space-y-2 md:space-y-3 text-slate-400">
              {[
                { to: "/contact", label: "Contact Us" },
                { to: "/faqs", label: "FAQs" },
                { to: "/shipping", label: "Shipping & Returns" },
                { to: "/warranty", label: "Warranty" },
                { to: "/size-guide", label: "Size Guide" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.to} 
                    className="hover:text-white transition-colors font-medium hover:translate-x-1 transform duration-200 inline-block text-sm md:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white">Stay Updated</h3>
            <p className="mb-4 md:mb-6 text-slate-400 font-medium text-sm md:text-base">Subscribe to our newsletter for the latest products and offers.</p>
            <form className="space-y-3 md:space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-slate-800 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 font-medium text-sm md:text-base"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm md:text-base"
                aria-label="Subscribe"
              >
                <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 md:mt-16 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-500 text-xs md:text-sm font-medium flex items-center text-center md:text-left">
            &copy; {currentYear} Zenlify. Made with <Heart className="h-3 w-3 md:h-4 md:w-4 mx-1 text-red-500" /> for amazing shopping experiences.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms of Service" },
              { to: "/cookies", label: "Cookie Policy" }
            ].map((item, index) => (
              <Link 
                key={index}
                to={item.to} 
                className="text-slate-500 hover:text-white text-xs md:text-sm transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;