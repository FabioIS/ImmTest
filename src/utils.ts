import { Currency } from './types/GeneralTypes';

export const getPriceWithCurrency = (price: number, currency: string): string => {
  switch (currency) {
    case 'USD':
      return `$${price.toFixed(2)}`;
    case 'EUR':
      return `${price.toFixed(2)}€`;
    case 'GBP':
      return `£${price.toFixed(2)}`;
    default:
      return '';
  }
};

export const getPriceWithDiscount = (price: number, discount: number): number => {
  return parseFloat((price - (price * discount) / 100).toFixed(2));
};

const EXCHANGE_RATES = {
  USD: {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.75,
  },
  EUR: {
    USD: 1.18,
    EUR: 1.0,
    GBP: 0.88,
  },
  GBP: {
    USD: 1.33,
    EUR: 1.14,
    GBP: 1.0,
  },
} as const;

export const convertCurrency = (
  price: number,
  currentCurrency: Currency,
  targetCurrency: Currency
): number => {
  if (currentCurrency === targetCurrency) {
    return price;
  }

  const conversionRate = EXCHANGE_RATES[currentCurrency][targetCurrency];
  const convertedPrice = price * conversionRate;

  return parseFloat(convertedPrice.toFixed(2));
};
