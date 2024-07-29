import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/CategoryProductStyles.css'; // Ensure this import is included for custom CSS

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          <div className="col-md-9 offset-md-1" style={{width:"100%"}}>
            <div className="d-flex flex-wrap justify-content-start">
              {products?.map((p) => (
                <div className="card" style={{ width: "18rem" }} key={p.id}>
                  <img
                    src={`http://localhost:8080/api/v1/product/product-photo/${p.id}`}
                    className="card-img-top img-fluid"
                    alt={p.name}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text flex-grow-1">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text"><strong>${p.price}</strong></p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        More Details
                      </button>
                      <button className="btn btn-secondary">
                        <i className="fas fa-cart-plus"></i> ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
