import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, getProductById, getProductsByCategory } from '../../services/api';

const initialState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: null,
    searchQuery: '',
    sortBy: 'newest',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await getProducts();
      return products;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const product = await getProductById(id);
      return product;
    } catch (error) {
      return rejectWithValue('Failed to fetch product');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const products = await getProductsByCategory(category);
      return products;
    } catch (error) {
      return rejectWithValue('Failed to fetch products by category');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter(state, action) {
      const { type, value } = action.payload;
      
      if (type === 'category') {
        state.filters.category = value;
      } else if (type === 'priceRange') {
        state.filters.priceRange = value;
      } else if (type === 'searchQuery') {
        state.filters.searchQuery = value;
      } else if (type === 'sortBy') {
        state.filters.sortBy = value;
      } else if (type === 'sortOrder') {
        state.filters.sortOrder = value;
      }
      
      state.filteredItems = applySortingAndFilters(state.items, state.filters);
    },
    
    clearFilters(state) {
      state.filters = {
        category: null,
        priceRange: null,
        searchQuery: '',
        sortBy: 'newest',
        sortOrder: 'desc',
      };
      state.filteredItems = applySortingAndFilters(state.items, state.filters);
    },

    resetPagination(state) {
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = applySortingAndFilters(action.payload, state.filters);
        state.pagination.total = action.payload.length;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = applySortingAndFilters(action.payload, state.filters);
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const applySortingAndFilters = (products, filters) => {
  let filtered = products.filter(product => {
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'newest':
        comparison = parseInt(a.id) - parseInt(b.id);
        break;
      default:
        comparison = 0;
    }
    
    return filters.sortOrder === 'desc' ? -comparison : comparison;
  });

  return filtered;
};

export const { setFilter, clearFilters, resetPagination } = productsSlice.actions;
export default productsSlice.reducer;