const router = require("express").Router();

const userController = require("../controller/user/userController");

router.get("/profile", userController.getUser);
router.patch("/profile/:id", userController.editUser);
router.post("/uploadImage", userController.uploadProfileImage);
router.get("/course", userController.getAllCourses);
router.get("/course/:id",userController.getCourse);
router.post("/checkPassword", userController.checkPassword);
router.post("/changePassword", userController.changePassword);
router.post("/buyCourse", userController.handleMakePayment)
router.get("/myCourse", userController.getMyCourse)

module.exports = router;
