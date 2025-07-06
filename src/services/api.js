import axios from 'axios';

// Create API client for FakeStore API
const fakeStoreClient = axios.create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create API client for our backend
const backendClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to backend requests
backendClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
backendClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product transformation function
const transformProduct = (apiProduct) => ({
  id: apiProduct.id.toString(),
  name: apiProduct.title,
  description: apiProduct.description,
  price: apiProduct.price,
  images: [apiProduct.image, apiProduct.image],
  category: apiProduct.category,
  brand: getBrandFromCategory(apiProduct.category),
  rating: apiProduct.rating?.rate || 4.0,
  countInStock: Math.floor(Math.random() * 50) + 10,
  featured: Math.random() > 0.7,
});

const getBrandFromCategory = (category) => {
  const brandMap = {
    "men's clothing": ['StyleMax', 'UrbanFit', 'ClassicWear', 'ModernMan'],
    "women's clothing": ['EliteStyle', 'FashionForward', 'ChicBoutique', 'TrendSetter'],
    'jewelery': ['LuxJewels', 'DiamondCraft', 'GoldStandard', 'PreciousGems'],
    'electronics': ['TechPro', 'DigitalMax', 'InnovateTech', 'FutureTech'],
  };
  
  const brands = brandMap[category] || ['Premium Brand'];
  return brands[Math.floor(Math.random() * brands.length)];
};

// Product API functions (using FakeStore API)
export const getProducts = async () => {
  try {
    const response = await fakeStoreClient.get('/products');
    return response.data.map(transformProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fakeStoreClient.get(`/products/${id}`);
    return transformProduct(response.data);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Product not found');
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await fakeStoreClient.get(`/products/category/${category}`);
    return response.data.map(transformProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getCategories = async () => {
  try {
    const response = await fakeStoreClient.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

// Authentication API functions (using our backend)
export const login = async (email, password) => {
  try {
    const response = await backendClient.post('/auth/login', {
      email,
      password,
    });
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await backendClient.post('/auth/register', {
      name,
      email,
      password,
    });
    
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await backendClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch profile';
    throw new Error(message);
  }
};

// Order API function (mock for now)
export const createOrder = async (orderData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: 'ORD-' + Date.now(),
    user: '1',
    orderItems: orderData.orderItems,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    taxPrice: orderData.taxPrice,
    shippingPrice: orderData.shippingPrice,
    totalPrice: orderData.totalPrice,
    isPaid: false,
    isDelivered: false,
    createdAt: new Date(),
  };
};

export default backendClient;