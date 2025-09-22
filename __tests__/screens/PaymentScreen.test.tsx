import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { USER_TYPE } from '../../src/constants/constants';
import cartReducer from '../../src/redux/cart/reducer';
import productStoreReducer from '../../src/redux/productStore/reducer';
import PaymentScreen from '../../src/screens/PaymentScreen/PaymentScreen';
import { Currency } from '../../src/types/GeneralTypes';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@shopify/flash-list', () => ({
  FlashList: ({ data, renderItem }: any) => {
    return require('react').createElement(
      require('react').Fragment,
      null,
      data.map((item: any, index: number) => renderItem({ item, index }))
    );
  },
}));

jest.mock('../../src/redux/productStore/thunk', () => {
  const createMockThunk = (name: string) => {
    const thunk: any = jest.fn(() => ({
      type: name,
      then: (callback: any) => {
        callback();
        return Promise.resolve();
      },
    }));
    thunk.pending = { type: `${name}/pending` };
    thunk.fulfilled = { type: `${name}/fulfilled` };
    thunk.rejected = { type: `${name}/rejected` };
    return thunk;
  };

  return {
    makePaymentThunk: createMockThunk('makePayment'),
    fetchProductsThunk: createMockThunk('fetchProducts'),
  };
});

const createMockStore = (cartItems: any[] = []) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      productStore: productStoreReducer,
    },
    preloadedState: {
      cart: {
        items: cartItems,
        currency: Currency.USD,
        userType: USER_TYPE[0],
      },
      productStore: {
        products: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('PaymentScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderComponent = (cartItems: any[] = []) => {
    const store = createMockStore(cartItems);
    return render(
      <Provider store={store}>
        <PaymentScreen />
      </Provider>
    );
  };

  it('should render payment screen with cart items and payment options', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Test Product',
        amount: 2,
        price: 5.99,
        currency: Currency.USD,
      },
    ];

    const { getByText } = renderComponent(cartItems);

    expect(getByText('Ticket')).toBeTruthy();
    expect(getByText('Productos seleccionados')).toBeTruthy();
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('Efectivo')).toBeTruthy();
    expect(getByText('Tarjeta')).toBeTruthy();
  });

  it('should handle payment button press and navigate', () => {
    const cartItems = [
      {
        id: '1',
        name: 'Product',
        amount: 1,
        price: 10.0,
        currency: Currency.USD,
      },
    ];

    const { getByText } = renderComponent(cartItems);

    const cashButton = getByText('Efectivo');
    fireEvent.press(cashButton);

    expect(mockNavigate).toHaveBeenCalledWith('Cart');
  });

  it('should display seat selector', () => {
    const { getByText } = renderComponent([]);

    expect(getByText('A')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(getByText('Asiento')).toBeTruthy();
  });
});
