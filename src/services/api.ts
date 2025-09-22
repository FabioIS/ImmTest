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

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    const data: TResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  return request<Product[]>(`${BASE_URL}products`);
}

export async function makePayment(amount: number): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`${BASE_URL}makePayment`, {
    //Fake body as the mock API does not handle it
    // body: { amount },
  });
}
