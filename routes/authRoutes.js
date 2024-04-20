const express = require("express");

const {registerController,loginController, forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} = require("../controllers/authController");

const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware");

const router = express.Router();

//REGISTER || POST:
router.post("/register",registerController);

//LOGIN || POST:
router.post("/login",loginController);

//FORGOT PASSWORD || POST:
router.post("/forgot-password", forgotPasswordController);

//TEST ROUTES || GET:
// router.get("/test",requireSignIn);

//protected user route auth:
router.get("/user-auth", requireSignIn, (req,res) => {
    res.status(200).send({ ok: true});
});

//protected admin route auth:
router.get("/admin-auth", requireSignIn,isAdmin, (req,res) => {
    res.status(200).send({ ok : true});
});

//update the Profile:
router.put("/profile",requireSignIn,updateProfileController);


//orders:
router.get("/orders",requireSignIn,getOrdersController);

//all orders:
router.get("/all-orders", requireSignIn, isAdmin,getAllOrdersController);

//order status update:
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);


module.exports = router;