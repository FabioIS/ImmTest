import { Currency } from '../src/types/GeneralTypes';
import { convertCurrency, getPriceWithCurrency, getPriceWithDiscount } from '../src/utils';

describe('Utils', () => {
  describe('getPriceWithCurrency', () => {
    it('should format USD correctly', () => {
      expect(getPriceWithCurrency(10.99, Currency.USD)).toBe('$10.99');
    });

    it('should format EUR correctly', () => {
      expect(getPriceWithCurrency(10.99, Currency.EUR)).toBe('10.99€');
    });

    it('should format GBP correctly', () => {
      expect(getPriceWithCurrency(10.99, Currency.GBP)).toBe('£10.99');
    });

    it('should return empty string for unknown currency', () => {
      expect(getPriceWithCurrency(10.99, 'UNKNOWN' as any)).toBe('');
    });
  });

  describe('getPriceWithDiscount', () => {
    it('should calculate discount correctly', () => {
      expect(getPriceWithDiscount(100, 10)).toBe(90);
    });

    it('should handle decimal discounts', () => {
      expect(getPriceWithDiscount(100, 15.5)).toBe(84.5);
    });

    it('should round to 2 decimal places', () => {
      expect(getPriceWithDiscount(99.99, 33.33)).toBe(66.66);
    });
  });

  describe('convertCurrency', () => {
    it('should return same price when currencies are identical', () => {
      expect(convertCurrency(100, Currency.USD, Currency.USD)).toBe(100);
      expect(convertCurrency(85, Currency.EUR, Currency.EUR)).toBe(85);
      expect(convertCurrency(75, Currency.GBP, Currency.GBP)).toBe(75);
    });

    it('should convert USD to EUR correctly', () => {
      expect(convertCurrency(100, Currency.USD, Currency.EUR)).toBe(85);
    });

    it('should convert USD to GBP correctly', () => {
      expect(convertCurrency(100, Currency.USD, Currency.GBP)).toBe(75);
    });

    it('should convert EUR to USD correctly', () => {
      expect(convertCurrency(100, Currency.EUR, Currency.USD)).toBe(118);
    });

    it('should convert GBP to USD correctly', () => {
      expect(convertCurrency(100, Currency.GBP, Currency.USD)).toBe(133);
    });

    it('should convert EUR to GBP correctly', () => {
      expect(convertCurrency(100, Currency.EUR, Currency.GBP)).toBe(88);
    });

    it('should convert GBP to EUR correctly', () => {
      expect(convertCurrency(100, Currency.GBP, Currency.EUR)).toBe(114);
    });

    it('should handle decimal amounts correctly', () => {
      expect(convertCurrency(10.5, Currency.USD, Currency.EUR)).toBe(8.92);
    });

    it('should round to 2 decimal places', () => {
      expect(convertCurrency(99.99, Currency.USD, Currency.EUR)).toBe(84.99);
    });

    it('should handle small amounts', () => {
      expect(convertCurrency(1, Currency.USD, Currency.EUR)).toBe(0.85);
      expect(convertCurrency(1, Currency.USD, Currency.GBP)).toBe(0.75);
      expect(convertCurrency(1, Currency.EUR, Currency.USD)).toBe(1.18);
    });

    it('should handle large amounts', () => {
      expect(convertCurrency(1000, Currency.USD, Currency.EUR)).toBe(850);
      expect(convertCurrency(1000, Currency.EUR, Currency.USD)).toBe(1180);
      expect(convertCurrency(1000, Currency.GBP, Currency.EUR)).toBe(1140);
    });
  });
});
