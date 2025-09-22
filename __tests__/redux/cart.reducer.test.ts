import { USER_TYPE } from '../../src/constants/constants';
import cartReducer, {
  CartState,
  addProduct,
  clearCart,
  deleteProduct,
  reduceAmount,
} from '../../src/redux/cart/reducer';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

describe('Cart Reducer', () => {
  const initialState: CartState = {
    currency: Currency.USD,
    userType: USER_TYPE[0],
    items: [],
  };

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    currency: Currency.USD,
    amount: 2,
  };

  const mockCartItem: Product = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    currency: Currency.USD,
    amount: 2,
  };

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('addProduct', () => {
    it('should add a new product to empty cart', () => {
      const result = cartReducer(initialState, addProduct({ product: mockProduct, amount: 2 }));

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockProduct);
    });

    it('should increase amount if product already exists', () => {
      const stateWithProduct: CartState = {
        items: [mockCartItem],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithProduct, addProduct({ product: mockProduct }));

      expect(result.items).toHaveLength(1);
      expect(result.items[0].amount).toBe(3);
    });

    it('should add different products to cart', () => {
      const stateWithProduct: CartState = {
        items: [mockCartItem],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const differentProduct: Product = {
        id: '2',
        name: 'Different Product',
        price: 15.99,
        currency: Currency.EUR,
        amount: 1,
      };

      const result = cartReducer(stateWithProduct, addProduct({ product: differentProduct }));

      expect(result.items).toHaveLength(2);
      expect(result.items[1]).toEqual(differentProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should remove product from cart', () => {
      const stateWithProduct: CartState = {
        items: [mockCartItem],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithProduct, deleteProduct('1'));

      expect(result.items).toHaveLength(0);
    });

    it('should not affect cart if product does not exist', () => {
      const stateWithProduct: CartState = {
        items: [mockCartItem],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithProduct, deleteProduct('non-existent-id'));

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockCartItem);
    });
  });

  describe('reduceAmount', () => {
    it('should reduce amount by 1', () => {
      const stateWithProduct: CartState = {
        items: [{ ...mockCartItem, amount: 3 }],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithProduct, reduceAmount({ productId: '1' }));

      expect(result.items[0].amount).toBe(2);
    });

    it('should remove product if amount becomes 0', () => {
      const stateWithProduct: CartState = {
        items: [{ ...mockCartItem, amount: 1 }],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithProduct, reduceAmount({ productId: '1' }));

      expect(result.items).toHaveLength(0);
    });

    it('should not affect cart if product does not exist', () => {
      const stateWithProduct: CartState = {
        items: [mockCartItem],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithProduct, reduceAmount({ productId: 'non-existent-id' }));

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockCartItem);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const stateWithMultipleProducts: CartState = {
        items: [mockCartItem, { ...mockCartItem, id: '2', name: 'Another Product' }],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      };

      const result = cartReducer(stateWithMultipleProducts, clearCart());

      expect(result.items).toHaveLength(0);
    });

    it('should not affect empty cart', () => {
      const result = cartReducer(initialState, clearCart());

      expect(result.items).toHaveLength(0);
    });
  });
});
