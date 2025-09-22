import productStoreReducer, {
  ProductStoreState,
  getAllProducts,
} from '../../src/redux/productStore/reducer';
import { fetchProductsThunk } from '../../src/redux/productStore/thunk';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

describe('ProductStore Reducer', () => {
  const initialState: ProductStoreState = {
    products: [],
    loading: false,
    error: null,
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Coca Cola',
      amount: 25,
      price: 2.49,
      currency: Currency.USD,
    },
    {
      id: '2',
      name: 'Pepsi',
      amount: 30,
      price: 2.39,
      currency: Currency.USD,
    },
  ];

  it('should return the initial state', () => {
    expect(productStoreReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('getAllProducts', () => {
    it('should return current state', () => {
      const stateWithProducts: ProductStoreState = {
        products: mockProducts,
        loading: false,
        error: null,
      };

      const result = productStoreReducer(stateWithProducts, getAllProducts());
      expect(result).toEqual(stateWithProducts);
    });
  });

  describe('fetchProducts async thunk', () => {
    it('should handle fetchProducts.pending', () => {
      const action = { type: fetchProductsThunk.pending.type };
      const result = productStoreReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle fetchProducts.fulfilled', () => {
      const loadingState: ProductStoreState = {
        products: [],
        loading: true,
        error: null,
      };

      const action = {
        type: fetchProductsThunk.fulfilled.type,
        payload: mockProducts,
      };

      const result = productStoreReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.products).toEqual(mockProducts);
      expect(result.error).toBeNull();
    });

    it('should handle fetchProducts.rejected', () => {
      const loadingState: ProductStoreState = {
        products: [],
        loading: true,
        error: null,
      };

      const errorMessage = 'Failed to fetch products';
      const action = {
        type: fetchProductsThunk.rejected.type,
        payload: errorMessage,
      };

      const result = productStoreReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
    });

    it('should handle fetchProducts.rejected with default error message', () => {
      const loadingState: ProductStoreState = {
        products: [],
        loading: true,
        error: null,
      };

      const action = {
        type: fetchProductsThunk.rejected.type,
        payload: undefined,
      };

      const result = productStoreReducer(loadingState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Failed to fetch products');
    });
  });
});
