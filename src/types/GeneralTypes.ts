export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export type UserType = {
  id: string;
  name: 'Retail' | 'Crew' | 'Happy Hour' | 'Business' | 'Turista';
  discount: number;
};
