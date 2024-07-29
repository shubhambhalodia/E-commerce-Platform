const pool = require('../config/db');
const fs = require("fs");
const braintree=require('braintree');
const dotenv=require('dotenv');
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
// Function to handle creating a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(500).send({ error: "All fields are required" });
    }

    // const slug = slugify(name);  
    let photoData = null;
    let photoContentType = null;

    if (photo) {
      photoData = fs.readFileSync(photo.path);
      photoContentType = photo.type;
    }
    // const created_at = new Date();
    // const updated_at = createdAt;
    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, quantity, photo, photo_content_type, shipping, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [name, description, price, category, quantity, photoData, photoContentType, shipping]
    );

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in creating product",
    });
  }
};

// Function to get all products
const getProductController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, category, quantity, shipping, created_at, updated_at
       FROM products
       ORDER BY created_at DESC`
    );

    res.status(200).send({
      success: true,
      countTotal: result.rowCount,
      message: "All Products",
      products: result.rows,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in getting products",
    });
  }
};

// Function to get a single product by slug
const getSingleProductController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, category, quantity, shipping, created_at, updated_at
       FROM products
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting single product:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while getting single product",
    });
  }
};

// Function to get product photo by product ID
const productPhotoController = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT photo, photo_content_type
       FROM products
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0 || !result.rows[0].photo) {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }

    res.set("Content-type", result.rows[0].photo_content_type);
    res.status(200).send(result.rows[0].photo);
  } catch (error) {
    console.error("Error getting product photo:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while getting product photo",
    });
  }
};

// Function to delete a product by product ID
const deleteProductController = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error while deleting product",
    });
  }
};

// Function to update a product by product ID
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(500).send({ error: "All fields are required" });
    }

    // const slug = slugify(name);
    let photoData = null;
    let photoContentType = null;

    if (photo) {
      photoData = fs.readFileSync(photo.path);
      photoContentType = photo.type;
    }

    const result = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, price = $3, category = $4, quantity = $5, photo = $6, photo_content_type = $7, shipping = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, description, price, category, quantity, photoData, photoContentType, shipping, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in updating product",
    });
  }
};

// const productFiltersController = async (req, res) => {
//   try {
//     const { checked, radio } = req.body;
//     console.log(checked, radio);
//     let query = 'SELECT * FROM products';
//     let args = [];
//     if (checked && checked.length>0) {
//       query += ` WHERE ${checked} = ANY(category_array)`; 
//     }

//     if (radio && radio.length) {
//       query += ` OR price BETWEEN $${args.length + 1} AND $${args.length + 2}`;
//       args.push(Number(radio[0]), Number(radio[1]));
//     }
//     console.log(query, args);
//     const { rows } = await pool.query(query, args);
//     console.log(rows[0], "result");
//     res.status(200).send({  
//       success: true,
//       products: rows,
//     });
//   } catch (error) {
//     console.error('Error while filtering products:', error);
//     res.status(400).send({
//       success: false,
//       message: 'Error while filtering products',
//       error,
//     });
//   }
// };


// const productFiltersController = async (req, res) => {
//   try {
//     const { checked, radio } = req.body;
//     console.log(checked, radio);

//     let query = 'SELECT * FROM products';
//     let args = [];

//     // Construct the WHERE clause for categories
//     if (checked && checked.length > 0) {
//       query += ' WHERE category = ANY($1::int[])';
//       args.push(checked);
//     }

//     // Add price range filter if radio array has exactly one value
//     if (radio && radio.length === 1) {
//       if (args.length === 0) {
//         query += ' WHERE';
//       } else {
//         query += ' AND';
//       }
//       query += ' price >= $2 AND price <= $3';
//       args.push(Number(radio[0]) - 5, Number(radio[0]) + 5); // Example: Assuming radio[0] is the single price value
//     }

//     console.log(query, args);

//     const { rows } = await pool.query(query, args);
//     console.log(rows, "result");

//     res.status(200).send({
//       success: true,
//       products: rows[0],
//     });
//   } catch (error) {
//     console.error('Error while filtering products:', error);
//     res.status(400).send({
//       success: false,
//       message: 'Error while filtering products',
//       error,
//     });
//   }
// };


const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log(checked, radio);

    let query = 'SELECT * FROM products';
    let args = [];

    // Construct the WHERE clause for categories
    // if (checked && checked.length > 0){
    //   query += ' WHERE category_array && $1'; // This checks for overlap between arrays
    //   args.push(checked);
    // }

    if (checked && checked.length > 0) {
      // Create a placeholder for each category ID
      const placeholders = checked.map((_, index) => `$${index + 1}`).join(', ');
      query += ` WHERE category IN (${placeholders})`;
      args.push(...checked);
    }
    // Add price range filter if radio array has exactly one value
    if (radio && radio.length === 2) {
      const a = args.length + 1;
      const b = args.length + 2;
      if (args.length === 0) {
        query += ' WHERE';
      } else {
        query += ' AND';
      }
      query += ` price >= $${a} AND price <= $${b}`;
      args.push(Number(radio[0]), Number(radio[1])); // Ensure price range values are numbers
    }

    console.log(query, args);

    const { rows } = await pool.query(query, args);
    console.log(rows, "result");

    res.status(200).send({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error('Error while filtering products:', error);
    res.status(400).send({
      success: false,
      message: 'Error while filtering products',
      error,
    });
  }
};



const productCountController = async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS total FROM products');
    const total = result.rows[0].total;
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? parseInt(req.params.page, 10) : 1;
    const offset = (page - 1) * perPage;

    const query = `
      SELECT id, name, description, price, category, quantity, shipping, created_at, updated_at
      FROM products
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await pool.query(query, [perPage, offset]);

    res.status(200).send({
      success: true,
      products: result.rows,
    });
  } catch (error) {
    console.error('Error in per page ctrl:', error);
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error,
    });
  }
};

const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const query = `
      SELECT * FROM products
      WHERE name ILIKE $1
      OR description ILIKE $1
    `;
    const values = [`%${keyword}%`];
    
    const { rows } = await pool.query(query, values);
    
    res.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error('Error in Search Product API:', error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};  

const realtedProductController = async (req, res) => {
  try {
    const { pid,cid } = req.params; 
    const query = `
      SELECT * FROM products WHERE category = $1 AND id != $2 LIMIT 3`;

    const values = [cid,pid];
console.log(query);
    const { rows  } = await pool.query(query, values);

    res.status(200).json({
      success: true,
      products:rows,
    });
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching related products',
      error,
    });
  }
};

const productCategoryController=async(req,res)=>{
  try{
    const {slug}=req.params;
        const {rows}=await pool.query(`SELECT * FROM categories WHERE slug=$1`,[slug]);
        
        const {rows:products}=await pool.query(`SELECT * FROM products WHERE category=$1`,[rows[0].id]);
        res.status(200).send({
          success:true,
          category:rows.name,
          products
        })
  }
  catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error,
    });
  }
}
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


//payment
// const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//      async function (error, result) {
//         if (result) {
//           // const order = new orderModel({
//           //   products: cart,
//           //   payment: result,
//           //   buyer: req.user._id,
//           // }).save();

//           const {rows}= await pool.query(`
//           INSERT INTO orders (products, payment, buyer, status)
//           VALUES ($1, $2, $3, 'Not Process')
//           RETURNING id;
//         `,[])
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };




const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // Perform transaction using Braintree
    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (error, result) => {
        if (result) {
          try {
            // Insert order into orders table within a single transaction
            const insertOrderQuery = `
              INSERT INTO orders (products, payment, buyer, status, created_at, updated_at)
              VALUES ($1, $2, $3, $4, NOW(), NOW())
              RETURNING id;
            `;

            const insertOrderValues = [
              JSON.stringify(cart), // Assuming cart contains all necessary product information
              JSON.stringify(result), // Assuming result contains payment details
              req.user.email, // Assuming req.user contains buyer email
              'Not Process' // Default status
            ];

            // Execute the INSERT INTO query using pool.query
            await pool.query(insertOrderQuery, insertOrderValues);

            // Send response indicating success
            res.json({ ok: true });
          } catch (err) {
            // Handle errors
            console.error(err);
            res.status(500).send(err);
          }
        } else {
          // Handle transaction failure
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    // Handle overall error
    console.error(error);
    res.status(500).send(error);
  }
};


const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { rows } = await pool.query(`UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status`, [status, orderId]);

    // if (rows.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: `Order with ID ${orderId} not found.`,
    //   });
    // }

    // Send JSON response with updated order data
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while updating order",
      error: error.message, // Include error message for debugging
    });
  }
};

module.exports = {orderStatusController,brainTreePaymentController,braintreeTokenController,productCategoryController,realtedProductController,searchProductController,productListController,productCountController,productFiltersController,createProduct, getProductController, getSingleProductController, productPhotoController,deleteProductController, updateProductController,
};
