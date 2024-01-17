const router = require("express").Router();

const chatController = require("../controller/common/chatController");

// router.get("/chats", chatController.fetchChats);

router.get("/teachers", chatController.getAllTeachers);
router.get("/message/:id", chatController.allMessages);
router.get("/listStudents", chatController.listChatStudents);
router.get("/community", chatController.getCommunities);
router.get("/communityMessages/:id", chatController.getAllCommunityMessages);

module.exports = router;
