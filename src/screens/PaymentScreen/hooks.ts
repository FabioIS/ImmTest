import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { deleteProduct, selectCartItems, useAppDispatch, useAppSelector } from '../../redux';
import { selectPaymentData } from '../../redux/cart/selectors';
import { makePaymentThunk } from '../../redux/productStore/thunk';
import { Product } from '../../types/ProductTypes';

export const usePaymentScreen = () => {
  const { totalAmount, currentCurrency, totalPriceWithDiscount, userType } =
    useAppSelector(selectPaymentData);
  const cartItems = useAppSelector(selectCartItems);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [selectedSeat, setSelectedSeat] = useState('A');
  const [selectedRow, setSelectedRow] = useState(1);

  const { isVisible, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSwipeComplete = useCallback(
    (item: Product) => {
      dispatch(deleteProduct(item.id));
    },
    [dispatch]
  );

  const handleSeatChange = useCallback((seat: string, row: number) => {
    setSelectedSeat(seat);
    setSelectedRow(row);
  }, []);

  const handleProductPress = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      openModal();
    },
    [openModal]
  );

  const handleCloseModal = useCallback(() => {
    closeModal();
    setSelectedProduct(null);
  }, [closeModal]);

  const onPaymentTypePress = useCallback(
    (type: string) => {
      dispatch(makePaymentThunk({ amount: totalPriceWithDiscount, method: type })).then(() => {
        navigation.navigate('Cart');
      });
    },
    [dispatch, navigation, totalPriceWithDiscount]
  );

  return {
    totalAmount,
    cartItems,
    selectedSeat,
    selectedRow,
    isVisible,
    selectedProduct,
    currentCurrency,
    totalPriceWithDiscount,
    userType,
    handleSwipeComplete,
    handleSeatChange,
    handleProductPress,
    handleCloseModal,
    onPaymentTypePress,
  };
};
