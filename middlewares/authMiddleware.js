const JWT=require('jsonwebtoken');
const pool = require('../config/db');

const jwt = require('jsonwebtoken');

const requireSignIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader+"authHeader");
  if (!authHeader) {
    console.log('Authorization header missing');
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Token missing');
    return res.status(401).json({
      success: false,
      message: 'Token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Invalid token:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error,
    });
  }
};



    const isAdmin = async (req, res, next) => {
    try {
    //   const authHeader = req.headers.authorization;
    //   if (!authHeader) {
    //     console.log('Authorization header missing');
    //     return res.status(401).json({
    //       success: false,
    //       message: 'Authorization header missing',
    //     });
    //   }
    
    //   const token = authHeader.split(' ')[1];
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // let {email} = decoded;
    let email=req.user.email;
      console.log(email);
      const user=await pool.query("SELECT * from users WHERE email=$1",[email]);
      console.log(user.rows[0]+"authhhhhh");
      if (user.rows[0].role !== 'admin') {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
      });
    }
  };
  module.exports={requireSignIn,isAdmin};