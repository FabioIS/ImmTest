import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useModal } from '../../hooks/useModal';
import { setCurrency } from '../../redux/cart/reducer';
import { selectCartCurrency, selectCartTotalPrice } from '../../redux/cart/selectors';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Currency } from '../../types/GeneralTypes';
import { convertCurrency, getPriceWithCurrency } from '../../utils';
import { CustomModal } from '../Modal/Modal';
import { styles } from './styles';

export const CurrencyPriceDisplay = () => {
  const { isVisible, closeModal, openModal } = useModal();
  const currentCurrency = useAppSelector(selectCartCurrency);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const dispatch = useAppDispatch();

  const otherCurrencies = Object.values(Currency).filter(
    (currency) => currency !== currentCurrency
  );

  const convertedPrices = otherCurrencies.map((currency) => {
    const convertedAmount = convertCurrency(totalPrice, currentCurrency, currency);
    const formattedPrice = getPriceWithCurrency(convertedAmount, currency);
    return {
      currency,
      amount: convertedAmount,
      formatted: formattedPrice,
    };
  });

  const selectCurrency = (currency: Currency) => {
    dispatch(setCurrency(currency));
    closeModal();
  };

  if (totalPrice === 0) {
    return null;
  }

  return (
    <>
      <Pressable style={styles.container} onPress={openModal} testID="currency-display">
        {convertedPrices.map(({ currency, formatted }, index) => (
          <Text key={currency} style={styles.priceText}>
            {formatted} {index === 0 && <Text>| </Text>}
          </Text>
        ))}
      </Pressable>

      <CustomModal isVisible={isVisible} onClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {convertedPrices.map(({ currency, formatted }) => (
              <Pressable
                key={formatted}
                style={styles.priceRow}
                onPress={() => {
                  selectCurrency(currency);
                }}
              >
                <Text style={styles.priceText}>{formatted}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </CustomModal>
    </>
  );
};
