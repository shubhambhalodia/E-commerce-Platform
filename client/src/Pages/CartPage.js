import React from "react";
import { useState, useEffect } from "react";
import Layout from "./../components/layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DropIn from "braintree-web-drop-in-react";
import styles from "../styles/CartPage.module.css"; // Import CSS Module
import toast from "react-hot-toast";
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instance, setInstance] = useState("");
  const [clientToken, setClientToken] = useState("");

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += Number(item.price);
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //delete item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item.id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const token = auth.token;

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("http://localhost:8080/api/v1/product/braintree/payment", {
        nonce,
        cart,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={`container my-4 ${styles.cartContainer}`}>
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className={`text-primary ${styles.title}`}>Your Shopping Cart</h1>
            <h4 className={`text-secondary ${styles.subtitle}`}>
              {cart?.length
                ? `You have ${cart.length} items in your cart`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cart?.map((p) => (
              <div key={p.id} className={`card mb-3 shadow-sm ${styles.cartItem}`}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={`http://localhost:8080/api/v1/product/product-photo/${p.id}`}
                      className={`img-fluid rounded-start ${styles.productImage}`}
                      alt={p.name}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className={`card-title ${styles.productTitle}`}>{p.name}</h5>
                      <p className="card-text">{p.description.substring(0, 30)}</p>
                      <p className="card-text">
                        <small className="text-muted">Price: ${p.price}</small>
                      </p>
                      <button
                        className={`btn btn-danger ${styles.removeButton}`}
                        onClick={() => removeCartItem(p.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className={`card shadow-sm ${styles.summaryCard}`}>
              <div className="card-body">
                <h2 className={`card-title text-center ${styles.summaryTitle}`}>Cart Summary</h2>
                <hr />
                <h4 className="card-text">Total: {totalPrice()}</h4>
                {auth?.user?.address ? (
                  <>
                    <div className="mb-3">
                      <h5>Current Address</h5>
                      <p>{auth?.user?.address}</p>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Update Address
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    {auth?.token ? (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Update Address
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() =>
                          navigate("/login", {
                            state: "/cart",
                          })
                        }
                      >
                        Please login to checkout
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-2">
                  {!clientToken || !cart?.length ? (
                    ""
                  ) : (
                    <>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance) => setInstance(instance)}
                      />
                      <button
                        className="btn btn-primary btn-block"
                        onClick={handlePayment}
                        disabled={loading || !instance || !auth?.user?.address}
                      >
                        {loading ? "Processing ...." : "Make Payment"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
