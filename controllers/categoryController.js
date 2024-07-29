
const pool = require('../config/db');
const slugify = require('slugify');

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }

    const existingCategoryResult = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (existingCategoryResult.rows.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    const slug = slugify(name);
    const newCategoryResult = await pool.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );

    res.status(201).send({
      success: true,
      message: "New category created",
      category: newCategoryResult.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

// Update Category Controller
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const slug = slugify(name);

    const updatedCategoryResult = await pool.query(
      'UPDATE categories SET name = $1, slug = $2 WHERE id = $3 RETURNING *',
      [name, slug, id]
    );

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategoryResult.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// Get All Categories Controller
const categoryController = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.status(200).send({
      success: true,
      message: "All Categories List",
      categories: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// Get Single Category Controller
const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting Single Category",
    });
  }
};

// Delete Category Controller
const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};

module.exports={createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController};
