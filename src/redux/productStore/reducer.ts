import { createSlice } from '@reduxjs/toolkit';
import { Product } from '../../types/ProductTypes';
import { fetchProductsThunk, makePaymentThunk } from './thunk';

export interface ProductStoreState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductStoreState = {
  products: [],
  loading: false,
  error: null,
};

const productStoreSlice = createSlice({
  name: 'productStore',
  initialState,
  reducers: {
    getAllProducts: (state) => {
      return state;
    },
    reduceProductsAmount: (state, action: { payload: Product[] }) => {
      action.payload.forEach(({ id: productId, amount }) => {
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          product.amount -= amount;
          if (product.amount <= 0) {
            state.products = state.products.filter((p) => p.id !== productId);
          }
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(makePaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(makePaymentThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(makePaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { getAllProducts, reduceProductsAmount } = productStoreSlice.actions;
export default productStoreSlice.reducer;
