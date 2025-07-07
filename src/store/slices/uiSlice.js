import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobileMenuOpen: false,
  cartOpen: false,
  notification: {
    show: false,
    message: '',
    type: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      // Close cart when opening mobile menu
      if (state.mobileMenuOpen && state.cartOpen) {
        state.cartOpen = false;
      }
    },
    
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    
    toggleCart(state) {
      console.log('toggleCart called, current state:', state.cartOpen);
      state.cartOpen = !state.cartOpen;
      console.log('toggleCart new state:', state.cartOpen);
      // Close mobile menu when opening cart
      if (state.cartOpen && state.mobileMenuOpen) {
        state.mobileMenuOpen = false;
      }
    },
    
    closeCart(state) {
      console.log('closeCart called');
      state.cartOpen = false;
    },
    
    showNotification(state, action) {
      state.notification = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    
    hideNotification(state) {
      state.notification.show = false;
    },
  },
});

export const { 
  toggleMobileMenu, 
  closeMobileMenu, 
  toggleCart, 
  closeCart, 
  showNotification, 
  hideNotification 
} = uiSlice.actions;

export default uiSlice.reducer;
