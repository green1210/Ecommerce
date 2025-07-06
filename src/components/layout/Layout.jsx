import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import CartSidebar from '../cart/CartSidebar';
import Notification from '../ui/Notification';

const Layout = () => {
  const { mobileMenuOpen, cartOpen, notification } = useSelector((state) => state.ui);
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <MobileMenu isOpen={mobileMenuOpen} />
      <CartSidebar isOpen={cartOpen} />
      
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type || 'info'} 
        />
      )}
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;