export interface ScrapedProduct {
  productId: string;
  name: string;
  url: string;
  inStock: boolean;
  price: number;
  retailerName: string;
  dateAdded: number;
  dateLastInStock: number;
}
