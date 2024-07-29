const express=require('express');
const registerController = require('../controllers/authController');
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware');
const router=express.Router();
router.post('/register',registerController.registerController);
router.post('/login',registerController.loginController);
router.post('/test',requireSignIn,isAdmin,registerController.testController);
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});
router.put("/profile", requireSignIn,registerController.updateProfileController);
router.get("/orders", requireSignIn,registerController.getOrdersController);
router.get("/all-orders", requireSignIn,registerController.getAllOrdersController);
module.exports=router;