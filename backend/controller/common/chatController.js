const mongoose = require("mongoose");

const ChatModel = require("../../models/ChatModel");
const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const messageModel = require("../../models/messageModel");
const crypto = require("crypto");
const communityModel = require("../../models/communityModel");
const communityMessageModel = require("../../models/communityMessageModel");

const getAllTeachers = async (req, res, next) => {
  try {
    const user = new mongoose.Types.ObjectId(req.userId);
    const teacherIds = await courseModel.distinct("teacher", { users: user });

    let teachers = [];

    for (const id of teacherIds) {
      const teacher = await userModel.findById(id).select("fullname email _id");
      teachers.push(teacher);
    }

    res.status(200).json({ teachers });
  } catch (error) {
    next(error);
  }
};

const listChatStudents = async (req, res, next) => {
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
    next(error);
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
    const { content, type, conversationId, recipientId, userId } = data;

    console.log({data});

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

const allMessages = async (req, res, next) => {
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
    next(error);
  }
};

const getCommunities = async (req, res, next) => {
  try {
    const user = new mongoose.Types.ObjectId(req.userId);
    const communities = await communityModel.find({
      participants: { $in: [user] },
    });
    res.status(200).json({ communities });
  } catch (error) {
    next(error);
  }
};

const getAllCommunityMessages = async (req, res, next) => {
  try {
    const communityId = req.params.id;
    const existingCommunity = await communityModel.findOne({ communityId });
    console.log(existingCommunity);

    if (!existingCommunity) {
      return res.status(200).json({ communityId });
    }

    const messages = await communityMessageModel
      .find({
        community: existingCommunity._id,
      })
      .populate("sender", "fullname email _id");

    res.status(200).json({ existingCommunity, messages, communityId });
  } catch (error) {
    next(error);
  }
};

const sendCommunityMessage = async (data) => {
  try {
    const { content, type, communityId, userId } = data;
    console.log({communityId});
    const existingCommunity = await communityModel.findOne({ communityId });

    const newMessage = new communityMessageModel({
      sender: userId,
      content,
      type,
      community: existingCommunity._id,
    });

    await newMessage.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllTeachers,
  sendMessage,
  allMessages,
  listChatStudents,
  getCommunities,
  getAllCommunityMessages,
  sendCommunityMessage,
};
