import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Input, Textarea, Button } from '@material-tailwind/react'
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import TimeAgo from 'react-timeago'

import Navbar from '../../components/navbars/Navbar'
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
    const authState = useSelector((state) => state.auth)

    const [comment, setComment] = useState("");
    const [blog, setBlog] = useState(null);
    const [fetch, setFetch] = useState(false);
    const [allComments, setAllComments] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState(null);

    const handleLike = () => {
        axiosPrivate.post("/user/blogLike", { blogId })
            .then((res) => {
                console.log(res);
                setFetch(true)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleReport = () => {
        if (reason.trim() === "") {
            toastHelper.showToast("please add reason")
            return
        }
        console.log(reason)
        const postData = {
            blogId,
            reason
        }

        axiosPrivate.post("/user/blogReport", postData)
            .then((res) => {
                console.log(res);
                setFetch(true)
                closeModal()
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleCommentSubmit = () => {
        if (comment.trim() === "") {
            toastHelper.showToast("please enter any comment")
            return
        }

        const postData = {
            blogId,
            comment: comment.trim(),
        }

        axiosPrivate.post("/user/blogComment", postData)
            .then((res) => {
                console.log(res);
                setComment("")
                setFetch(true)
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const fetchBlog = () => {
        axiosPrivate.get(`/user/blog/${blogId}`)
            .then((res) => {
                console.log(res);
                setBlog(res?.data?.blog)

                if (res?.data?.blog === null) {
                    navigate(prevLocation)
                }

                setAllComments(res?.data?.blog?.comments)
            })
    }

    useEffect(() => {
        fetchBlog()
        setFetch(false)
    }, [fetch, navigate]);


    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className='w-screen h-screen overflow-x-hidden'>
                <Navbar />
                <div className="w-full h-full px-0 md:px-32 py-0 md:py-10">
                    <div className='h-72 w-full bg-center bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${blog?.coverImage?.url})` }}></div>
                    <div className='w-full p-5 flex flex-col gap-4'>
                        <div className=''>
                            <div className='text-verySmall-1'>{new Date(blog?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                            <div className='font-bold text-3xl'>{blog?.title}</div>
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-1'>
                                    {blog?.isLiked ? <AiFillLike className='text-xl cursor-pointer' onClick={handleLike} /> : <AiOutlineLike className='text-xl cursor-pointer' onClick={handleLike} />}
                                    {/* <AiOutlineLike className='text-xl cursor-pointer' onClick={handleLike} /> */}
                                    <span className=''>{blog?.likesCount}</span>
                                </div>
                                {!blog?.isReported && <Button size='sm' onClick={openModal}>Report</Button>}
                            </div>
                        </div>
                        <div className='font-semibold text-sm'>By {blog?.user?.fullname}</div>
                        <div className='text-sm overflow-hidden break-words leading-7'>{blog?.description}.</div>
                        <div dangerouslySetInnerHTML={{ __html: blog?.content }} className='text-sm overflow-hidden break-words leading-7'></div>
                    </div>
                    <div className="w-full h-34 p-5 flex flex-col gap-3">
                        <div className='font-extrabold text-lg'>Comments({allComments?.length})</div>
                        <div>
                            <Textarea label="Comment" name='comment' value={comment} onChange={(e) => setComment(e.target.value)} />
                            <Button size='sm' onClick={handleCommentSubmit}>Submit</Button>
                        </div>
                        <div className='py-2 flex flex-col gap-2'>
                            {allComments && allComments.map((oneComment) => (
                                <div className="w-full h-14 shadow-md bg-gray-300 p-2">
                                    <div className='flex gap-2 h-2/6'>
                                        <div className="flex items-center text-verySmall font-bold">{authState?.userId == oneComment?.user?._id ? "You" : oneComment?.user?.fullname}</div>
                                        {/* <div className='flex items-center text-veryVerySmall'>1 hour ago</div> */}
                                        <TimeAgo className="flex items-center text-veryVerySmall" date={oneComment?.createdAt} />
                                    </div>
                                    <div className=" h-4/6 flex items-center font-normal text-verySmall-1">{oneComment?.content}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        What is the reason ?
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-3">
                                        <Textarea label="Reason" name='reason' onChange={(e) => setReason(e.target.value)} />
                                    </div>

                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleReport}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default BlogDetails
