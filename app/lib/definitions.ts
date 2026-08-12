export type Seller = {
  id: string;
  name: string;
  story: string;
  joined_at: string;
  average_rating: number;
  role: "seller" | "customer" | "admin";
};

export type Product = {
  id: string;
  seller_id: string;
  name: string;
  description: string;
  price: number;
  current_image_url: string;
  image_history: string[];
  created_at: string;
  rating: number;
  review_count: number;
};