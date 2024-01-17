const blogModel = require("../../models/blogModel");
const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const paymentModel = require("../../models/paymentModel");
const { sendRejectMail } = require("../../utils/sendRejectMail");

const getStudents = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 6;
    let page = +req.query.page || 1;
    let search = "";
    if (req.query.search !== "undefined") {
      search = req.query.search;
      page = 1;
    }

    const query = {
      role: 2000,
      fullname: { $regex: new RegExp(`^${search}`, "i") },
    };

    const Allstudents = await userModel.find(query);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalCourse = Allstudents.length;
    results.pageCount = Math.ceil(Allstudents.length / ITEMS_PER_PAGE);

    if (lastIndex < Allstudents.length) {
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
    results.students = Allstudents.slice(startIndex, lastIndex);

    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
  }
};

const getTeachers = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 6;
    let page = +req.query.page || 1;
    let search = "";
    if (req.query.search !== "undefined") {
      search = req.query.search;
      page = 1;
    }

    const query = {
      role: 3000,
      fullname: { $regex: new RegExp(`^${search}`, "i") },
    };

    const AllTeachers = await userModel.find(query).sort({ createdAt: -1 });

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalTeachers = AllTeachers.length;
    results.pageCount = Math.ceil(AllTeachers.length / ITEMS_PER_PAGE);

    if (lastIndex < AllTeachers.length) {
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
    results.teachers = AllTeachers.slice(startIndex, lastIndex);

    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
  }
};

const updateAccess = async (req, res) => {
  try {
    const id = req.params.id;
    const { isAccess } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: { isAccess: !isAccess } },
      { new: true }
    );
    res.status(200).json({ message: "access updated", updatedUser });
  } catch (error) {
    console.log(error);
  }
};

const handleTeacherApprove = async (req, res) => {
  try {
    const { teacherId } = req.body;
    await userModel.findByIdAndUpdate(teacherId, { $set: { isVerify: true } });
    res.status(200).json({ message: "Teacher Approved" });
  } catch (error) {
    console.log(error);
  }
};

const handleTeacherReject = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const user = await userModel.findById(teacherId);
    await sendRejectMail({ fullname: user.fullname, email: user.email });
    await userModel.findByIdAndDelete(teacherId);
    res.status(200).json({ message: "Teacher is Rejected" });
  } catch (error) {
    console.log(error);
  }
};

const getReportedBlogs = async (req, res) => {
  try {
    const blogData = await blogModel.aggregate([
      {
        $match: {
          $expr: {
            $gte: [{ $size: "$reports" }, 10],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $addFields: {
          user: {
            $mergeObjects: [
              { $arrayElemAt: ["$userDetails", 0] },
              { _id: "$user" },
            ],
          },
        },
      },
      {
        $unset: "userDetails",
      },
    ]);

    res.status(200).json({ blogs: blogData });
  } catch (error) {
    console.log(error);
  }
};

const changeBlogStatus = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { isAccess } = req.body;

    const existedBlog = await blogModel.findById(blogId);

    if (!existedBlog) {
      return res.status(404).json({ message: "blog not found" });
    }

    existedBlog.isAccess = !isAccess;
    await existedBlog.save();

    res.status(200).json({ message: "blog status updated" });
  } catch (error) {
    console.log(error);
  }
};

const getPayments = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 4;
    let page = +req.query.page || 1;

    const AllPayments = await paymentModel
      .find()
      .populate("course_id")
      .populate("teacher_id", "-password");

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalPayments = AllPayments.length;
    results.pageCount = Math.ceil(AllPayments.length / ITEMS_PER_PAGE);

    if (lastIndex < AllPayments.length) {
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
    results.payments = AllPayments.slice(startIndex, lastIndex);

    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
  }
};

const getDashboardData = async (req, res) => {
  try {
    const studentsData = await userModel.find({ role: 2000 });
    const teachersData = await userModel.find({ role: 3000 });
    const allCourses = await courseModel.find({ isPublished: true });
    const paymentData = await paymentModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const data = {
      students: studentsData.length,
      teachers: teachersData.length,
      allCourses: allCourses.length,
      totalAmount: paymentData[0].total,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const handleTeacherPay = async (req, res) => {
  try {
    const { paymentId } = req.body;
    const existPayment = await paymentModel.findById(paymentId);

    console.log(existPayment);

    if (!existPayment) {
      return res.status(404).json({ message: "payment not found" });
    }

    if (existPayment.isTeacherPay) {
      return res.status(400).json({ message: "already done payment" });
    }

    existPayment.isTeacherPay = true;
    await existPayment.save();

    res.status(200).json({ message: "Payment Success!" });
  } catch (error) {
    console.log(error);
  }
};

const getGraphData = async (req, res) => {
  try {
    const student = await userModel.aggregate([
      { $match: { role: 2000 } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          date: { $first: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          date: 1,
          count: 1,
        },
      },
    ]);

    const teacher = await userModel.aggregate([
      { $match: { role: 3000 } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          date: { $first: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          date: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json({ student, teacher });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getStudents,
  updateAccess,
  handleTeacherApprove,
  handleTeacherReject,
  getReportedBlogs,
  changeBlogStatus,
  getDashboardData,
  getPayments,
  handleTeacherPay,
  getTeachers,
  getGraphData,
};
