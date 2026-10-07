export type Product = {
  id: string;
  slug: string;
  name: string;
  volumeMl: number;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
