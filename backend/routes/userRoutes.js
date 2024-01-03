const router = require("express").Router();

const userController = require("../controller/user/userController");
const blogController = require("../controller/user/blogController")

router.get("/profile", userController.getUser);
router.patch("/profile/:id", userController.editUser);
router.post("/uploadImage", userController.uploadProfileImage);
router.get("/course", userController.getAllCourses);
router.get("/course/:id",userController.getCourse);
router.post("/checkPassword", userController.checkPassword);
router.post("/changePassword", userController.changePassword);
router.post("/buyCourse", userController.handleMakePayment)
router.get("/myCourse", userController.getMyCourse)
router.post("/myBlog", blogController.addBlog)
router.get("/myBlog", blogController.getAllMyBlogs)
router.put("/myBlog/:id", blogController.editBlog)
router.delete("/myBlog/:id", blogController.deleteBlog)
router.put("/myBlogImage/:id", blogController.changeBlogImage)
router.get("/blogs", blogController.getAllBlogs)
router.get("/blog/:id", blogController.getBlog)
router.post("/blogLike", blogController.handleLike)
router.post("/blogReport", blogController.handleReport)
router.post("/blogComment", blogController.handleComment)
router.post("/courseReview", userController.handleReview)

module.exports = router;
