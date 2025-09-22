import { createSelector } from '@reduxjs/toolkit';
import { Currency } from '../../types/GeneralTypes';
import { Product } from '../../types/ProductTypes';
import { convertCurrency } from '../../utils';
import { RootState } from '../store';

export const selectCartItems = (state: RootState): Product[] => state.cart.items;
export const selectCartCurrency = (state: RootState): Currency => state.cart.currency;

export const selectCartItemsCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.amount, 0)
);

export const selectCartTotalPrice = createSelector(
  [selectCartItems, selectCartCurrency],
  (items, currentCurrency) =>
    convertCurrency(
      items.reduce((total, item) => total + item.price * item.amount, 0),
      Currency.USD,
      currentCurrency
    )
);

export const selectProductAmount = createSelector(
  [selectCartItems, (state: RootState, productId: string) => productId],
  (items, productId) => {
    const item = items.find((item) => item.id === productId);
    return item ? item.amount : 0;
  }
);


export const getUserType = (state: RootState) => state.cart.userType;
