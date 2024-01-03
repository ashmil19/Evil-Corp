import React, { useEffect, useState } from 'react'
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useLocation } from 'react-router-dom';
import { Button, Textarea } from '@material-tailwind/react';

import Navbar from '../../components/navbars/navbar'
import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import courseBanner from '../../asset/courseBanner.jpeg'

const BlogDetails = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const location = useLocation()
    const blogId = location.state && location.state.blogId;

    const [blog, setBlog] = useState(null);
    const [fetch, setFetch] = useState(false);

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

    const fetchBlog = () =>{
        axiosPrivate.get(`/user/blog/${blogId}`)
        .then((res)=>{
            console.log(res);
            setBlog(res?.data?.blog)
        })
    }

    useEffect(() => {
        fetchBlog()
        setFetch(false)
    }, [fetch]);

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
                            {!blog?.isReported && <Button size='sm'>Report</Button>}
                        </div>
                    </div>
                    <div className='text-sm overflow-hidden break-words leading-7'>{blog?.description}.</div>
                </div>
                <div className="w-full h-34 p-5 flex flex-col gap-3">
                    <div className='font-extrabold text-lg'>Comments</div>
                    <div>
                      <Textarea label="Comment" name='comment' />
                       <Button size='sm'>Submit</Button>
                    </div>
                    <div className='py-2'>
                        <div className="w-full h-14 shadow-md bg-gray-200 p-2">
                            <div className=" h-2/6 text-verySmall-1">name</div>
                            <div className=" h-4/6 flex items-center text-sm">Lorem ipsum dolor sit.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetails
