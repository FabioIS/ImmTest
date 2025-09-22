import { ImageBackground, Pressable, Text, View } from 'react-native';
import { addProduct, selectProductAmount, useAppDispatch, useAppSelector } from '../../redux';
import { selectCartCurrency } from '../../redux/cart/selectors';
import { Currency } from '../../types/GeneralTypes';
import { Product } from '../../types/ProductTypes';
import { convertCurrency, getPriceWithCurrency } from '../../utils';
import { Badge } from '../Badge/Badge';
import styles from './styles';

export const PurchaseItem = (product: Product) => {
  const { id, name, amount, price } = product;
  const dispatch = useAppDispatch();
  const cartProductCount = useAppSelector((state) => selectProductAmount(state, id));
  const currentCurrency = useAppSelector(selectCartCurrency);

  const convertedPrice = convertCurrency(price, Currency.USD, currentCurrency);

  const handlePress = () => {
    dispatch(addProduct({ product }));
  };

  const amountText = amount > 1 ? `unidades` : `unidad`;
  return (
    <ImageBackground
      source={require('../../../assets/image.png')}
      style={styles.container}
      imageStyle={styles.imageStyle}
    >
      <Pressable onPress={handlePress} style={styles.button}>
        <View style={styles.textContainer}>
          <View style={styles.nameAmount}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.amount}>
              {amount} {amountText}
            </Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceText}>
              {getPriceWithCurrency(convertedPrice, currentCurrency)}
            </Text>
          </View>
        </View>
      </Pressable>
      {!!cartProductCount && <Badge color="blue" count={cartProductCount} size={25} />}
    </ImageBackground>
  );
};
