const router = require("express").Router();

const userController = require("../controller/user/userController");

router.get("/profile", userController.getUser);
router.patch("/profile/:id", userController.editUser);
router.post("/uploadImage", userController.uploadProfileImage);
router.get("/course", userController.getAllCourses);

module.exports = router;