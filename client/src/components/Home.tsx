import React, { useEffect } from "react";
import { getAllProducts } from "../API";
import { IProduct } from "../types/types";
import Product from "./Product";

function Home() {
  const [products, setProducts] = React.useState([] as IProduct[]);
  useEffect(() => {
    getAllProducts().then((res) => {
      // console.log(res);
      setProducts(res.data.products);
    });
  }, []);
  return (
    <div>
      <h1>Place order: </h1>
      <ul className="product-container">
        {products?.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}

export default Home;
