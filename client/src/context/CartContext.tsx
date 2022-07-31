import React from "react";
import { ICartItem } from "../types/types";

const CartContext = React.createContext({
  cart: [] as ICartItem[],
  setCart: (cart: ICartItem[]) => {},
});

export default CartContext;
