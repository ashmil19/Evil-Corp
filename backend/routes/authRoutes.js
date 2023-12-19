const router = require("express").Router();

const authController = require("../controller/auth/authController");

router.post("/signup", authController.createUser);
router.post("/login", authController.handleLogin);
router.post("/login/google", authController.handleGoogleLogin);
router.get("/refresh", authController.handleRefreshToken);
router.post("/otpVerify", authController.verifyOtp);
router.post("/otpResend", authController.resendOtp);
router.get("/logout", authController.handleLogout);

module.exports = router;
