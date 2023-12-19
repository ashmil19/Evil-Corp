require('dotenv').config()
const { Queue } = require('bullmq'); 

const teacherModel = require("../../models/userModel");
const { imageUpload } = require("../../utils/uploadImage");
const courseModel = require("../../models/courseModel");
const categoryModel = require("../../models/categoryModel");
const { uploadVideo } = require("../../utils/videoUpload");
const chapterModel = require("../../models/chapterModel");
const { Jobs } = require('../../utils/jobs');

const redisOptions = { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT };

// queue setup
const queues = {
  testQueue: new Queue('testQueue', {
      connection: redisOptions,
  })
};

// utilities
const addJobToTestQueue = (job) => queues.testQueue.add(job.type, job);


const getTeacher = async (req, res) => {
  try {
    const userId = req.params.id;
    const teacherData = await teacherModel.findOne({ _id: userId });
    res.status(200).json({ teacher: teacherData });
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
    const { title, category, description } = req.body;
    const price = Number(req.body.price);
    const coverImage = await imageUpload(image);

    const newCourse = courseModel({
      title,
      category,
      description,
      price,
      coverImage,
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

const getAllCourse = async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.status(200).json({ courses });
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
      .populate("chapters");
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
    const { index, title, courseId } = req.body;
    const existedChapter = await courseModel
      .findById(courseId)
      .populate("chapters");
    for (let chapter of existedChapter.chapters) {
      if (chapter.index == index) {
        res.status(400).json({ message: "Index already existed" });
        return;
      }
    }
    const video = await uploadVideo(req.files.chapterVideo);
    const newChapter = new chapterModel({
      index,
      title,
      video,
    });
    const Chapter = await newChapter.save();
    await courseModel.findByIdAndUpdate(courseId, {
      $push: { chapters: Chapter._id },
    });
    res.status(200).json({ message: "Chapter uploaded" });
  } catch (error) {
    console.log(error);
  }
};

const editChapter = async (req, res)=>{
    try {
        const chapterId = req.params.id;
        const {title} = req.body;

        await chapterModel.findByIdAndUpdate(chapterId, {
            $set: {
                title,
            }
        })

        res.status(200).json({ message: "Chapter Details edited" });

    } catch (error) {
        console.log(error);
    }
}

const uploadChapterVideo = async (req, res)=>{
    try {
        const chapterId = req.params.id;
        const video = await uploadVideo(req.files.chapterVideo);
        await chapterModel.findByIdAndUpdate(chapterId,{
            $set: {video}
        })
        res.status(200).json({ message: "Chapter video edited" });
    } catch (error) {
        console.log(error);
    }
}

const getChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await chapterModel.findById(chapterId);
    res.status(200).json({ chapter });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getTeacher,
  uploadProfileImage,
  uploadCourse,
  editCourse,
  getAllCourse,
  getCourse,
  getAllCategory,
  uploadChapter,
  getChapter,
  changeCourseImage,
  editChapter,
  uploadChapterVideo
};
