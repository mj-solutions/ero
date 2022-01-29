export interface Product {
  id: string;
  productId: string;
  name: string;
  url: string;
  inStock: boolean;
  price: number;
  retailer: Retailer;
}

export interface Retailer {
  id: string;
  name: string;
}
