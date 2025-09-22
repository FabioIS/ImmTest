import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { CurrencyPriceDisplay } from '../../components/CurrencyPriceDisplay';
import { PaymentButton } from '../../components/PaymentButton/PaymentButton';
import { PurchaseItem } from '../../components/PurchaseItem/PurchaseItem';
import { selectAllProducts, selectProductsLoading, useAppSelector } from '../../redux';
import styles from './styles';

const CartScreen = () => {
  const loading = useAppSelector(selectProductsLoading);
  const products = useAppSelector(selectAllProducts);

  return (
    <View style={styles.container}>
      <FlashList
        data={products}
        numColumns={2}
        renderItem={({ item }) => <PurchaseItem {...item} />}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          loading ? <ActivityIndicator size="large" /> : <Text>No products found</Text>
        }
      />
      <View style={styles.paymentContainer}>
        <PaymentButton />
        <CurrencyPriceDisplay />
      </View>
    </View>
  );
};

export default CartScreen;
