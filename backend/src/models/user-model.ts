import { Size } from "./product-model";
export enum OfferType {
  free = "free",
  discount = "discount",
}
export interface ICartItem {
  type: Size;
  id: number;
  name: string;
  size: Size;
  price: number;
  quantity: number;
}

// User schema
export interface IUser {
  id: number;
  name: string;
  company: string;
  cart?: ICartItem[];
}

export interface ICompany {
  id: number;
  name: string;
  offer: {
    name: string;
    type: OfferType;
    buy?: number;
    get?: number;
    on: Size;
    price?: number;
  };
}
