import { CartState } from '../../src/redux/cart/reducer';
import {
  selectCartCurrency,
  selectCartItems,
  selectCartItemsCount,
  selectCartTotalPrice,
} from '../../src/redux/cart/selectors';
import { Currency, UserType } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

describe('Cart Selectors', () => {
  const mockUserType: UserType = {
    id: '1',
    name: 'Turista',
    discount: 0,
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Coca Cola',
      amount: 2,
      price: 2.5,
      currency: Currency.USD,
    },
    {
      id: '2',
      name: 'Pepsi',
      amount: 1,
      price: 2.25,
      currency: Currency.USD,
    },
    {
      id: '3',
      name: 'Water',
      amount: 3,
      price: 1.0,
      currency: Currency.USD,
    },
  ];

  const createMockState = (cartOverrides: Partial<CartState> = {}) => ({
    cart: {
      items: [],
      currency: Currency.USD,
      userType: mockUserType,
      ...cartOverrides,
    },
    productStore: {
      products: [],
      loading: false,
      error: null,
    },
  });

  describe('selectCartItems', () => {
    it('should return empty array when cart is empty', () => {
      const state = createMockState();
      const result = selectCartItems(state);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all cart items when cart has products', () => {
      const state = createMockState({ items: mockProducts });
      const result = selectCartItems(state);

      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(3);
    });

    it('should return exact items with correct properties', () => {
      const state = createMockState({ items: [mockProducts[0]] });
      const result = selectCartItems(state);

      expect(result[0]).toEqual({
        id: '1',
        name: 'Coca Cola',
        amount: 2,
        price: 2.5,
        currency: Currency.USD,
      });
    });
  });

  describe('selectCartTotalPrice', () => {
    it('should return 0 when cart is empty', () => {
      const state = createMockState();
      const result = selectCartTotalPrice(state);

      expect(result).toBe(0);
    });

    it('should calculate total price correctly for single item', () => {
      const state = createMockState({ items: [mockProducts[0]] });
      const result = selectCartTotalPrice(state);

      expect(result).toBe(5.0);
    });

    it('should calculate total price correctly for multiple items', () => {
      const state = createMockState({ items: mockProducts });
      const result = selectCartTotalPrice(state);

      expect(result).toBe(10.25);
    });

    it('should handle decimal calculations correctly', () => {
      const decimalsProducts = [
        { id: '1', name: 'Item 1', amount: 3, price: 1.33, currency: Currency.USD },
        { id: '2', name: 'Item 2', amount: 2, price: 2.456, currency: Currency.USD },
      ];

      const state = createMockState({ items: decimalsProducts });
      const result = selectCartTotalPrice(state);

      expect(result).toBeCloseTo(8.902, 3);
    });

    it('should handle large quantities', () => {
      const largeQuantityProduct = {
        id: '1',
        name: 'Bulk Item',
        amount: 100,
        price: 0.99,
        currency: Currency.USD,
      };

      const state = createMockState({ items: [largeQuantityProduct] });
      const result = selectCartTotalPrice(state);

      expect(result).toBe(99.0);
    });
  });

  describe('selectCartCurrency', () => {
    it('should return USD currency by default', () => {
      const state = createMockState();
      const result = selectCartCurrency(state);

      expect(result).toBe(Currency.USD);
    });

    it('should return EUR currency when set', () => {
      const state = createMockState({ currency: Currency.EUR });
      const result = selectCartCurrency(state);

      expect(result).toBe(Currency.EUR);
    });

    it('should return GBP currency when set', () => {
      const state = createMockState({ currency: Currency.GBP });
      const result = selectCartCurrency(state);

      expect(result).toBe(Currency.GBP);
    });
  });

  describe('selectCartItemsCount', () => {
    it('should return 0 when cart is empty', () => {
      const state = createMockState();
      const result = selectCartItemsCount(state);

      expect(result).toBe(0);
    });

    it('should return total quantity of all items', () => {
      const state = createMockState({ items: mockProducts });
      const result = selectCartItemsCount(state);

      expect(result).toBe(6);
    });

    it('should handle single item correctly', () => {
      const state = createMockState({ items: [mockProducts[0]] });
      const result = selectCartItemsCount(state);

      expect(result).toBe(2);
    });

    it('should handle large quantities', () => {
      const largeQuantityItems = [
        { id: '1', name: 'Item 1', amount: 50, price: 1.0, currency: Currency.USD },
        { id: '2', name: 'Item 2', amount: 30, price: 2.0, currency: Currency.USD },
        { id: '3', name: 'Item 3', amount: 20, price: 3.0, currency: Currency.USD },
      ];

      const state = createMockState({ items: largeQuantityItems });
      const result = selectCartItemsCount(state);

      expect(result).toBe(100);
    });
  });
});
