import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts, makePayment } from '../../services/api';
import { Product } from '../../types/ProductTypes';
import { clearCart } from '../cart/reducer';
import { AppDispatch, RootState } from '../store';
import { reduceProductsAmount } from './reducer';

export const fetchProductsThunk = createAsyncThunk<
  Product[],
  void,
  {
    rejectValue: string;
  }
>('productStore/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchProducts();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred while fetching products');
  }
});

export const makePaymentThunk = createAsyncThunk<
  void,
  { amount: number; method: string },
  {
    dispatch: AppDispatch;
    state: RootState;
    rejectValue: string;
  }
>('productStore/makePayment', async ({ amount }, { rejectWithValue, dispatch, getState }) => {
  try {
    const { success, message } = await makePayment(amount);
    if (!success) {
      throw new Error(message);
    }
    const cartProducts = getState().cart.items;
    dispatch(reduceProductsAmount(cartProducts));
    dispatch(clearCart());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred while fetching products');
  }
});
