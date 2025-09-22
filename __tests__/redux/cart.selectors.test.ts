import { USER_TYPE } from '../../src/constants/constants';
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotalPrice,
  selectProductAmount,
} from '../../src/redux/cart/selectors';
import { RootState } from '../../src/redux/store';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

describe('Cart Selectors', () => {
  const mockCartItems: Product[] = [
    {
      id: '1',
      name: 'Product A',
      price: 10.99,
      currency: Currency.USD,
      amount: 2,
    },
    {
      id: '2',
      name: 'Product B',
      price: 15.5,
      currency: Currency.USD,

      amount: 3,
    },
    {
      id: '3',
      name: 'Product C',
      price: 5.25,
      currency: Currency.USD,

      amount: 1,
    },
  ];

  const mockState: RootState = {
    cart: {
      items: mockCartItems,
      currency: Currency.USD,
      userType: USER_TYPE[0],
    },
    productStore: {
      products: [],
      loading: false,
      error: null,
    },
  };

  const emptyState: RootState = {
    cart: {
      items: [],
      currency: Currency.USD,
      userType: USER_TYPE[0],
    },
    productStore: {
      products: [],
      loading: false,
      error: null,
    },
  };

  describe('selectCartItems', () => {
    it('should return all cart items', () => {
      const result = selectCartItems(mockState);
      expect(result).toEqual(mockCartItems);
    });

    it('should return empty array for empty cart', () => {
      const result = selectCartItems(emptyState);
      expect(result).toEqual([]);
    });
  });

  describe('selectCartItemsCount', () => {
    it('should return total amount of all items', () => {
      const result = selectCartItemsCount(mockState);
      expect(result).toBe(6);
    });

    it('should return 0 for empty cart', () => {
      const result = selectCartItemsCount(emptyState);
      expect(result).toBe(0);
    });
  });

  describe('selectCartTotalPrice', () => {
    it('should calculate total price correctly', () => {
      const result = selectCartTotalPrice(mockState);
      expect(result).toBeCloseTo(73.73, 2);
    });

    it('should return 0 for empty cart', () => {
      const result = selectCartTotalPrice(emptyState);
      expect(result).toBe(0);
    });
  });

  describe('selectProductAmount', () => {
    it('should return correct amount for existing product', () => {
      const result = selectProductAmount(mockState, '1');
      expect(result).toBe(2);
    });

    it('should return 0 for non-existing product', () => {
      const result = selectProductAmount(mockState, 'non-existing-id');
      expect(result).toBe(0);
    });

    it('should return 0 for empty cart', () => {
      const result = selectProductAmount(emptyState, '1');
      expect(result).toBe(0);
    });
  });
});
