import { Product } from '../types/ProductTypes';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const BASE_URL = 'https://my-json-server.typicode.com/FabioIS/ImmTest/';

interface RequestOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
}

async function request<TResponse, TBody = {}>(
  url: string,
  options: RequestOptions<TBody> = {}
): Promise<TResponse> {
  try {
    const { method = 'GET', body, headers = {} } = options;

    console.log('🚀 ~ request ~ url:', url);
    const response = await fetch(url, {
      method,
      headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    const data: TResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  return request<Product[]>(`${BASE_URL}products`);
}

export async function makePayment(amount: number): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`${BASE_URL}payment`, {
    method: 'POST',
    body: { amount },
  });
}

const mockResponse = {
  products: [
    {
      id: '1',
      name: 'Coca Cola Classic',
      amount: 25,
      price: 2.49,
      currency: 'USD',
    },
    {
      id: '2',
      name: 'Pepsi Cola',
      amount: 30,
      price: 2.39,
      currency: 'USD',
    },
    {
      id: '3',
      name: 'Sprite Lemon-Lime',
      amount: 18,
      price: 2.29,
      currency: 'USD',
    },
    {
      id: '4',
      name: 'Dr Pepper',
      amount: 22,
      price: 2.69,
      currency: 'USD',
    },
    {
      id: '5',
      name: 'Mountain Dew',
      amount: 15,
      price: 2.59,
      currency: 'USD',
    },
    {
      id: '6',
      name: 'Fanta Orange',
      amount: 20,
      price: 2.19,
      currency: 'USD',
    },
    {
      id: '7',
      name: '7UP Lemon Lime',
      amount: 16,
      price: 2.35,
      currency: 'USD',
    },
    {
      id: '8',
      name: 'Ginger Ale',
      amount: 12,
      price: 2.89,
      currency: 'USD',
    },
    {
      id: '9',
      name: 'Root Beer',
      amount: 14,
      price: 2.75,
      currency: 'USD',
    },
    {
      id: '10',
      name: 'Orange Crush',
      amount: 11,
      price: 2.45,
      currency: 'USD',
    },
    {
      id: '11',
      name: 'Grape Soda',
      amount: 13,
      price: 2.55,
      currency: 'USD',
    },
    {
      id: '12',
      name: 'Lemon-Lime Soda',
      amount: 19,
      price: 2.25,
      currency: 'USD',
    },
    {
      id: '13',
      name: 'Cherry Cola',
      amount: 17,
      price: 2.65,
      currency: 'USD',
    },
    {
      id: '14',
      name: 'Diet Coke',
      amount: 28,
      price: 2.49,
      currency: 'USD',
    },
    {
      id: '15',
      name: 'Diet Pepsi',
      amount: 24,
      price: 2.39,
      currency: 'USD',
    },
    {
      id: '16',
      name: 'Club Soda',
      amount: 21,
      price: 1.99,
      currency: 'USD',
    },
    {
      id: '17',
      name: 'Tonic Water',
      amount: 15,
      price: 2.95,
      currency: 'USD',
    },
    {
      id: '18',
      name: 'Cream Soda',
      amount: 12,
      price: 2.79,
      currency: 'USD',
    },
    {
      id: '19',
      name: 'Strawberry Soda',
      amount: 14,
      price: 2.85,
      currency: 'USD',
    },
    {
      id: '20',
      name: 'Pineapple Soda',
      amount: 16,
      price: 2.99,
      currency: 'USD',
    },
  ],
};
