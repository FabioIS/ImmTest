import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { USER_TYPE } from '../../constants/constants';
import { Currency, UserType } from '../../types/GeneralTypes';
import { Product } from '../../types/ProductTypes';

export interface CartState {
  items: Product[];
  currency: Currency;
  userType: UserType;
}

const initialState: CartState = {
  items: [],
  currency: Currency.USD,
  userType: USER_TYPE[0],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<{ product: Product; amount?: number }>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.product.id);

      if (existingItem) {
        existingItem.amount += action.payload.amount || 1;
      } else {
        state.items.push({ ...action.payload.product, amount: action.payload.amount || 1 });
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    reduceAmount: (state, action: PayloadAction<{ productId: string; amount?: number }>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.productId);
      if (existingItem) {
        const productLeft = existingItem.amount - (action.payload.amount || 1);
        if (productLeft > 0) {
          existingItem.amount = productLeft;
        } else {
          state.items = state.items.filter((item) => item.id !== action.payload.productId);
        }
      }
    },
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
    },
    setUserType: (state, action: PayloadAction<UserType>) => {
      state.userType = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addProduct, deleteProduct, reduceAmount, clearCart, setCurrency, setUserType } =
  cartSlice.actions;
export default cartSlice.reducer;
