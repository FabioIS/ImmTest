import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, Text, View } from 'react-native';
import { useModal } from '../../hooks/useModal';
import {
  selectCartItemsCount,
  selectCartTotalPrice,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import { setUserType } from '../../redux/cart/reducer';
import { getUserType, selectCartCurrency } from '../../redux/cart/selectors';
import { UserType } from '../../types/GeneralTypes';
import { getPriceWithCurrency, getPriceWithDiscount } from '../../utils';
import { Badge } from '../Badge/Badge';
import { UserTypeModal } from './components/UserTypeModal';
import styles from './styles';

export const PaymentButton = () => {
  const userType = useAppSelector(getUserType);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const totalAmount = useAppSelector(selectCartItemsCount);
  const currentCurrency = useAppSelector(selectCartCurrency);
  const totalPriceWithDiscount = getPriceWithDiscount(totalPrice, userType.discount);
  const { isVisible, openModal, closeModal } = useModal();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const navigateToPayment = () => navigation.navigate('Payment');
  const changeUserType = (newType: UserType) => {
    dispatch(setUserType(newType));
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable disabled={!totalAmount} style={styles.payContainer} onPress={navigateToPayment}>
          <Text style={[styles.bold, styles.colorWhite]}>
            Pagar {getPriceWithCurrency(totalPriceWithDiscount, currentCurrency)}
          </Text>
          {!!userType.discount && (
            <Text style={[styles.bold, styles.colorWhite]}>
              ({userType.discount}% descuento aplicado)
            </Text>
          )}
        </Pressable>
        <Pressable style={styles.optionContainer} onPress={openModal}>
          <Text style={styles.colorWhite}>{userType.name} </Text>
          <Image source={require('../../../assets/down.png')} style={styles.icon} />
        </Pressable>
      </View>
      <UserTypeModal isVisible={isVisible} closeModal={closeModal} onPress={changeUserType} />
      {!!totalAmount && <Badge color="green" count={totalAmount} size={30} />}
    </>
  );
};
