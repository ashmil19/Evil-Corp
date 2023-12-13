const router = require("express").Router();

const teacherController = require('../controller/teacher/teacherController')

router.get("/profile/:id", teacherController.getTeacher);
router.post("/uploadImage", teacherController.uploadProfileImage);
router.post("/course", teacherController.uploadCourse);
router.get("/course",teacherController.getAllCourse);
router.get("/course/:id",teacherController.getCourse);

module.exports = router;