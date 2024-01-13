require("dotenv").config();
const { Queue } = require("bullmq");
const mongoose = require("mongoose");

const teacherModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const categoryModel = require("../../models/categoryModel");
const chapterModel = require("../../models/chapterModel");
const chatModel = require("../../models/ChatModel");
const { imageUpload } = require("../../utils/uploadImage");
const { uploadVideo } = require("../../utils/videoUpload");
const { Jobs } = require("../../utils/jobs");
const paymentModel = require("../../models/paymentModel");

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

// queue setup
const queues = {
  testQueue: new Queue("testQueue", {
    connection: redisOptions,
  }),
};

// utilities
const addJobToTestQueue = (job) => queues.testQueue.add(job.type, job);
// const addJobToTestQueue = (job) => {
//   return new Promise((resolve, reject) => {
//     queues.testQueue
//       .add(job.type, job)
//       .then((job) => {
//         job
//         .on('completed', (result) => console.log(result))
//         .on('failed', (error) => reject(error));
//       })
//       .catch(reject);
//   });
// };

const getTeacher = async (req, res) => {
  try {
    const userId = req.params.id;
    const teacherData = await teacherModel.findOne({ _id: userId });
    res.status(200).json({ teacher: teacherData });
  } catch (error) {
    console.log(error);
  }
};

const editTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname } = req.body;
    const existedUser = await teacherModel.findById(id);
    if (!existedUser) {
      res.status(400).json({ message: "Teacher not found" });
      return;
    }

    existedUser.fullname = fullname;
    existedUser.save();

    res.status(200).json({ message: "Teacher Details Updated" });
  } catch (error) {
    console.log(error);
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.body;
    const image = req.files?.image;
    console.log(id);
    console.log(req.files);
    if (!image) {
      res.status(400).json({ error: true });
      return;
    }
    const profileImage = await imageUpload(image);
    await teacherModel.findByIdAndUpdate(id, { profileImage });
    res.status(200).json({ message: "image uploaded" });
  } catch (error) {
    console.log(error);
  }
};

const uploadCourse = async (req, res) => {
  try {
    const image = req.files?.coverImage;
    const video = req.files?.demoVideo;
    const { title, description, otherCategory } = req.body;
    let { category } = req.body;
    const price = Number(req.body.price);
    const coverImage = await imageUpload(image);
    const demoVideo = await uploadVideo(video);

    console.log(req.body);

    if (otherCategory !== "") {
      const existedCategory = await categoryModel.findOne({
        name: { $regex: new RegExp(`^${otherCategory}`, "i") },
      });

      if (existedCategory) {
        return res.status(400).json({ message: "category already existed" });
      }

      const newCategory = new categoryModel({
        name: otherCategory,
      });

      const createdNewCategory = await newCategory.save();

      category = createdNewCategory._id;
    }

    const newCourse = courseModel({
      title,
      category,
      description,
      price,
      coverImage,
      demoVideo,
      teacher: req.userId,
    });

    await newCourse.save();
    res.status(200).json({ message: "Course Added" });
  } catch (error) {
    console.log(error);
  }
};

const editCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, category, description } = req.body;
    const price = Number(req.body.price);

    await courseModel.findByIdAndUpdate(courseId, {
      $set: {
        title,
        category,
        description,
        price,
      },
    });

    res.status(200).json({ message: "Course Details edited" });
  } catch (error) {
    console.log(error);
  }
};

const changeCourseImage = async (req, res) => {
  try {
    const courseId = req.params.id;
    const image = req.files?.image;
    if (!image) {
      res.status(400).json({ error: true });
      return;
    }

    const coverImage = await imageUpload(image);
    await courseModel.findByIdAndUpdate(courseId, { coverImage });
    res.status(200).json({ message: "image uploaded" });
  } catch (error) {
    console.log(error);
  }
};

const changeCourseDemoVideo = async (req, res) => {
  try {
    const courseId = req.params.id;
    const video = req.files.demoVideo;

    const demoVideo = await uploadVideo(video);
    await courseModel.findByIdAndUpdate(courseId, { $set: { demoVideo } });
    res.status(200).json({ message: "Demo video added" });
  } catch (error) {
    console.log(error);
  }
};

const handlePublishCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { isPublished } = req.body;

    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      { isPublished: !isPublished },
      { new: true }
    );
    res.status(200).json({ message: "publish updated", updatedCourse });
  } catch (error) {
    console.log(error);
  }
};

const getAllCourse = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 7;
    let page = +req.query.page || 1;
    let search = "";
    if (req.query.search !== "undefined") {
      search = req.query.search;
      page = 1;
    }

    const query = {
      isPublished: false,
      title: { $regex: new RegExp(`^${search}`, "i") },
    };

    const allCourses = await courseModel.find(query);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalCourses = allCourses.length;
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

const getAllMyCourse = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 8;
    let page = +req.query.page || 1;
    let search = "";
    if (req.query.search !== "undefined") {
      search = req.query.search;
      page = 1;
    }

    const query = {
      isPublished: true,
      title: { $regex: new RegExp(`^${search}`, "i") },
    };

    const allCourses = await courseModel.find(query);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const lastIndex = page * ITEMS_PER_PAGE;

    const results = {};
    results.totalCourses = allCourses.length;
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

const getCourse = async (req, res) => {
  try {
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

const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
  }
};

const uploadChapter = async (req, res) => {
  try {
    const { title, courseId } = req.body;
    const chapterVideo = req.files.chapterVideo;

    // const video = await uploadVideo(chapterVideo);
    // const newChapter = new chapterModel({
    //   index,
    //   title,
    //   video,
    // });
    // const Chapter = await newChapter.save();
    // await courseModel.findByIdAndUpdate(courseId, {
    //   $push: { chapters: Chapter._id },
    // });

    const result = await addJobToTestQueue({
      type: "VideoUpload",
      data: {
        title,
        chapterVideo,
        courseId,
      },
    });

    // if (result === "success") {
    //   res.status(200).json({ message: "Queued successfully" });
    // } else {
    //   console.error(result);
    //   res.status(500).json({ message: "Error queuing the job" });
    // }

    // console.log(result);

    res.status(200).json({ message: "Queued" });
  } catch (error) {
    console.log(error);
  }
};

const editChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const { title } = req.body;

    await chapterModel.findByIdAndUpdate(chapterId, {
      $set: {
        title,
      },
    });

    res.status(200).json({ message: "Chapter Details edited" });
  } catch (error) {
    console.log(error);
  }
};

const uploadChapterVideo = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const video = await uploadVideo(req.files.chapterVideo);
    await chapterModel.findByIdAndUpdate(chapterId, {
      $set: { video },
    });
    res.status(200).json({ message: "Chapter video edited" });
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

const changeChapterIndex = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { activeId, overId } = req.body;

    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }

    const firstIndex = course.chapters.indexOf(activeId);
    const secondIndex = course.chapters.indexOf(overId);

    if (firstIndex < 0 || secondIndex > course.chapters.length) {
      return res.status(404).json({ message: "Chapter not Found" });
    }

    if (secondIndex < 0 || secondIndex > course.chapters.length) {
      return res.status(404).json({ message: "Chapter not Found" });
    }

    const removedElement = course.chapters.splice(firstIndex, 1);
    course.chapters.splice(secondIndex, 0, removedElement);
    await course.save();

    res.status(200).json({ message: "Index Changed" });
  } catch (error) {
    console.log(error);
  }
};

const getDashboardDetails = async (req, res) => {
  try {
    const teacherId = new mongoose.Types.ObjectId(req.userId);
    const studentData = await courseModel.aggregate([
      {
        $match: {
          teacher: teacherId,
        },
      },
      {
        $unwind: "$users",
      },
      {
        $group: {
          _id: "$users",
          count: { $sum: 1 },
        },
      },
    ]);

    const allCourses = await courseModel.find({ teacher: teacherId });
    const publicCourses = await courseModel.find({
      teacher: teacherId,
      isPublished: true,
    });

    const paymentData = await paymentModel.aggregate([
      {
        $match: {
          isTeacherPay: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    console.log(paymentData);

    const data = {
      students: studentData?.length,
      allCourses: allCourses?.length,
      publicCourses: publicCourses?.length,
      totalAmount: paymentData[0]?.total,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
};

const getPayments = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 4;
    let page = +req.query.page || 1;

    const AllPayments = await paymentModel
      .find({ isTeacherPay: true })
      .populate("course_id")
      .populate("user_id", "-password");

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

module.exports = {
  getTeacher,
  editTeacher,
  uploadProfileImage,
  uploadCourse,
  editCourse,
  getAllCourse,
  getAllMyCourse,
  getCourse,
  getAllCategory,
  uploadChapter,
  getChapter,
  changeCourseImage,
  editChapter,
  uploadChapterVideo,
  changeChapterIndex,
  changeCourseDemoVideo,
  handlePublishCourse,
  getDashboardDetails,
  getPayments,
};
