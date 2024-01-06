const router = require("express").Router();

const teacherController = require("../controller/teacher/teacherController");

router.get("/profile/:id", teacherController.getTeacher);
router.patch("/profile/:id", teacherController.editTeacher);
router.post("/uploadImage", teacherController.uploadProfileImage);
router.post("/course", teacherController.uploadCourse);
router.put("/course/:id", teacherController.editCourse);
router.get("/course", teacherController.getAllCourse);
router.get("/course/:id", teacherController.getCourse);
router.put("/courseImage/:id", teacherController.changeCourseImage);
router.put("/courseDemoVideo/:id", teacherController.changeCourseDemoVideo);
router.get("/category", teacherController.getAllCategory);
router.post("/uploadChapter", teacherController.uploadChapter);
router.get("/chapter/:id", teacherController.getChapter);
router.put("/chapter/:id", teacherController.editChapter);
router.patch("/chapterVideo/:id", teacherController.uploadChapterVideo);
router.put("/changeIndex/:courseId", teacherController.changeChapterIndex);

module.exports = router;
