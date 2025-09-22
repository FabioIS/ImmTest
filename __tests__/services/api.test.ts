import { fetchProducts, makePayment } from '../../src/services/api';
import { Currency } from '../../src/types/GeneralTypes';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
(globalThis as any).fetch = mockFetch;

describe('API Service', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Coca Cola',
          amount: 25,
          price: 2.49,
          currency: Currency.USD,
        },
        {
          id: '2',
          name: 'Pepsi',
          amount: 30,
          price: 2.39,
          currency: Currency.USD,
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ products: mockProducts }),
      } as Response);

      const result = await fetchProducts();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://my-json-server.typicode.com/FabioIS/ImmTest/products',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      expect(result).toEqual({ products: mockProducts });
    });

    it('should handle fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Network error');
    });

    it('should handle non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchProducts()).rejects.toThrow('Request failed: 404 Not Found');
    });
  });

  describe('makePayment', () => {
    it('should make payment successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Payment processed successfully',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await makePayment(25.99);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://my-json-server.typicode.com/FabioIS/ImmTest/payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: 25.99 }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle payment failure', async () => {
      const mockResponse = {
        success: false,
        message: 'Insufficient funds',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await makePayment(1000);

      expect(result).toEqual(mockResponse);
    });

    it('should handle network error during payment', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Payment gateway timeout'));

      await expect(makePayment(25.99)).rejects.toThrow('Payment gateway timeout');
    });

    it('should handle different amount values', async () => {
      const mockResponse = { success: true, message: 'Payment processed' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await makePayment(10.5);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ amount: 10.5 }),
        })
      );

      await makePayment(0);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ amount: 0 }),
        })
      );

      await makePayment(999.99);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ amount: 999.99 }),
        })
      );
    });
  });
});
