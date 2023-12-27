const router = require("express").Router();

const authController = require("../controller/auth/authController");

router.post("/signup", authController.createUser);
router.post("/login", authController.handleLogin);
router.post("/login/google", authController.handleGoogleLogin);
router.get("/refresh", authController.handleRefreshToken);
router.post("/otpVerify", authController.verifyOtp);
router.get("/otpResend", authController.resendOtp);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/changePassword", authController.changePassword);
router.get("/successPayment", authController.handleSuccessPayment);
router.get("/logout", authController.handleLogout);

module.exports = router;
