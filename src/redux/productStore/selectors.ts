import { createSelector } from '@reduxjs/toolkit';
import { Product } from '../../types/ProductTypes';
import { RootState } from '../store';

export const selectProductStoreState = (state: RootState) => state.productStore;

export const selectAllProducts = createSelector(
  [selectProductStoreState],
  (productStoreState) => productStoreState.products
);

export const selectProductsLoading = createSelector(
  [selectProductStoreState],
  (productStoreState) => productStoreState.loading
);

export const selectProductsError = createSelector(
  [selectProductStoreState],
  (productStoreState) => productStoreState.error
);

export const selectProductById = createSelector(
  [selectAllProducts, (state: RootState, productId: string) => productId],
  (products: Product[], productId: string) =>
    products.find((product: Product) => product.id === productId)
);

export const selectProductsCount = createSelector(
  [selectAllProducts],
  (products) => products.length
);

export const selectAreProductsLoaded = createSelector(
  [selectAllProducts],
  (products) => products.length > 0
);
