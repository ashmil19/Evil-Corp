const bcrypt = require("bcrypt")

const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const { imageUpload } = require("../../utils/uploadImage");
const hash = require('../../utils/toHash');

const getUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const userData = await userModel.findOne({ _id: userId });
    res.status(200).json({ user: userData });
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname } = req.body;
    console.log(id);
    console.log(fullname);
    const existedUser = await userModel.findById(id);
    if (!existedUser) {
      res.status(400).json({ message: "user not found" });
      return;
    }

    existedUser.fullname = fullname;
    existedUser.save();

    res.status(200).json({ message: "User Details Updated" });
  } catch (error) {
    console.log(error);
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.body;
    const image = req.files?.image;
    if (!image) {
      res.status(400).json({ error: true });
      return;
    }
    const profileImage = await imageUpload(image);
    await userModel.findByIdAndUpdate(id, { profileImage });
    res.status(200).json({ message: "image uploaded" });
  } catch (error) {
    console.log(error);
  }
};

const checkPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    const userData = await userModel.findById(userId);
    const passMatch = await bcrypt.compare(password, userData.password);

    if (!passMatch) {
      res.status(400).json({ message: "The Password is Wrong" });
      return;
    }

    res.status(200).json({ message: "The Password is Correct" });

  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res)=>{
  try {
    const {password, userId} = req.body;
    const hashedPassword = await hash(password);
    await userModel.findByIdAndUpdate(userId,{$set: {password: hashedPassword}});
    res.status(200).json({message: "Password updated"});
  } catch (error) {
    console.log(error);
  }
}

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUser,
  uploadProfileImage,
  editUser,
  getAllCourses,
  checkPassword,
  changePassword,
};
