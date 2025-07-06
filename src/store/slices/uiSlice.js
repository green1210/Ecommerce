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
      if (state.mobileMenuOpen && state.cartOpen) {
        state.cartOpen = false;
      }
    },
    
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
      if (state.cartOpen && state.mobileMenuOpen) {
        state.mobileMenuOpen = false;
      }
    },
    
    closeCart(state) {
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