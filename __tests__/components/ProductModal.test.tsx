import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { ProductModal } from '../../src/components/ProductModal/ProductModal';
import { USER_TYPE } from '../../src/constants/constants';
import cartReducer from '../../src/redux/cart/reducer';
import productStoreReducer from '../../src/redux/productStore/reducer';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  amount: 1,
  price: 5.99,
  currency: Currency.USD,
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      productStore: productStoreReducer,
    },
    preloadedState: {
      cart: {
        items: [],
        currency: Currency.USD,
        userType: USER_TYPE[0],
      },
      productStore: {
        products: [{ ...mockProduct, amount: 10 }],
        loading: false,
        error: null,
      },
    },
  });
};

describe('ProductModal', () => {
  let store: ReturnType<typeof createMockStore>;

  const mockOnClose = jest.fn();

  beforeEach(() => {
    store = createMockStore();
    mockOnClose.mockClear();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      visible: true,
      product: mockProduct,
      onClose: mockOnClose,
    };

    return render(
      <Provider store={store}>
        <ProductModal {...defaultProps} {...props} />
      </Provider>
    );
  };

  it('should not render when not visible', () => {
    const { queryByText } = renderComponent({ visible: false });

    expect(queryByText('Test Product')).toBeNull();
  });

  it('should show correct quantity controls', () => {
    const { getByText } = renderComponent();

    expect(getByText('-')).toBeTruthy();
    expect(getByText('+')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });

  it('should increase quantity when + button is pressed', () => {
    const { getByText } = renderComponent();

    const increaseButton = getByText('+');
    fireEvent.press(increaseButton);

    expect(getByText('2')).toBeTruthy();
  });

  it('should decrease quantity when - button is pressed', () => {
    const { getByText } = renderComponent();

    const increaseButton = getByText('+');
    fireEvent.press(increaseButton);
    expect(getByText('2')).toBeTruthy();

    const decreaseButton = getByText('-');
    fireEvent.press(decreaseButton);
    expect(getByText('1')).toBeTruthy();
  });

  it('should not go below 0 when decreasing quantity', () => {
    const { getByText } = renderComponent();

    const decreaseButton = getByText('-');
    fireEvent.press(decreaseButton);
    fireEvent.press(decreaseButton);

    expect(getByText('0')).toBeTruthy();
  });

  it('should not exceed product amount when increasing quantity', () => {
    const productWithLowStock = { ...mockProduct, amount: 9 };
    const { getByText } = renderComponent({ product: productWithLowStock });

    const increaseButton = getByText('+');

    fireEvent.press(increaseButton);
    expect(getByText('10')).toBeTruthy();

    fireEvent.press(increaseButton);
    expect(getByText('10')).toBeTruthy();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByText } = renderComponent();

    const closeButton = getByText('Cancelar');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should add product to cart when add button is pressed', () => {
    const { getByText } = renderComponent();

    const increaseButton = getByText('+');
    fireEvent.press(increaseButton);
    fireEvent.press(increaseButton);
    expect(getByText('3')).toBeTruthy();

    const addButton = getByText('Actualizar');
    fireEvent.press(addButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].id).toBe('1');
    expect(state.cart.items[0].amount).toBe(2);
  });

  it('should display total price based on quantity', () => {
    const { getByText } = renderComponent();

    const increaseButton = getByText('+');
    fireEvent.press(increaseButton);

    expect(getByText('$11.98')).toBeTruthy();
  });

  it('should close modal after adding to cart', () => {
    const { getByText } = renderComponent();

    const addButton = getByText('Actualizar');
    fireEvent.press(addButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
