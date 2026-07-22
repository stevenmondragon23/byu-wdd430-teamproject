import { Seller, Product } from './definitions';

export const sellers: Seller[] = [
  {
    id: '123',
    name: 'David Owen',
    story: 'Hi, I\'m David Owen. I started woodcarving in my small workshop in the south five years ago. Each piece is unique and made from sustainably sourced wood. All my products have a story behind them, and every stroke represents hours of work.',
    averageRating: 4.8,
    joinedAt: '2023-01-10',
  },
  {
    id: '456',
    name: 'Luvia Ceramics',
    story: 'I make ceramics inspired by nature. I just joined Handcrafted Haven to share my art.',
    averageRating: 5.0,
    joinedAt: new Date().toISOString(),
  }
];

export const products: Product[] = [];