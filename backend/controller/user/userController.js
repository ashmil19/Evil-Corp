const userModel = require("../../models/userModel");
const courseModel = require("../../models/courseModel");
const { imageUpload } = require("../../utils/uploadImage");

const getUser = async (req, res)=>{
    try {
    
        const { userId } = req.query; 
        const userData = await userModel.findOne({_id: userId})
        res.status(200).json({user: userData})
        
    } catch (error) {
        console.log(error)
    }
}

const editUser = async (req,res)=>{
    try {
        const {id} = req.params
        const {fullname} = req.body
        console.log(id);
        console.log(fullname);
        const existedUser = await userModel.findById(id)
        if(!existedUser){
            res.status(400).json({message: "user not found"})
            return
        }

        existedUser.fullname = fullname
        existedUser.save()

        res.status(200).json({message: "User Details Updated"})
    } catch (error) {
        console.log(error);
    }
}

const uploadProfileImage = async (req, res)=>{
    try {
        const { id } = req.body
        const image = req.files?.image
        if(!image){
            res.status(400).json({error: true})
            return
        }
        const profileImage = await imageUpload(image)
        await userModel.findByIdAndUpdate(id,{profileImage})
        res.status(200).json({ message: "image uploaded"})   
    } catch (error) {
        console.log(error);
    }
}

const getAllCourses = async (req, res)=>{
    try {

        const courses = await courseModel.find();
        res.status(200).json({courses});
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getUser,
    uploadProfileImage,
    editUser,
    getAllCourses
}