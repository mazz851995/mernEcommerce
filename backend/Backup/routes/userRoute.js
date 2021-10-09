const express = require("express");
const router = express.Router();
const { registeruser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticated, authorizedRoles } = require("../middleware/auth");

router.route("/register").post(registeruser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword)

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticated,getUserDetails);

router.route("/password/update").put(isAuthenticated, updatePassword);

router.route("/me/update").put(isAuthenticated, updateProfile);

// Admin routes
router.route("/admin/users").get(isAuthenticated, authorizedRoles("admin"), getAllUsers);

router.route("/admin/user/:id")
.get(isAuthenticated, authorizedRoles("admin"), getSingleUser)
.put(isAuthenticated, authorizedRoles("admin"), updateUserRole)
.delete(isAuthenticated, authorizedRoles("admin"), deleteUser)


module.exports = router

