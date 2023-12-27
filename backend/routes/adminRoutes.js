const router = require("express").Router();

const adminController = require("../controller/admin/adminController");
const categoryController = require("../controller/admin/categoryController");

router.get("/students", adminController.getStudents);
router.patch("/updateAccess/:id", adminController.updateAccess);
router.post("/category", categoryController.createCategory);
router.get("/category", categoryController.getAllCategory);
router.post("/changeImage", categoryController.changeCategoryImage);
router.put("/changeName/:id", categoryController.editCategoryName);

module.exports = router;
