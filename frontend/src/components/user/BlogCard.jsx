import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom'

// const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const BlogCard = ({blog}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const maxLength = 200;

    return (
        <div className="w-full h-36 flex shadow-md cursor-pointer" onClick={()=>navigate("/user/blogDetails", { state: { blogId: blog._id, prevLocation: location } })}>
            <div className=" h-full w-5/6">
                <div className=" h-1/6 pl-2 text-verySmall-1 flex items-center">{blog?.user?.fullname}</div>
                <div className=" h-1/6 font-bold text-lg px-2 flex items-center truncate">{blog?.title}</div>
                <div className=" text-sm h-3/6 w-full p-2 overflow-hidden break-words overflow-ellipsis">
                    <span className='mr-2'>{blog?.description.slice(0, maxLength)}</span>
                    {blog?.description?.length > maxLength && <span className='underline text-blue-600 text-verySmall-1' >Read More...</span>}
                    </div>
            </div>
            <img src={blog?.coverImage?.url} className='w-1/6 h-full' alt="pic" />
        </div>
    )
}

export default BlogCard
