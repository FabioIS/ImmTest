import { fetchProductsThunk } from '../../src/redux/productStore/thunk';
import { Currency } from '../../src/types/GeneralTypes';
import { Product } from '../../src/types/ProductTypes';

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
(globalThis as any).fetch = mockFetch;

describe('ProductStore Thunks', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  const mockAPIResponse: { products: Product[] } = {
    products: [
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
    ],
  };

  describe('fetchProducts', () => {
    it('should fetch products successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAPIResponse,
      } as Response);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchProductsThunk();
      const result = await thunk(dispatch, getState, undefined);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://my-json-server.typicode.com/FabioIS/ImmTest/products',
        { body: undefined, headers: { 'Content-Type': 'application/json' }, method: 'GET' }
      );
      expect(mockFetch).toHaveBeenCalledTimes(1);

      expect(result.type).toBe('productStore/fetchProducts/fulfilled');
      expect(result.payload).toEqual(mockAPIResponse.products);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchProductsThunk();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('productStore/fetchProducts/rejected');
      expect(result.payload).toBe('Request failed: 404 undefined');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchProductsThunk();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('productStore/fetchProducts/rejected');
      expect(result.payload).toBe('Network error');
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error');

      const dispatch = jest.fn();
      const getState = jest.fn();

      const thunk = fetchProductsThunk();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.type).toBe('productStore/fetchProducts/rejected');
      expect(result.payload).toBe('An unknown error occurred while fetching products');
    });
  });
});
