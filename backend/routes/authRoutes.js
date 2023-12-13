const router = require("express").Router();

const authController = require("../controller/auth/authController");

router.post("/signup", authController.createUser);
router.post("/login", authController.handleLogin);
router.get("/refresh", authController.handleRefreshToken);
router.get("/logout", authController.handleLogout);

module.exports = router;
