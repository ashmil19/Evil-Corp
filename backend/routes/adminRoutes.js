const router = require("express").Router();

const adminController = require('../controller/admin/adminController')

router.get("/students",adminController.getStudents);
router.patch("/updateAccess/:id",adminController.updateAccess);

module.exports = router