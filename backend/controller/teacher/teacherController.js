const teacherModel = require('../../models/userModel');
const { imageUpload } = require('../../utils/uploadImage');
const courseModel = require('../../models/courseModel');

const getTeacher = async (req, res)=>{
    try {
        const userId = req.params.id;
        const teacherData = await teacherModel.findOne({_id: userId})
        res.status(200).json({teacher: teacherData})
        
    } catch (error) {
        console.log(error)
    }
}

const uploadProfileImage = async (req, res)=>{
    try {
        const { id } = req.body
        const image = req.files?.image
        console.log(id);
        console.log(req.files);
        if(!image){
            res.status(400).json({error: true})
            return
        }
        const profileImage = await imageUpload(image)
        await teacherModel.findByIdAndUpdate(id,{profileImage})
        res.status(200).json({ message: "image uploaded"})
    } catch (error) {
        console.log(error);
    }
}

const uploadCourse = async (req, res)=>{
    try {
        const image = req.files?.coverImage;
        const {title, category, description} = req.body
        const price = Number(req.body.price)
        const coverImage = await imageUpload(image);
        
        const newCourse = courseModel({
            title,
            category,
            description,
            price,
            coverImage
        })

        await newCourse.save()
        res.status(200).json({message: "Course Added"});

    } catch (error) {
        console.log(error);
    }
}

const getAllCourse = async (req, res)=>{
    try {
        const courses = await courseModel.find();
        res.status(200).json({courses});
    } catch (error) {
        console.log(error);
    }
}

const getCourse = async (req, res)=>{
    try {
        const courseId = req.params.id;
        const course = await courseModel.findOne({_id: courseId})
        res.status(200).json({course});
    } catch (error) {
        
    }
}

module.exports = {
    getTeacher,
    uploadProfileImage,
    uploadCourse,
    getAllCourse,
    getCourse
}