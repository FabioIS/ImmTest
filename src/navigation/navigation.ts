import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen/CartScreen';
import PaymentScreen from '../screens/PaymentScreen/PaymentScreen';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Cart',
  screens: {
    Cart: {
      screen: CartScreen,
      options: { headerShown: true, headerBackVisible: false, title: '', gestureEnabled: false },
    },
    Payment: { screen: PaymentScreen, options: { headerShown: true, title: '' } },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
