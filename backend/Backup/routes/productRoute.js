const express = require("express")
const { getAllProducts, createProduct, updateProducts, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReviews, getAdminProducts } = require("../controllers/productController");
const { isAuthenticated, authorizedRoles } = require("../middleware/auth");
const router = express.Router();




router.route("/products").get(getAllProducts);

router.route("/admin/products/new").post(isAuthenticated, authorizedRoles("admin"), createProduct);

router.route("/admin/products/:id")
    .put(isAuthenticated, authorizedRoles("admin"), updateProducts)
    .delete(isAuthenticated, authorizedRoles("admin"), deleteProduct)

router.route("/products/:id").get(getProductDetails);

router.route("/review").put(isAuthenticated, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticated, deleteReviews);

router.route("/admin/products").get(isAuthenticated, authorizedRoles("admin"), getAdminProducts);




module.exports = router