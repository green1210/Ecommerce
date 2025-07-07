import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';
import CartSidebar from '../cart/CartSidebar';
import Notification from '../ui/Notification';
import { closeCart, closeMobileMenu } from '../../store/slices/uiSlice';

const Layout = () => {
  const { mobileMenuOpen, cartOpen, notification } = useSelector((state) => state.ui);
  const location = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Only close cart and mobile menu when navigating to different pages
    // Don't close them on initial load or when staying on the same page
    const shouldCloseOverlays = location.pathname !== '/cart' && location.pathname !== '/checkout';
    
    if (shouldCloseOverlays) {
      if (cartOpen) {
        dispatch(closeCart());
      }
      if (mobileMenuOpen) {
        dispatch(closeMobileMenu());
      }
    }
  }, [location.pathname, dispatch]);
  
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
