import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { USER_TYPE } from '../../src/constants/constants';
import cartReducer from '../../src/redux/cart/reducer';
import productStoreReducer from '../../src/redux/productStore/reducer';
import CartScreen from '../../src/screens/CartScreen/CartScreen';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({ data, renderItem, ListEmptyComponent }: any) => {
    if (data.length === 0 && ListEmptyComponent) {
      return ListEmptyComponent;
    }
    return require('react').createElement(
      require('react').Fragment,
      null,
      data.map((item: any, index: number) => renderItem({ item, index }))
    );
  },
}));

const createMockStore = (productStore: Product[] = [], currency?: Currency) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      productStore: productStoreReducer,
    },
    preloadedState: {
      cart: {
        items: [],
        currency: currency || Currency.USD,
        userType: USER_TYPE[0],
      },
      productStore: {
        products: productStore,
        loading: false,
        error: null,
      },
    },
  });
};

describe('CartScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockGoBack.mockClear();
  });

  const renderComponent = (productStore: Product[] = [], currency?: Currency) => {
    const store = createMockStore(productStore, currency);
    return render(
      <Provider store={store}>
        <CartScreen />
      </Provider>
    );
  };

  it('should render cart items when cart has products', () => {
    const productStore = [
      {
        id: '1',
        name: 'Test Product',
        amount: 2,
        price: 5.99,
        currency: Currency.USD,
      },
    ];

    const { getByText } = renderComponent(productStore);

    expect(getByText('Test Product')).toBeTruthy();
  });

  it('should display total price', () => {
    const productStore = [
      {
        id: '1',
        name: 'Product 1',
        amount: 2,
        price: 10.0,
        currency: Currency.USD,
      },
      {
        id: '2',
        name: 'Product 2',
        amount: 1,
        price: 5.5,
        currency: Currency.USD,
      },
    ];

    const { getByText } = renderComponent(productStore);
    const product1 = getByText('Product 1');
    const product2 = getByText('Product 2');

    fireEvent.press(product1);
    fireEvent.press(product2);

    expect(getByText('Pagar $15.50')).toBeTruthy();
  });

  it('should handle multiple products correctly', () => {
    const productStore = [
      {
        id: '1',
        name: 'Product A',
        amount: 3,
        price: 2.99,
        currency: Currency.USD,
      },
      {
        id: '2',
        name: 'Product B',
        amount: 1,
        price: 15.99,
        currency: Currency.USD,
      },
      {
        id: '3',
        name: 'Product C',
        amount: 2,
        price: 7.5,
        currency: Currency.USD,
      },
    ];

    const { getByText } = renderComponent(productStore);

    const productA = getByText('Product A');
    const productB = getByText('Product B');
    const productC = getByText('Product C');

    expect(getByText('Product A')).toBeTruthy();
    expect(getByText('Product B')).toBeTruthy();
    expect(getByText('Product C')).toBeTruthy();

    fireEvent.press(productA);
    fireEvent.press(productB);
    fireEvent.press(productC);

    expect(getByText('Pagar $26.48')).toBeTruthy();
  });

  it('should display correct currency for EUR products', () => {
    const productStore = [
      {
        id: '1',
        name: 'EUR Product',
        amount: 1,
        price: 12.5,
        currency: Currency.USD,
      },
    ];

    const { getByText } = renderComponent(productStore, Currency.EUR);
    const productA = getByText('EUR Product');

    fireEvent.press(productA);

    expect(getByText('Pagar 10.63€')).toBeTruthy();
  });
});
