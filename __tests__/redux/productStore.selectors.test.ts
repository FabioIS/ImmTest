import { USER_TYPE } from '../../src/constants/constants';
import {
  selectAllProducts,
  selectAreProductsLoaded,
  selectProductById,
  selectProductsCount,
  selectProductsError,
  selectProductsLoading,
} from '../../src/redux/productStore/selectors';
import { RootState } from '../../src/redux/store';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

describe('ProductStore Selectors', () => {
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
    {
      id: '3',
      name: 'Sprite',
      amount: 15,
      price: 2.29,
      currency: Currency.USD,
    },
  ];

  const mockState: RootState = {
    cart: {
      items: [],
      currency: Currency.USD,
      userType: USER_TYPE[0],
    },
    productStore: {
      products: mockProducts,
      loading: false,
      error: null,
    },
  };

  const loadingState: RootState = {
    cart: {
      items: [],
      currency: Currency.USD,
      userType: USER_TYPE[0],
    },
    productStore: {
      products: [],
      loading: true,
      error: null,
    },
  };

  const errorState: RootState = {
    cart: {
      items: [],
      currency: Currency.USD,
      userType: USER_TYPE[0],
    },
    productStore: {
      products: [],
      loading: false,
      error: 'Failed to fetch products',
    },
  };

  describe('selectAllProducts', () => {
    it('should return all products', () => {
      const result = selectAllProducts(mockState);
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products', () => {
      const result = selectAllProducts(loadingState);
      expect(result).toEqual([]);
    });
  });

  describe('selectProductsLoading', () => {
    it('should return false when not loading', () => {
      const result = selectProductsLoading(mockState);
      expect(result).toBe(false);
    });

    it('should return true when loading', () => {
      const result = selectProductsLoading(loadingState);
      expect(result).toBe(true);
    });
  });

  describe('selectProductsError', () => {
    it('should return null when no error', () => {
      const result = selectProductsError(mockState);
      expect(result).toBeNull();
    });

    it('should return error message when error exists', () => {
      const result = selectProductsError(errorState);
      expect(result).toBe('Failed to fetch products');
    });
  });

  describe('selectAreProductsLoaded', () => {
    it('should return true when products are loaded', () => {
      const result = selectAreProductsLoaded(mockState);
      expect(result).toBe(true);
    });

    it('should return false when no products loaded', () => {
      const result = selectAreProductsLoaded(loadingState);
      expect(result).toBe(false);
    });
  });

  describe('selectProductById', () => {
    it('should return correct product for existing id', () => {
      const result = selectProductById(mockState, '2');
      expect(result).toEqual(mockProducts[1]);
    });

    it('should return undefined for non-existing id', () => {
      const result = selectProductById(mockState, 'non-existing');
      expect(result).toBeUndefined();
    });

    it('should return undefined when no products loaded', () => {
      const result = selectProductById(loadingState, '1');
      expect(result).toBeUndefined();
    });
  });

  describe('selectProductsCount', () => {
    it('should return correct count of products', () => {
      const result = selectProductsCount(mockState);
      expect(result).toBe(3);
    });

    it('should return 0 when no products', () => {
      const result = selectProductsCount(loadingState);
      expect(result).toBe(0);
    });
  });
});
