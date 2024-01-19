require("dotenv").config();
const { Worker } = require("bullmq");
const { Jobs } = require("./jobs");
const { uploadVideo } = require("./videoUpload");
const chapterModel = require("../models/chapterModel");
const courseModel = require("../models/courseModel");
const mongodb = require("../config/mongo");
var io = require('socket.io-client');


mongodb();

var socket = io("evilcorp.ashmil.shop", {reconnect: true});


const workerHandler = async (job) => {
  switch (job.data.type) {
    case "VideoUpload": {
      try {
        const { title, chapterVideo, courseId } = job.data.data;
        const video = await uploadVideo(chapterVideo);
        const newChapter = new chapterModel({
          title,
          video,
        });
        const Chapter = await newChapter.save();
        await courseModel.findByIdAndUpdate(courseId, {
          $push: { chapters: Chapter._id },
        });
        console.log("success");

        socket.emit("videoUploadSuccess", {
          isVideoUploaded: true,
          courseId
        });
        
        return "success";
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const workerOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

const worker = new Worker("testQueue", workerHandler, workerOptions);

console.log("worker Started");
