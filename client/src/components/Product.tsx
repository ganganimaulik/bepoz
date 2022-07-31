import React, { useContext } from "react";
import { updateUserCart } from "../API";
import CartContext from "../context/CartContext";
import UserContext from "../context/UserContext";
import { IProduct } from "../types/types";

function Product({ product }: { product: IProduct }) {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  let item = cart?.find((p) => p.id == product.id);

  let totalInCart = item?.quantity || 0;
  const addItemToCart = () => {
    let newCart = cart;
    if (item) {
      newCart = [
        ...cart.map((i) => {
          if (i.id == product.id) {
            return { ...i, quantity: i.quantity + 1 };
          }
          return i;
        }),
      ];
    } else {
      newCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          size: product.size,
        },
      ];
    }
    updateUserCart(user, newCart).then((res) => {
      setCart(newCart);
    });
  };

  const removeItemFromCart = () => {
    let newCart = cart;
    if (item) {
      newCart = [
        ...cart.map((i) => {
          if (i.id == product.id) {
            return { ...i, quantity: i.quantity - 1 };
          }
          return i;
        }),
      ];
    }
    newCart = [...newCart.filter((i) => i.quantity > 0)];

    updateUserCart(user, newCart).then((res) => {
      setCart(newCart);
    });
  };

  return (
    <div className={`product product-${product.size}`}>
      <h1>{product.name}</h1>
      <p>${product.price / 100}</p>
      <button
        disabled={totalInCart == 0}
        className="remove-btn"
        onClick={removeItemFromCart}
      >
        -
      </button>
      {" " + totalInCart}{" "}
      <button className="add-btn" onClick={addItemToCart}>
        +
      </button>
    </div>
  );
}

export default Product;
