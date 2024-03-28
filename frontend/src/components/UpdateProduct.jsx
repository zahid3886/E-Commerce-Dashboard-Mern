import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    getProductDetail();
  }, []);

  const getProductDetail = async () => {
    console.log(params);
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      headers: {
        authorization: ` bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    console.log(result);
    setName(result.name);
    setPrice(result.price);
    setCategory(result.category);
    setCompany(result.company);
  };

  const updateProduct = async () => {
    console.log(name, price, category, company);
    let result = await fetch(`http://localhost:5000/product/${params.id}`, {
      method: "Put",
      body: JSON.stringify({ name, price, category, company }),
      headers: {
        "Content-Type": "application/json",
        authorization: ` bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    console.log(result);
    navigate("/");
  };
  return (
    <div className="product">
      <h1>Update Product</h1>
      <input
        className="inputBox"
        type="text"
        placeholder="enter product name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        className="inputBox"
        type="text"
        placeholder="enter product price"
        onChange={(e) => setPrice(e.target.value)}
        value={price}
      />

      <input
        className="inputBox"
        type="text"
        placeholder="enter product category"
        onChange={(e) => setCategory(e.target.value)}
        value={category}
      />

      <input
        className="inputBox"
        type="text"
        placeholder="enter product company"
        onChange={(e) => setCompany(e.target.value)}
        value={company}
      />

      <button onClick={updateProduct} className="addBtn" type="button">
        Update Product
      </button>
    </div>
  );
};

export default UpdateProduct;
