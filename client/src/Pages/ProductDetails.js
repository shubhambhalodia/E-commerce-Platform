import "../styles/ProductDetailsStyles.css";
import React, { useState, useEffect } from "react";
import Layout from "./../components/layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";

const ProductDetails = () => {
  const [cart, setCart] = useCart();
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.id) getProduct();
  }, [params?.id]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/get-product/${params.id}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product.id, data?.product.category);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="product-details-container mt-2">
        <div className="row">
          <div className="col-md-6">
            <img
              src={`http://localhost:8080/api/v1/product/product-photo/${product.id}`}
              className="card-img-top"
              alt={product.name}
            />
          </div>
          <div className="col-md-6">
            <h1 className="text-center">Product Details</h1>
            <h6>Name: {product.name}</h6>
            <h6>Description: {product.description}</h6>
            <h6>Price: {product.price}</h6>
            <h6>Category: {product?.category}</h6>
            <button
              className="btn btn-secondary ms-1"
              onClick={() => {
                setCart([...cart, product]);
                // toast.success("Item added to cart");
                localStorage.setItem(
                  "cart",
                  JSON.stringify([...cart, product])
                );
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div className="product-details-container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p.id}>
              <img
                src={`http://localhost:8080/api/v1/product/product-photo/${p?.id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text">$ {p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  More Details
                </button>
                <button
                  className="btn btn-secondary ms-1"
                  onClick={() => {
                    setCart([...cart, p]);
                    // toast.success("Item added to cart");
                    localStorage.setItem("cart", JSON.stringify([...cart, p]));
                  }}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
