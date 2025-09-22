import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ProductModal } from '../../components/ProductModal/ProductModal';
import { SeatSelector } from '../../components/SeatSelector';
import { SwipeableRow } from '../../components/SwipeableRow/SwipeableRow';
import { useModal } from '../../hooks/useModal';
import {
  deleteProduct,
  selectCartItems,
  selectCartTotalPrice,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import { getUserType, selectCartCurrency, selectCartItemsCount } from '../../redux/cart/selectors';
import { makePaymentThunk } from '../../redux/productStore/thunk';
import { Currency } from '../../types/GeneralTypes';
import { Product } from '../../types/ProductTypes';
import { convertCurrency, getPriceWithCurrency, getPriceWithDiscount } from '../../utils';
import styles from './styles';

const PAYMENT_TYPE = {
  CASH: { icon: require('../../../assets/coins.png'), text: 'Efectivo' },
  CARD: { icon: require('../../../assets/credit-card.png'), text: 'Tarjeta' },
};

const PaymentScreen = () => {
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const currentCurrency = useAppSelector(selectCartCurrency);
  const userType = useAppSelector(getUserType);
  const totalPriceWithDiscount = getPriceWithDiscount(totalPrice, userType.discount);
  const cartItems = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectCartItemsCount);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [selectedSeat, setSelectedSeat] = useState('A');
  const [selectedRow, setSelectedRow] = useState(1);

  const { isVisible, openModal, closeModal } = useModal();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSwipeComplete = (item: Product) => {
    dispatch(deleteProduct(item.id));
  };

  const handleSeatChange = (seat: string, row: number) => {
    setSelectedSeat(seat);
    setSelectedRow(row);
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedProduct(null);
  };

  const onPaymentTypePress = (type: string) => {
    dispatch(makePaymentThunk({ amount: totalPriceWithDiscount, method: type })).then(() => {
      navigation.navigate('Cart');
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainTopContainer}>
        <Text style={styles.title}>Ticket</Text>
        <Text style={styles.subtitle}>Productos seleccionados</Text>
        <FlashList
          data={cartItems}
          renderItem={({ item, index }) => (
            <SwipeableRow
              key={`${item.id}-${index}`}
              onSwipeComplete={() => handleSwipeComplete(item)}
              onPress={() => handleProductPress(item)}
            >
              <Image source={require('../../../assets/image.png')} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                {getPriceWithCurrency(
                  convertCurrency(item.price * item.amount, Currency.USD, currentCurrency),
                  currentCurrency
                )}
              </Text>
              <Text style={styles.productAmount}>{item.amount}</Text>
            </SwipeableRow>
          )}
        />
      </View>
      <View style={styles.mainBottomContainer}>
        <View style={styles.topSection}>
          <View style={styles.seatSection}>
            <SeatSelector
              selectedSeat={selectedSeat}
              selectedRow={selectedRow}
              onSeatChange={handleSeatChange}
            />
          </View>
          <View>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPrice}>
              {getPriceWithCurrency(totalPriceWithDiscount, currentCurrency)}
            </Text>
            {!!userType.discount && (
              <Text style={[styles.totalText, { fontSize: 12 }]}>
                ({userType.discount}% descuento aplicado)
              </Text>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {Object.entries(PAYMENT_TYPE).map(([key, { icon, text }]) => (
            <TouchableOpacity
              style={styles.payContainer}
              key={key}
              disabled={!totalAmount}
              onPress={() => onPaymentTypePress(key)}
            >
              <Image source={icon} style={styles.productImage} tintColor={'white'} />
              <Text style={styles.payText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedProduct && (
        <ProductModal visible={isVisible} product={selectedProduct} onClose={handleCloseModal} />
      )}
    </View>
  );
};

export default PaymentScreen;
