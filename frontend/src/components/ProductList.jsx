import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    let result = await fetch("http://localhost:5000/products", {
      headers: {
        authorization: ` bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    console.log(id);
    let result = await fetch(`http://localhost:5000/product/${id}`, {
      method: "Delete",
      headers: {
        authorization: ` bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      getProduct();
    }
  };

  const searchHandle = async (e) => {
    console.log(e.target.value);
    let key = e.target.value;
    if (key) {
      let result = await fetch(`http://localhost:5000/search/${key}`, {
        headers: {
          authorization: ` bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProduct();
    }
  };

  return (
    <div className="product-list">
      <h1>Product List...</h1>
      <input
        className="search-product-box"
        type="text"
        placeholder="search product"
        onChange={searchHandle}
      />
      <ul>
        <li>Serial No.</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Company</li>
        <li>Operation</li>
      </ul>
      {products.length > 0 ? (
        products.map((item, index) => (
          <ul key={item._id}>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>{item.company}</li>
            <li>
              <button onClick={() => deleteProduct(item._id)}>Delete</button>
              <Link to={"/update/" + item._id}>Update</Link>
            </li>
          </ul>
        ))
      ) : (
        <h1>No Result Found</h1>
      )}
    </div>
  );
};

export default ProductList;
