const mongoose = require("mongoose");

const { imageUpload } = require("../../utils/uploadImage");
const blogModel = require("../../models/blogModel");
const blogCommentModel = require("../../models/blogComment");
const reportModel = require("../../models/reportModel");

const addBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description } = req.body;
    const image = req.files.coverImage;
g
    const coverImage = await imageUpload(image);
    const user = new mongoose.Types.ObjectId(userId);

    const newBlog = new blogModel({
      title,
      description,
      coverImage,
      user,
    });

    newBlog.save();

    res.status(200).json({ message: "blog created" });
  } catch (error) {
    console.log(error);
  }
};

const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, description } = req.body;

    const blog = await blogModel.findById(blogId);

    if (!blog) {
      res.status(404).json({ message: "blog not found" });
      return;
    }

    blog.title = title;
    blog.description = description;
    await blog.save();

    res.status(200).json({ message: "blog is Edited" });
  } catch (error) {
    console.log(error);
  }
};

const changeBlogImage = async (req, res) => {
  try {
    const blogId = req.params.id;
    const image = req.files?.image;
    if (!image) {
      res.status(400).json({ error: true });
      return;
    }

    const coverImage = await imageUpload(image);
    await blogModel.findByIdAndUpdate(blogId, { coverImage });
    console.log("suces");
    res.status(200).json({ message: "image Changed" });
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel.findById(blogId);

    if (!blog) {
      res.status(404).json({ message: "blog not found" });
      return;
    }

    await blogModel.findByIdAndDelete(blogId);
    res.status(200).json({ message: "blog is Deleted" });
  } catch (error) {
    console.log(error);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 3;
    let page = +req.query.page || 1;
    let search = "";
    if (req.query.search !== 'undefined') {
      console.log("jai");
      search = req.query.search;
      page = 1;
    }

    const query = {
      isAccess: true,
      title: { $regex: new RegExp(`^${search}`, "i") },
    };

    const allBlogs = await blogModel.find(query).populate("user");

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalBlogs = allBlogs.length;
    results.pageCount = Math.ceil(allBlogs.length / ITEMS_PER_PAGE);

    if (lastIndex < allBlogs.length) {
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
    results.blogs = allBlogs.slice(startIndex, lastIndex);


    res.status(200).json({ results });
  } catch (error) {
    console.log(error);
  }
};

const getBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const blogId = req.params.id;
    const user = new mongoose.Types.ObjectId(userId);
    let blog = await blogModel
      .findOne({ _id: blogId, isAccess: true })
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        options: {
          sort: { createdAt: -1 },
        },
      })
      .populate("reports");

    if (!blog) {
      res.status(404).json({ message: "blog not found" });
      return;
    }

    const liked = !!(await blogModel.findOne({ _id: blogId, likes: userId }));
    const reported = !!(await reportModel.findOne({blog: blogId,user}));

    const likes = blog.likes.length;
    const {
      _doc: { ...rest },
      likesCount = likes,
      isLiked = liked,
      isReported = reported,
    } = blog;
    blog = { ...rest, likesCount, isLiked, isReported };

    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
  }
};

const getAllMyBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    const myBlogs = await blogModel.find({ user: userId });
    res.status(200).json({ myBlogs });
  } catch (error) {
    console.log(error);
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const blogId = req.body.blogId;
    const user = new mongoose.Types.ObjectId(userId);
    const isLiked = await blogModel.findOne({ _id: blogId, likes: user });

    if (isLiked) {
      await blogModel.findByIdAndUpdate(blogId, { $pull: { likes: user } });
      res.status(200).json({ message: "Blog Unliked" });
      return;
    }

    await blogModel.findByIdAndUpdate(blogId, { $push: { likes: user } });
    res.status(200).json({ message: "Blog Liked" });
  } catch (error) {
    console.log(error);
  }
};

const handleReport = async (req, res) => {
  try {
    const userId = req.userId;
    const {blogId, reason} = req.body;
    const user = new mongoose.Types.ObjectId(userId);
    const blog = new mongoose.Types.ObjectId(blogId);
    // const minimumReports = 10;

    const BlogReport = new reportModel({
      blog,
      user,
      reason,
    })

    const createdBlogReport = await BlogReport.save();

    const existedBlog = await blogModel.findById(blog);

    if(!existedBlog){
      return res.status(404).json({message: "blog not found"});
    }

    existedBlog.reports.push(createdBlogReport._id)
    await existedBlog.save()

    res.status(200).json({ message: "Blog Reported" });

    // const updatedBlog = await blogModel.findByIdAndUpdate(
    //   blogId,
    //   { $push: { reports: user } },
    //   { new: true }
    // );

    // const reportsCount = updatedBlog.reports.length;
    // // const reportsCount = 12
    // const LikesCount = updatedBlog.likes.length;

    // if (
    //   reportsCount > Math.floor(LikesCount / 2) &&
    //   reportsCount > minimumReports
    // ) {
    //   updatedBlog.isAccess = false;
    //   await updatedBlog.save();
    // }

    // res.status(200).json({ message: "Blog Reported" });
  } catch (error) {
    console.log(error);
  }
};

const handleComment = async (req, res) => {
  try {
    const userId = req.userId;
    const user = new mongoose.Types.ObjectId(userId);
    const { blogId, comment } = req.body;

    const newComment = blogCommentModel({
      user,
      content: comment,
    });

    const newAddedComment = await newComment.save();
    await blogModel.findByIdAndUpdate(blogId, {
      $push: { comments: newAddedComment._id },
    });
    res.status(200).json({ message: "comment added" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addBlog,
  getAllMyBlogs,
  editBlog,
  deleteBlog,
  changeBlogImage,
  getAllBlogs,
  getBlog,
  handleLike,
  handleReport,
  handleComment,
};
