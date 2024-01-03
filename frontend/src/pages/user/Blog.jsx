import React, { useEffect, useState } from 'react'

import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Navbar from '../../components/navbars/navbar'
import BlogCard from '../../components/user/BlogCard';


const Blog = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const [blogs, setBlogs] = useState(null);

    const fetchAllBlogs = () =>{
        axiosPrivate.get("/user/blogs")
        .then((res)=>{
            console.log(res);
            setBlogs(res.data.blogs)
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(() => {
        fetchAllBlogs()
    }, []);

    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Navbar />
            <div className="w-full h-full p-5 flex flex-col gap-5">
                {blogs && blogs?.map((blog) => (
                    <BlogCard blog={blog} />
                ))}
            </div>
        </div>
    )
}

export default Blog
