export interface Product {
  productId: string;
  name: string;
  url: string;
  inStock: boolean;
  price: number;
  retailerId: string;
  dateAdded: number;
  dateLastInStock: number;
}

export interface Retailer {
  name: string;
}
