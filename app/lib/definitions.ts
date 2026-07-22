export type Seller = {
  id: string;
  name: string;
  story: string;
  averageRating: number;
  joinedAt: string;
};

export type Product = {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHistory: string[];
  createdAt: string;
  rating: number;
  reviewCount: number;
};