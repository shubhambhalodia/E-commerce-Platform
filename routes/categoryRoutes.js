const express=require('express');
const {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
}=require("./../controllers/categoryController.js");

const router = express.Router();

router.post(
  "/create-category",
  createCategoryController
);

router.put(
  "/update-category/:id",
  updateCategoryController
);

router.get("/get-category", categoryController);

router.get("/single-category/:slug", singleCategoryController);

router.delete(
  "/delete-category/:id",
  deleteCategoryController
);

module.exports=router;