import express from 'express';
import axios from 'axios';

const router = express.Router();

// FakeStore API configuration
const FAKESTORE_API_BASE = 'https://fakestoreapi.com';

// Create axios instance for FakeStore API
const fakeStoreAPI = axios.create({
  baseURL: FAKESTORE_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all products from FakeStore API
router.get('/', async (req, res) => {
  try {
    console.log('Fetching products from FakeStore API...');
    const response = await fakeStoreAPI.get('/products');
    const products = response.data.map(transformProduct);
    
    console.log(`✅ Successfully fetched ${products.length} products from external API`);
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products from FakeStore API:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch products from external API',
      error: error.message 
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching product ${id} from FakeStore API...`);
    
    const response = await fakeStoreAPI.get(`/products/${id}`);
    const product = transformProduct(response.data);
    
    console.log(`✅ Successfully fetched product ${id} from external API`);
    res.json(product);
  } catch (error) {
    console.error(`❌ Error fetching product ${req.params.id}:`, error.message);
    
    if (error.response?.status === 404) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(500).json({ 
        message: 'Failed to fetch product from external API',
        error: error.message 
      });
    }
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching products for category "${category}" from FakeStore API...`);
    
    const response = await fakeStoreAPI.get(`/products/category/${category}`);
    const products = response.data.map(transformProduct);
    
    console.log(`✅ Successfully fetched ${products.length} products for category "${category}"`);
    res.json(products);
  } catch (error) {
    console.error(`❌ Error fetching products for category "${req.params.category}":`, error.message);
    res.status(500).json({ 
      message: 'Failed to fetch products by category from external API',
      error: error.message 
    });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    console.log('Fetching categories from FakeStore API...');
    const response = await fakeStoreAPI.get('/products/categories');
    
    console.log(`✅ Successfully fetched ${response.data.length} categories from external API`);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching categories from FakeStore API:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch categories from external API',
      error: error.message 
    });
  }
});

// Transform product data from FakeStore API to our format
const transformProduct = (apiProduct) => ({
  id: apiProduct.id.toString(),
  name: apiProduct.title,
  description: apiProduct.description,
  price: apiProduct.price,
  images: [apiProduct.image, apiProduct.image], // FakeStore only provides one image
  category: apiProduct.category,
  brand: getBrandFromCategory(apiProduct.category),
  rating: apiProduct.rating?.rate || 4.0,
  countInStock: Math.floor(Math.random() * 50) + 10, // Random stock count
  featured: Math.random() > 0.7, // Random featured status
});

// Generate brand names based on category
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

export default router;