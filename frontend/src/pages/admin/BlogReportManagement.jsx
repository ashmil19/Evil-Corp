import React, { Fragment, useEffect, useState } from 'react'
import { Input, Button } from '@material-tailwind/react'
import { Dialog, Transition } from '@headlessui/react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import AdminNavbar from '../../components/navbars/AdminNavbar'

const BlogReportManagement = () => {
    const axiosPrivate = useAxiosPrivate()

    const [fetch, setFetch] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [blogs, setBlogs] = useState(null);
    const [currentblog, setCurrentBlog] = useState(null);

    function closeModal() {
        setIsOpen(false)
        setCurrentBlog({ id: null, isAccess: null })
    }

    const openModal = (id, isAccess) => {
        setCurrentBlog({ id, isAccess })
        setIsOpen(true)
    }

    const handleBlogAccess = async (req, res) => {
        axiosPrivate.patch(`/admin/reportedBlogs/${currentblog?.id}`, { isAccess: currentblog?.isAccess })
            .then((res) => {
                console.log(res);
                setFetch(true)
                closeModal()
            })
    }

    useEffect(() => {
        (async () => {
            const result = await axiosPrivate.get("/admin/reportedBlogs");
            setBlogs(result?.data?.blogs)
            console.log(result);
        })()

        setFetch(false)

    }, [fetch]);

    return (
        <>
            <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
                <AdminNavbar />
                <div className="bg-opacity-50 bg-otp-bg text-black p-4">
                    <div className='h-auto md:h-2/4 w-full flex flex-col justify-center'>
                        <div className="relative overflow-x-auto flex justify-center">

                            {blogs?.length !== 0 ? <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                <thead className="text-xs text-gray-800 uppercase bg-gray-300 ">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Sl. no
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Blog
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Author
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Count
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs?.map((blog, index) => {
                                        return <tr className=" border-b border-black bg-white  text-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4">
                                                {blog?.title}
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {blog?.user?.fullname}
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {blog?.reports?.length}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex justify-start gap-2">
                                                    <Button size='sm' color={blog?.isAccess ? "red" : "black"} onClick={() => openModal(blog?._id, blog?.isAccess)} >{blog?.isAccess ? "Block" : "Unblock"}</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>

                            </table> : <th className='w-full flex justify-center'>No Reported Blogs found</th>}
                        </div>
                    </div>
                </div>
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
                                <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 text-center"
                                    >
                                        Are you sure ?
                                    </Dialog.Title>

                                    <div className="mt-4 flex items-center justify-evenly">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleBlogAccess}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Close
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

export default BlogReportManagement
