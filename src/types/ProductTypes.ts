import { Currency } from './GeneralTypes';

export type Product = {
  id: string;
  name: string;
  amount: number;
  price: number;
  currency: Currency;
};
