const bcrypt = require("bcrypt");
const stripe = require("stripe")(
  "sk_test_51ORywXSGSYXlOuXjmEXnfwICawAhfAi5SVINBy7erevWFi8gSnfVxq7KkKr7QoyeXUZi0RCn1SQ2WLjQbm1KlClL005FM2WgFC"
);

const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const { imageUpload } = require("../../utils/uploadImage");
const hash = require("../../utils/toHash");

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

const changePassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    const hashedPassword = await hash(password);
    await userModel.findByIdAndUpdate(userId, {
      $set: { password: hashedPassword },
    });
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.log(error);
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.find().populate("category");
    res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
  }
};

const getCourse = async (req, res) => {
  try {
    console.log(req.params);
    const courseId = req.params.id;
    const course = await courseModel
      .findOne({ _id: courseId })
      .populate("category")
      .populate({
        path: "chapters",
      });
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
  }
};

const handleMakePayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { courseId } = req.body;

    const course = await courseModel.findById(courseId);
    console.log(typeof course.price);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
              images: [course.coverImage.url],
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/successPayment?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id}&userId=${userId}`,
      cancel_url: "http://localhost:5173/course",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log(error);
  }
};

const getMyCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await courseModel.find({ users: userId });
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
  getCourse,
  checkPassword,
  changePassword,
  handleMakePayment,
  getMyCourse,
};
