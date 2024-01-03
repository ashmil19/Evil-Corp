const mongoose = require('mongoose');

const { imageUpload } = require("../../utils/uploadImage");
const blogModel = require("../../models/blogModel")
const blogCommentModel = require("../../models/blogComment")


const addBlog = async (req, res)=>{
    try {
        const userId = req.userId;
        const {title, description} = req.body;
        const image = req.files.coverImage;
        console.log(image);

        const coverImage = await imageUpload(image);
        const user = new mongoose.Types.ObjectId(userId);

        const newBlog = new blogModel({
            title,
            description,
            coverImage,
            user 
        })

        newBlog.save();

        res.status(200).json({message: "blog created"})
    } catch (error) {
        console.log(error);
    }
}

const editBlog = async (req, res)=>{
    try {
        const blogId = req.params.id;
        const {title, description} = req.body;

        const blog = await blogModel.findById(blogId);

        if(!blog){
            res.status(404).json({message: "blog not found"})
            return
        }

        blog.title = title
        blog.description = description
        await blog.save();
        
        res.status(200).json({message: "blog is Edited"});

    } catch (error) {
        console.log(error);
    }
}

const changeBlogImage = async (req, res)=>{
    try {
        const blogId = req.params.id;
        const image = req.files?.image;
        if (!image) {
            res.status(400).json({ error: true });
            return;
        }

        const coverImage = await imageUpload(image);
        await blogModel.findByIdAndUpdate(blogId,{coverImage})
        console.log("suces");
        res.status(200).json({ message: "image Changed" });
    } catch (error) {
        console.log(error);
    }
}

const deleteBlog = async (req, res)=>{
    try {
        const blogId = req.params.id;
        const blog = await blogModel.findById(blogId);

        if(!blog){
            res.status(404).json({message: "blog not found"})
            return
        }

        await blogModel.findByIdAndDelete(blogId);
        res.status(200).json({message: "blog is Deleted"})
    } catch (error) {
        console.log(error);
    }
}

const getAllBlogs = async (req, res)=>{
    try {
        const blogs = await blogModel.find({isAccess: true}).populate("user");
        res.status(200).json({blogs});
    } catch (error) {
        console.log(error);
    }
}

const getBlog = async (req, res)=>{
    try {
        const userId = req.userId;
        const blogId = req.params.id;
        const user = new mongoose.Types.ObjectId(userId);
        let blog = await blogModel.findOne({_id:blogId, isAccess: true}).populate({
            path: "comments",
            populate: {
                path: "user"
            },
            options: {
                sort: {createdAt: -1}
            }
        })

        if(!blog){
            res.status(200).json({blog});
            return
        }

        const liked = !!(await blogModel.findOne({_id: blogId, likes: userId}))
        const reported = !!(await blogModel.findOne({_id: blogId, reports: userId}))
        
        const likes = blog.likes.length;
        const {_doc: {...rest}, likesCount = likes, isLiked = liked, isReported = reported} = blog
        blog = {...rest,likesCount, isLiked, isReported}


        res.status(200).json({blog});
    } catch (error) {
        console.log(error);
    }
}

const getAllMyBlogs = async (req, res)=>{
    try {
        const userId = req.userId;
        const myBlogs = await blogModel.find({user: userId})
        res.status(200).json({myBlogs})
    } catch (error) {
        console.log(error);
    }
}

const handleLike = async (req, res)=>{
    try {
        const userId = req.userId;
        const blogId = req.body.blogId;
        const user = new mongoose.Types.ObjectId(userId);
        const isLiked = await blogModel.findOne({_id: blogId, likes: user})

        if(isLiked){
            await blogModel.findByIdAndUpdate(blogId,{$pull: {likes: user}})
            res.status(200).json({message: "Blog Unliked"})
            return
        }
        
        await blogModel.findByIdAndUpdate(blogId,{$push: {likes: user}})
        res.status(200).json({message: "Blog Liked"})

    } catch (error) {
        console.log(error);
    }
}

const handleReport = async (req, res)=>{
    try {
        const userId = req.userId;
        const blogId = req.body.blogId;
        const user = new mongoose.Types.ObjectId(userId);
        const minimumReports = 10

        const updatedBlog = await blogModel.findByIdAndUpdate(blogId,{$push: {reports: user}},{ new: true })

        // const reportsCount = updatedBlog.reports.length
        const reportsCount = 12
        const LikesCount = updatedBlog.likes.length

        if(reportsCount > Math.floor(LikesCount/2) && reportsCount > minimumReports){
            updatedBlog.isAccess = false;
            await updatedBlog.save()
        }

        res.status(200).json({message: "Blog Reported"})
    } catch (error) {
        console.log(error);
    }
}

const handleComment = async (req, res)=>{
    try {
        const userId = req.userId;
        const user = new mongoose.Types.ObjectId(userId);
        const {blogId, comment} = req.body

        const newComment = blogCommentModel({
            user,
            content: comment,
        })

        const newAddedComment = await newComment.save();
        await blogModel.findByIdAndUpdate(blogId,{$push: {comments: newAddedComment._id}})
        res.status(200).json({message: "comment added"});
    } catch (error) {
        console.log(error);
    }
}


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
}