const express=require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const {
  createProduct,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
  orderStatusController
} =require("../controllers/productController.js");
const formidable =require("express-formidable");

const router = express.Router();

//routes
router.post(
  "/create-product",
  formidable(),
  createProduct
);
//routes
router.put(
  "/update-product/:id",
  formidable(),
  updateProductController
);

router.get("/get-product", getProductController);
router.get("/get-product/:id", getSingleProductController);
router.get("/product-photo/:id", productPhotoController);
router.delete("/delete-product/:id", deleteProductController);
router.post("/product-filters", productFiltersController);
router.get("/product-count", productCountController);
router.get("/product-list/:page", productListController);
router.get("/search/:keyword", searchProductController);
router.get("/related-product/:pid/:cid", realtedProductController);
router.get("/product-category/:slug", productCategoryController);

router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
router.put('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController);
module.exports = router;