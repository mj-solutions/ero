export interface Price {
  price: string;
  currency: string;
  vat: number;
  type?: any;
  endAt: string;
  maxQtyPerCustomer?: any;
}

export interface Release {
  timestamp: number;
  format: string;
}

export interface RegularPrice {
  price: string;
  currency: string;
  vat: number;
  type?: any;
  endAt: string;
  maxQtyPerCustomer?: any;
}

export interface Manufacturer {
  id: number;
  name: string;
  takeoverUrl?: any;
  websiteUrl: string;
  visible: boolean;
}

export interface WebhallenResponseProduct {
  id: number;
  name: string;
  price: Price;
  stock: any;
  release: Release;
  isFyndware: boolean;
  reviewCount?: any;
  categoryTree: string;
  regularPrice: RegularPrice;
  fyndwareClass?: any;
  averageRating?: any;
  energyMarking?: any;
  statusCodes: number[];
  mainTitle: string;
  subTitle: string;
  minimumRankLevel: number;
  manufacturer: Manufacturer;
}

export interface WebhallenResponse {
  totalProductCount: number;
  products: WebhallenResponseProduct[];
}
