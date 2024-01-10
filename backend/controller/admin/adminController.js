const blogModel = require("../../models/blogModel");
const userModel = require("../../models/userModel");

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

const getReportedBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("user", "-password");
    const blogData = await blogModel.aggregate([
      {
        $match: {
          $expr: {
            $gte: [{$size: "$reports"},10]
          }
        }
      },
      {
        $lookup:{
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
              {$arrayElemAt: ["$userDetails",0]},
              {_id: "$user"}
            ]
          }
        }
      },
      {
        $unset: "userDetails",
      }
    ])

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

module.exports = {
  getStudents,
  updateAccess,
  getReportedBlogs,
  changeBlogStatus,
};
