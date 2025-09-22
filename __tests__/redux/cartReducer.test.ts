import { USER_TYPE } from '../../src/constants/constants';
import cartReducer, {
  addProduct,
  CartState,
  clearCart,
  deleteProduct,
  reduceAmount,
  setCurrency,
  setUserType,
} from '../../src/redux/cart/reducer';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

describe('Cart Reducer', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Coca Cola',
    amount: 1,
    price: 2.5,
    currency: Currency.USD,
  };

  const mockProduct2: Product = {
    id: '2',
    name: 'Pepsi',
    amount: 1,
    price: 2.25,
    currency: Currency.USD,
  };

  const initialState: CartState = {
    items: [],
    currency: Currency.EUR,
    userType: USER_TYPE[0],
  };

  describe('addProduct', () => {
    it('should add new product to empty cart', () => {
      const action = addProduct({ product: mockProduct });
      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({ ...mockProduct, amount: 1 });
    });

    it('should add different products to cart', () => {
      const stateWithOneItem = {
        ...initialState,
        items: [mockProduct],
      };

      const action = addProduct({ product: mockProduct2 });
      const result = cartReducer(stateWithOneItem, action);

      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toEqual(mockProduct);
      expect(result.items[1]).toEqual({ ...mockProduct2, amount: 1 });
    });

    it('should increment quantity if same product already exists', () => {
      const existingProduct = { ...mockProduct, amount: 2 };
      const stateWithExisting = {
        ...initialState,
        items: [existingProduct],
      };

      const action = addProduct({ product: mockProduct });
      const result = cartReducer(stateWithExisting, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].amount).toBe(3);
      expect(result.items[0].id).toBe(mockProduct.id);
    });

    it('should add custom amount when specified', () => {
      const action = addProduct({ product: mockProduct, amount: 5 });
      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].amount).toBe(5);
    });

    it('should increment by custom amount if product exists', () => {
      const existingProduct = { ...mockProduct, amount: 2 };
      const stateWithExisting = {
        ...initialState,
        items: [existingProduct],
      };

      const action = addProduct({ product: mockProduct, amount: 3 });
      const result = cartReducer(stateWithExisting, action);

      expect(result.items[0].amount).toBe(5);
    });
  });

  describe('deleteProduct', () => {
    it('should remove product from cart', () => {
      const stateWithItem = {
        ...initialState,
        items: [mockProduct],
      };

      const action = deleteProduct(mockProduct.id);
      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(0);
      expect(result.items).toEqual([]);
    });

    it('should only remove specified product', () => {
      const stateWithMultipleItems = {
        ...initialState,
        items: [mockProduct, mockProduct2],
      };

      const action = deleteProduct(mockProduct.id);
      const result = cartReducer(stateWithMultipleItems, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockProduct2);
    });

    it('should do nothing if product not found', () => {
      const stateWithItems = {
        ...initialState,
        items: [mockProduct],
      };

      const action = deleteProduct('nonexistent-id');
      const result = cartReducer(stateWithItems, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockProduct);
    });

    it('should work with empty cart', () => {
      const action = deleteProduct(mockProduct.id);
      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('reduceAmount', () => {
    it('should reduce quantity of existing product', () => {
      const productWithQuantity = { ...mockProduct, amount: 3 };
      const stateWithItem = {
        ...initialState,
        items: [productWithQuantity],
      };

      const action = reduceAmount({ productId: mockProduct.id });
      const result = cartReducer(stateWithItem, action);

      expect(result.items[0].amount).toBe(2);
      expect(result.items[0].id).toBe(mockProduct.id);
    });

    it('should reduce by custom amount', () => {
      const productWithQuantity = { ...mockProduct, amount: 5 };
      const stateWithItem = {
        ...initialState,
        items: [productWithQuantity],
      };

      const action = reduceAmount({ productId: mockProduct.id, amount: 3 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items[0].amount).toBe(2);
    });

    it('should not affect other products', () => {
      const stateWithMultipleItems = {
        ...initialState,
        items: [
          { ...mockProduct, amount: 2 },
          { ...mockProduct2, amount: 1 },
        ],
      };

      const action = reduceAmount({ productId: mockProduct.id });
      const result = cartReducer(stateWithMultipleItems, action);

      expect(result.items[0].amount).toBe(1);
      expect(result.items[1].amount).toBe(1);
    });

    it('should remove product when quantity reaches 0', () => {
      const productWithOneQuantity = { ...mockProduct, amount: 1 };
      const stateWithItem = {
        ...initialState,
        items: [productWithOneQuantity],
      };

      const action = reduceAmount({ productId: mockProduct.id });
      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(0);
    });

    it('should remove product when reduction exceeds current amount', () => {
      const productWithSmallQuantity = { ...mockProduct, amount: 2 };
      const stateWithItem = {
        ...initialState,
        items: [productWithSmallQuantity],
      };

      const action = reduceAmount({ productId: mockProduct.id, amount: 5 });
      const result = cartReducer(stateWithItem, action);

      expect(result.items).toHaveLength(0);
    });

    it('should not affect other products when removing', () => {
      const stateWithMultipleItems = {
        ...initialState,
        items: [
          { ...mockProduct, amount: 1 },
          { ...mockProduct2, amount: 2 },
        ],
      };

      const action = reduceAmount({ productId: mockProduct.id });
      const result = cartReducer(stateWithMultipleItems, action);

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual({ ...mockProduct2, amount: 2 });
    });

    it('should do nothing if product not found', () => {
      const stateWithItem = {
        ...initialState,
        items: [mockProduct],
      };

      const action = reduceAmount({ productId: 'nonexistent-id' });
      const result = cartReducer(stateWithItem, action);

      expect(result.items[0]).toEqual(mockProduct);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const stateWithItems = {
        ...initialState,
        items: [mockProduct, mockProduct2],
      };

      const action = clearCart();
      const result = cartReducer(stateWithItems, action);

      expect(result.items).toHaveLength(0);
      expect(result.items).toEqual([]);
    });

    it('should work with empty cart', () => {
      const action = clearCart();
      const result = cartReducer(initialState, action);

      expect(result.items).toHaveLength(0);
      expect(result.items).toEqual([]);
    });

    it('should preserve currency and userType', () => {
      const stateWithCustomSettings = {
        ...initialState,
        items: [mockProduct],
        currency: Currency.USD,
        userType: USER_TYPE[2],
      };

      const action = clearCart();
      const result = cartReducer(stateWithCustomSettings, action);

      expect(result.items).toEqual([]);
      expect(result.currency).toBe(Currency.USD);
      expect(result.userType).toEqual(USER_TYPE[2]);
    });
  });

  describe('setCurrency', () => {
    it('should update currency to USD', () => {
      const action = setCurrency(Currency.USD);
      const result = cartReducer(initialState, action);

      expect(result.currency).toBe(Currency.USD);
    });

    it('should update currency to GBP', () => {
      const action = setCurrency(Currency.GBP);
      const result = cartReducer(initialState, action);

      expect(result.currency).toBe(Currency.GBP);
    });

    it('should preserve items and userType when changing currency', () => {
      const stateWithItems = {
        ...initialState,
        items: [mockProduct, mockProduct2],
      };

      const action = setCurrency(Currency.USD);
      const result = cartReducer(stateWithItems, action);

      expect(result.currency).toBe(Currency.USD);
      expect(result.items).toEqual([mockProduct, mockProduct2]);
      expect(result.userType).toEqual(USER_TYPE[0]);
    });
  });

  describe('setUserType', () => {
    it('should update userType to Business', () => {
      const action = setUserType(USER_TYPE[3]);
      const result = cartReducer(initialState, action);

      expect(result.userType).toEqual(USER_TYPE[3]);
    });

    it('should update userType to Retail', () => {
      const action = setUserType(USER_TYPE[4]);
      const result = cartReducer(initialState, action);

      expect(result.userType).toEqual(USER_TYPE[4]);
    });

    it('should preserve items and currency when changing userType', () => {
      const stateWithItems = {
        ...initialState,
        items: [mockProduct],
        currency: Currency.USD,
      };

      const action = setUserType(USER_TYPE[0]); 
      const result = cartReducer(stateWithItems, action);

      expect(result.userType).toEqual(USER_TYPE[0]);
      expect(result.items).toEqual([mockProduct]);
      expect(result.currency).toBe(Currency.USD);
    });
  });

  describe('initial state', () => {
    it('should return initial state when called with undefined', () => {
      const result = cartReducer(undefined, { type: '@@INIT' });

      expect(result).toEqual({
        items: [],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      });
    });

    it('should handle unknown actions', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const result = cartReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
