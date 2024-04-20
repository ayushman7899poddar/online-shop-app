const express = require("express");
const formidable = require("express-formidable");

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const {createProductController,getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, realtedProductController, productCategoryController, braintreeTokenController, braintreePaymentController} = require("../controllers/productController");

const router = express.Router();

//create products:
router.post("/create-product", requireSignIn,isAdmin, formidable(),createProductController);

//get all poducts:
router.get("/get-product",getProductController);

//get single products:
router.get("/get-product/:slug", getSingleProductController);

//get photo of products:
router.get("/product-photo/:pid",productPhotoController);

//delete product :
router.delete("/delete-product/:pid",deleteProductController);

//update product:
router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(), updateProductController);

//product filters:
router.post("/product-filters", productFiltersController);

//product count:
router.get("/product-count",productCountController)

//product per page:
router.get("/product-list/:page", productListController);

//search product:
router.get("/search/:keyword",searchProductController );

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);


        //payment routes:
//1. token:
router.get("/braintree/token",braintreeTokenController);

//2. Payment:
router.post("/braintree/payment", requireSignIn, braintreePaymentController)

module.exports = router;