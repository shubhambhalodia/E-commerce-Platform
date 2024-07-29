const pool=require('../config/db');
const {hashPassword,comparePassword}=require('../helpers/authHelper');
const jwt=require('jsonwebtoken');
exports.registerController=async(req,res)=>{
    try {
        const { name, email, password, phone, address , role} = req.body;
        //validations
        if (!name) {
          return res.send({ error: "Name is Required" });
        }
        if (!email) {
          return res.send({ message: "Email is Required" });
        }
        if (!password) {
          return res.send({ message: "Password is Required" });
        }
        if (!phone) {
          return res.send({ message: "Phone no is Required" });
        }
        if (!address) {
          return res.send({ message: "Address is Required" });
        }
        if (!role) {
          return res.send({ message: "role is Required" });
        }
        //check user
        const { rows:exisitingUser, rowCount} = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
        
        //exisiting user
        if (exisitingUser && rowCount > 0) {
          return res.status(400).send({
            success: false,
            message: "Already Register please login",
          });
        }
        //register user
        const value = await hashPassword(password);
        //save
        const user = await pool.query("INSERT INTO users (name,email,password,phone,address,role) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [name,email,value,phone,address,role])
    
        res.status(201).send({
          success: true,
          message: "User Register Successfully",
          user:user.rows[0],
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Errro in Registeration",
          error,
        });
      }
}

exports.loginController=async(req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      res.status(404).send({
        success: false,
        messade: "Both email and password are required"
      })
    }
    const { rows:exisitingUser, rowCount} = await pool.query('SELECT * FROM users WHERE email=$1',[email]);
    if(!exisitingUser[0]){
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    console.log(exisitingUser[0].password+"passssssssss");
    hashPass=exisitingUser[0].password
    const match = await comparePassword(password,hashPass);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const {name,phone,address,role}=exisitingUser[0];
    const token=await jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn: "7d",});
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name,email,password,phone,address,role
      },
      token,
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in login",
      error,
    });
  }
}

exports.testController=async(req,res)=>{
  try{
    console.log("TestController");
  }
  catch(err){

  }
}

exports.updateProfileController = async (req, res) => {
  try {
    let { name, email, password, address, phone } = req.body;
    let {rows:user} = await pool.query("SELECT * FROM users WHERE email=$1",[email]);
    //password
    user=user[0];
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    let hashedPassword = await hashPassword(password);
    // name= name || user.name;
    // hashedPassword= hashedPassword || user.password;
    // phone= phone || user.phone;
    // address= address || user.address;
    const updateUserQuery = `
      UPDATE users
      SET name = $1, email = $2, password = $3, address = $4, phone = $5
      WHERE email = $6
      RETURNING *;
    `;
    const values = [name, email, hashedPassword, address, phone, email];

    const { rows: updatedUser } = await pool.query(updateUserQuery, values);
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
// exports.getAllOrdersController = async (req, res) => {
//   try {
//     const orders = await orderModel
//       .find({})
//       .populate("products", "-photo")
//       .populate("buyer", "name")
//       .sort({ createdAt: "-1" });
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error WHile Geting Orders",
//       error,
//     });
//   }
// };

exports.getOrdersController = async (req, res) => {
  try {
    const ordersQuery = `
      SELECT o.id, o.products, o.payment, u.name AS buyer_name, o.status, o.created_at
      FROM orders o
      LEFT JOIN users u ON o.buyer = u.email
      ORDER BY o.created_at DESC;
    `;

    // Execute the query using pool.query
    const { rows } = await pool.query(ordersQuery);

    // Send JSON response with orders data
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error: error.message, // Include error message for debugging
    });
  }
};


exports.getAllOrdersController = async (req, res) => {
  try {
    // Query to fetch orders with product details and buyer name
    const ordersQuery = `
      SELECT 
        o.id AS order_id, 
        o.products, 
        o.payment, 
        o.buyer AS buyer_email, 
        o.status, 
        o.created_at AS created_at,
        u.name AS buyer_name
      FROM orders o
      LEFT JOIN users u ON o.buyer = u.email
      ORDER BY o.created_at DESC;
    `;

    // Execute the query using pool.query
    const { rows } = await pool.query(ordersQuery);
    
    // Send JSON response with orders data
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error: error.message, // Include error message for debugging
    });
  }
};


//order status
// exports.orderStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const orders = await orderModel.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error While Updateing Order",
//       error,
//     });
//   }
// };