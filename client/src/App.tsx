import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { getUserById } from "./API";
import "./App.css";
import Checkout from "./components/Checkout";
import Home from "./components/Home";
import UserSelect from "./components/UserSelect";
import CartContext from "./context/CartContext";
import UserContext from "./context/UserContext";
import { ICartItem, IUser } from "./types/types";

function App() {
  const [user, setUser] = React.useState(null as IUser | null);
  const [cart, setCart] = React.useState([] as ICartItem[]);
  useEffect(() => {
    if (user) {
      getUserById(user.id).then((res) => {
        setCart(res.data.cart ?? []);
      });
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cart, setCart }}>
        <div className="App">
          <header className="App-header">
            <Link className="App-link" to="/">
              <h1>Bepoz</h1>
            </Link>
            <UserSelect />
            Cart ({cart?.length || 0})
          </header>
          <div>
            <Home />
            <Checkout />
          </div>
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
