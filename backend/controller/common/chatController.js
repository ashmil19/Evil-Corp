const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ChatModel = require("../../models/ChatModel");
const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const messageModel = require("../../models/messageModel");
const crypto = require("crypto");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId not found" });
    }

    console.log(userId);
    console.log(req.userId);

    const isChat = await ChatModel.findOne({
      $and: [
        { participants: { $elemMatch: { $eq: req.userId } } },
        { participants: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("participants", "-password")
      .populate("latestMessage");

    if (isChat) {
      const allMessages = await messageModel
        .find({ chat: isChat._id })
        .populate("sender", "fullname _id email");
      res.status(200).json({ isChat, allMessages });
    } else {
      const chatData = new ChatModel({
        participants: [userId, req.userId],
      });

      const createdChat = await chatData.save();

      const fullChat = await ChatModel.findById(createdChat._id).populate(
        "participants",
        "-password"
      );

      res.status(200).json({ fullChat });
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      participants: { $elemMatch: { $eq: req.userId } },
    })
      .populate("participants", "-password")
      .populate("latestMessage");

    res.status(200).json({ chats });
  } catch (error) {
    console.log(error);
  }
};

const getAllTeachers = async (req, res) => {
  try {
    console.log(req.userId);
    const user = new mongoose.Types.ObjectId(req.userId);
    const teacherIds = await courseModel.distinct("teacher", { users: user });

    let teachers = [];

    for (const id of teacherIds) {
      const teacher = await userModel.findById(id).select("fullname email _id");
      teachers.push(teacher);
    }

    res.status(200).json({ teachers });
  } catch (error) {
    console.log(error);
  }
};

const listChatStudents = async (req, res) => {
  try {
    const teacherId = req.userId;
    const chats = await ChatModel.find({ participants: teacherId });

    let students = [];
    for (const chat of chats) {
      const userId = chat.participants.find((id) => !id.equals(teacherId));
      const student = await userModel.findById(userId);
      students.push(student);
    }

    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
  }
};

function generateUniqueRoomId(senderId, recieverId) {
  const sortedIds = [senderId, recieverId].sort();
  const combineIds = sortedIds.join("");
  const roomId = crypto.createHash("sha1").update(combineIds).digest("hex");
  return roomId;
}

const sendMessage = async (data) => {
  try {
    const { content, type, conversationId, recipientId, token, userId } = data;
    console.log("conversationId", conversationId);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const existingChat = await ChatModel.findOne({ conversationId });

    if (existingChat) {
      const newMessage = new messageModel({
        sender: userId,
        content,
        type,
        chat: existingChat._id,
      });

      const message = await newMessage.save();
      existingChat.latestMessage = message._id;
      await existingChat.save();
      return;
    }

    const newChat = new ChatModel({
      conversationId,
      participants: [userId, recipientId],
    });

    const createdChat = await newChat.save();

    const newMessage = new messageModel({
      sender: userId,
      content,
      type,
      chat: createdChat._id,
    });

    const message = await newMessage.save();
    createdChat.latestMessage = message._id;
    await createdChat.save();
  } catch (error) {
    console.log(error);
  }
};

const allMessages = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const userId = req.userId;

    let conversationId = generateUniqueRoomId(userId, recipientId);

    const existingChat = await ChatModel.findOne({ conversationId });

    if (!existingChat) {
      return res.status(200).json({ conversationId });
    }

    const messages = await messageModel
      .find({ chat: existingChat._id })
      .populate("sender", "fullname email _id");

    res.status(200).json({ existingChat, messages, conversationId });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  getAllTeachers,
  sendMessage,
  allMessages,
  listChatStudents,
};
