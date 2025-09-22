import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { CurrencyPriceDisplay } from '../../src/components/CurrencyPriceDisplay/CurrencyPriceDisplay';
import { USER_TYPE } from '../../src/constants/constants';
import cartReducer from '../../src/redux/cart/reducer';
import productStoreReducer from '../../src/redux/productStore/reducer';
import { Currency } from '../../src/types/GeneralTypes';

const createMockStore = (currency: Currency, items: any[] = []) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      productStore: productStoreReducer,
    },
    preloadedState: {
      cart: {
        items,
        currency,
        userType: USER_TYPE[0],
      },
      productStore: {
        products: [],
        loading: false,
        error: null,
      },
    },
  });
  return store;
};

describe('CurrencyPriceDisplay', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    amount: 1,
    price: 10,
    currency: Currency.USD,
  };

  it('should not render when cart is empty', () => {
    const store = createMockStore(Currency.USD, []);
    const { queryByTestId } = render(
      <Provider store={store}>
        <CurrencyPriceDisplay />
      </Provider>
    );

    expect(queryByTestId('currency-display')).toBeNull();
  });

  it('should render other currencies when cart has items with USD as current currency', () => {
    const cartItems = [{ ...mockProduct, amount: 2 }];
    const store = createMockStore(Currency.USD, cartItems);
    const { getByText } = render(
      <Provider store={store}>
        <CurrencyPriceDisplay />
      </Provider>
    );

    expect(getByText('17.00€ | ')).toBeTruthy();
    expect(getByText('£15.00')).toBeTruthy();
  });

  it('should render other currencies when cart has items with EUR as current currency', () => {
    const cartItems = [{ ...mockProduct, amount: 2 }];
    const store = createMockStore(Currency.EUR, cartItems);
    const { getByText } = render(
      <Provider store={store}>
        <CurrencyPriceDisplay />
      </Provider>
    );

    expect(getByText('$20.06 | ')).toBeTruthy();
    expect(getByText('£14.96')).toBeTruthy();
  });

  it('should render other currencies when cart has items with GBP as current currency', () => {
    const cartItems = [{ ...mockProduct, amount: 2 }];
    const store = createMockStore(Currency.GBP, cartItems);
    const { getByText } = render(
      <Provider store={store}>
        <CurrencyPriceDisplay />
      </Provider>
    );

    expect(getByText('$19.95 | ')).toBeTruthy();
    expect(getByText('17.10€')).toBeTruthy();
  });

  it('should handle multiple products correctly', () => {
    const multipleProducts = [
      { ...mockProduct, amount: 2 },
      {
        id: '2',
        name: 'Another Product',
        amount: 1,
        price: 5,
        currency: Currency.USD,
      },
    ];

    const store = createMockStore(Currency.USD, multipleProducts);
    const { getByText } = render(
      <Provider store={store}>
        <CurrencyPriceDisplay />
      </Provider>
    );

    expect(getByText('21.25€ | ')).toBeTruthy();
    expect(getByText('£18.75')).toBeTruthy();
  });
});
