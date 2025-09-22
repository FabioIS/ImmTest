import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { SeatSelector } from '../../src/components/SeatSelector/SeatSelector';
import { USER_TYPE } from '../../src/constants/constants';
import cartReducer from '../../src/redux/cart/reducer';
import productStoreReducer from '../../src/redux/productStore/reducer';
import { Currency } from '../../src/types/GeneralTypes';

jest.mock('../../src/components/SeatSelector/SeatPickerModal', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');

  return {
    SeatPickerModal: ({ visible, onConfirm, onClose }: any) => {
      if (!visible) return null;
      return mockReact.createElement(
        mockRN.View,
        { testID: 'seat-picker-modal' },
        mockReact.createElement(
          mockRN.TouchableOpacity,
          { testID: 'mock-seat-confirm', onPress: () => onConfirm('B', 5) },
          mockReact.createElement(mockRN.Text, null, 'Confirm B5')
        ),
        mockReact.createElement(
          mockRN.TouchableOpacity,
          { testID: 'mock-close', onPress: onClose },
          mockReact.createElement(mockRN.Text, null, 'Close')
        )
      );
    },
  };
});

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
        products: [],
        loading: false,
        error: null,
      },
    },
  });
};

describe('SeatSelector', () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      selectedSeat: 'A',
      selectedRow: 1,
      onSeatChange: jest.fn(),
    };

    return render(
      <Provider store={store}>
        <SeatSelector {...defaultProps} {...props} />
      </Provider>
    );
  };

  it('should render seat selector with default values', () => {
    const { getByText } = renderComponent();

    expect(getByText('A')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(getByText('Asiento')).toBeTruthy();
  });

  it('should render with custom seat and row', () => {
    const { getByText } = renderComponent({
      selectedSeat: 'C',
      selectedRow: 15,
    });

    expect(getByText('C')).toBeTruthy();
    expect(getByText('15')).toBeTruthy();
  });

  it('should open modal when pressed', () => {
    const { getByText, queryByTestId } = renderComponent();

    expect(queryByTestId('seat-picker-modal')).toBeNull();

    const seatContainer = getByText('Asiento');
    fireEvent.press(seatContainer);

    expect(queryByTestId('seat-picker-modal')).toBeTruthy();
  });

  it('should call onSeatChange when seat is selected', () => {
    const onSeatChange = jest.fn();
    const { getByText, getByTestId } = renderComponent({ onSeatChange });

    const seatContainer = getByText('Asiento');
    fireEvent.press(seatContainer);

    const confirmButton = getByTestId('mock-seat-confirm');
    fireEvent.press(confirmButton);

    expect(onSeatChange).toHaveBeenCalledWith('B', 5);
  });
});
