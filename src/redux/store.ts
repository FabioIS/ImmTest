import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/reducer';
import productStoreReducer from './productStore/reducer';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    productStore: productStoreReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
