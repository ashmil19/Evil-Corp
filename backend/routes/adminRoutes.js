const router = require("express").Router();

const adminController = require("../controller/admin/adminController");
const categoryController = require("../controller/admin/categoryController");

router.get("/students", adminController.getStudents);
router.get("/teachers", adminController.getTeachers);
router.patch("/updateAccess/:id", adminController.updateAccess);
router.post("/teacherApprove", adminController.handleTeacherApprove);
router.post("/teacherReject", adminController.handleTeacherReject);
router.get("/reportedBlogs", adminController.getReportedBlogs);
router.patch("/reportedBlogs/:id", adminController.changeBlogStatus);
router.post("/category", categoryController.createCategory);
router.get("/category", categoryController.getAllCategory);
router.post("/changeImage", categoryController.changeCategoryImage);
router.put("/changeName/:id", categoryController.editCategoryName);
router.get("/dashboard", adminController.getDashboardData);
router.get("/graph", adminController.getGraphData);
router.get("/paymentData", adminController.getPayments);
router.post("/payment", adminController.handleTeacherPay);

module.exports = router;
