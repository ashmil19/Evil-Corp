const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
// const stripe = require("stripe")(
//   "sk_test_51ORywXSGSYXlOuXjmEXnfwICawAhfAi5SVINBy7erevWFi8gSnfVxq7KkKr7QoyeXUZi0RCn1SQ2WLjQbm1KlClL005FM2WgFC"
// );
const stripe = require("stripe")(
  "sk_test_51OISQWSBQLVhDmRfvicXDGw4m7LT3mOeF3DvnEufBcDN6v0z1STvNhlj4IkBgPHE8lDyByVzsPsv6Y8LAjVub57C00d6Xd8CEy"
);

const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const courseReviewModel = require("../../models/courseReviewModel");
const { imageUpload } = require("../../utils/uploadImage");
const hash = require("../../utils/toHash");
const chapterModel = require("../../models/chapterModel");
const categoryModel = require("../../models/categoryModel");

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
    const ITEMS_PER_PAGE = 8;
    let page = +req.query.page || 1;
    const category = req.query.category === "null" ? null : req.query.category;
    const price = Number(req.query.price);
    let search = "";
    if (req.query.search !== "undefined") {
      search = req.query.search;
      page = 1;
    }

    const query = {
      title: { $regex: new RegExp(`^${search}`, "i") },
    };

    if (category) {
      query.category = category;
    }

    const allCourses = await courseModel.find(query).populate("category").sort({price: price});

    //get all categories
    const allCategories = await categoryModel.find();

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalCourse = allCourses.length;
    results.pageCount = Math.ceil(allCourses.length / ITEMS_PER_PAGE);

    if (lastIndex < allCourses.length) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
      };
    }

    results.page = page - 1;
    results.courses = allCourses.slice(startIndex, lastIndex);
    results.allCategories = allCategories;
    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
  }
};

const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courseModel
      .findOne({ _id: courseId })
      .populate("category")
      .populate({
        path: "chapters",
      })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
        },
      });
    res.status(200).json({ course });
  } catch (error) {
    console.log(error);
  }
};

const getChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await chapterModel.findById(chapterId);
    res.status(200).json({ chapter });
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
    // const courses = await courseModel
    //   .find({ users: userId })
    //   .populate("category");

    const ITEMS_PER_PAGE = 6;
    let page = +req.query.page || 1;
    // const search = req.query.search || "";
    // const search = req.query.search !== 'undefined' ? req.query.search : "";
    let search = "";
    if (req.query.search !== "undefined") {
      search = req.query.search;
      page = 1;
    }

    const query = {
      users: userId,
      title: { $regex: new RegExp(`^${search}`, "i") },
    };

    const allCourses = await courseModel.find(query).populate("category");

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalCourse = allCourses.length;
    results.pageCount = Math.ceil(allCourses.length / ITEMS_PER_PAGE);

    if (lastIndex < allCourses.length) {
      results.next = {
        page: page + 1,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
      };
    }

    results.page = page - 1;
    results.courses = allCourses.slice(startIndex, lastIndex);

    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
  }
};

const handleReview = async (req, res) => {
  try {
    const { rating, review, courseId, userId } = req.body;
    const user = new mongoose.Types.ObjectId(userId);
    const newReview = courseReviewModel({
      rating,
      review,
      user,
    });

    const newAddedReview = await newReview.save();
    await courseModel.findByIdAndUpdate(courseId, {
      $push: { reviews: newAddedReview._id },
    });
    res.status(200).json({ message: "review added" });
  } catch (error) {
    console.log(error);
  }
};

const handleEditReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { rating, review } = req.body;

    await courseReviewModel.findByIdAndUpdate(reviewId, { review, rating });
    res.status(200).json({ message: "review updated" });
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
  handleReview,
  handleEditReview,
  getChapter,
};
