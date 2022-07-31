export enum Size {
  small = "small",
  medium = "medium",
  large = "large",
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  size: Size;
}
