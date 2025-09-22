export { store } from './store';
export type { AppDispatch, RootState } from './store';

export { useAppDispatch, useAppSelector } from './hooks';

export { addProduct, clearCart, deleteProduct, reduceAmount, type CartState } from './cart/reducer';

export {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotalPrice,
  selectProductAmount,
} from './cart/selectors';

export { getAllProducts, type ProductStoreState } from './productStore/reducer';

export {
  selectAllProducts,
  selectAreProductsLoaded,
  selectProductById,
  selectProductsCount,
  selectProductsError,
  selectProductsLoading,
} from './productStore/selectors';

export { fetchProductsThunk } from './productStore/thunk';
