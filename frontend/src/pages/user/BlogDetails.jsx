import React, { useEffect, useState } from 'react'
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Textarea } from '@material-tailwind/react';
import { Toaster } from 'react-hot-toast';
import { useSelector} from 'react-redux';

import Navbar from '../../components/navbars/navbar'
import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import courseBanner from '../../asset/courseBanner.jpeg'

const BlogDetails = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const location = useLocation()
    const navigate = useNavigate();
    const blogId = location.state && location.state.blogId;
    const prevLocation = location.state?.prevLocation;
    const authState = useSelector((state)=> state.auth)

    const [comment, setComment] = useState("");
    const [blog, setBlog] = useState(null);
    const [fetch, setFetch] = useState(false);
    const [allComments, setAllComments] = useState(null);

    const handleLike = () =>{
        axiosPrivate.post("/user/blogLike",{blogId})
        .then((res)=>{
            console.log(res);
            setFetch(true)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const handleReport = () =>{
        axiosPrivate.post("/user/blogReport",{blogId})
        .then((res)=>{
            console.log(res);
            setFetch(true)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const handleCommentSubmit = () =>{
        if(comment === ""){
            toastHelper.showToast("please enter any comment")
            return
        }

        const postData = {
            blogId,
            comment,
        }

        axiosPrivate.post("/user/blogComment",postData)
        .then((res)=>{
            console.log(res);
            setComment("")
            setFetch(true)
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    const fetchBlog = () =>{
        axiosPrivate.get(`/user/blog/${blogId}`)
        .then((res)=>{
            console.log(res);
            setBlog(res?.data?.blog)

            if(res?.data?.blog === null){
                navigate(prevLocation)
            }

            setAllComments(res?.data?.blog?.comments)
        })
    }

    useEffect(() => {
        fetchBlog()
        setFetch(false)
    }, [fetch, navigate]);

    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Navbar />
            <div className="w-full h-full">
                <div className='h-72 w-full bg-center bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${blog?.coverImage?.url})` }}></div>
                <div className='w-full p-5 flex flex-col gap-3'>
                    <div className=''>
                        <div className='font-bold text-3xl'>{blog?.title}</div>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-1'>
                                {blog?.isLiked ? <AiFillLike className='text-xl cursor-pointer' onClick={handleLike} /> : <AiOutlineLike className='text-xl cursor-pointer' onClick={handleLike} />}
                                {/* <AiOutlineLike className='text-xl cursor-pointer' onClick={handleLike} /> */}
                                <span className=''>{blog?.likesCount}</span>
                            </div>
                            {!blog?.isReported && <Button size='sm' onClick={handleReport}>Report</Button>}
                        </div>
                    </div>
                    <div className='text-sm overflow-hidden break-words leading-7'>{blog?.description}.</div>
                </div>
                <div className="w-full h-34 p-5 flex flex-col gap-3">
                    <div className='font-extrabold text-lg'>Comments({allComments?.length})</div>
                    <div>
                      <Textarea label="Comment" name='comment' value={comment} onChange={(e)=> setComment(e.target.value.trim())} />
                       <Button size='sm' onClick={handleCommentSubmit}>Submit</Button>
                    </div>
                    <div className='py-2 flex flex-col gap-2'>
                        {allComments && allComments.map((oneComment)=>(
                            <div className="w-full h-14 shadow-md bg-gray-300 p-2">
                                <div className=" h-2/6 text-verySmall">{authState.userId == oneComment.user._id ? "You" : oneComment.user.fullname}</div>
                                <div className=" h-4/6 flex items-center font-medium text-sm">{oneComment.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default BlogDetails
