export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  description: string;
  isPromo: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
