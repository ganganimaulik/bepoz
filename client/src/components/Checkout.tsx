import React, { useContext, useEffect } from "react";
import { getCheckoutResult } from "../API";
import CartContext from "../context/CartContext";
import UserContext from "../context/UserContext";

function Checkout() {
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [checkoutResult, setCheckoutResult] = React.useState({
    total: 0,
    offerApplied: "none",
  });

  useEffect(() => {
    if (user) {
      getCheckoutResult(user).then((res) => {
        setCheckoutResult(res.data);
      });
    }
  }, [user, cart]);
  return (
    <div>
      <h1>Checkout:</h1>
      <h2>
        <span className="offer-applied">
          {`offer applied: ${checkoutResult.offerApplied}`} |{" "}
        </span>
        <span className="cart-total">
          Total: ${checkoutResult.total / 100}{" "}
        </span>
      </h2>
    </div>
  );
}

export default Checkout;
