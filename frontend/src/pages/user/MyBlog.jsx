import { useState, Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Input, Textarea } from '@material-tailwind/react'
import Dropzone from 'react-dropzone'
import { Toaster } from 'react-hot-toast';
import { Oval } from 'react-loader-spinner'
import { MdDelete } from "react-icons/md";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import ReactPaginate from 'react-paginate';

import Navbar from '../../components/navbars/navbar'
import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const MyBlog = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const editor = useRef()
    const valuesEditor = useRef()

    const [isOpen, setIsOpen] = useState(false)
    const [coverImage, setCoverImage] = useState(null);
    const [values, setValues] = useState({
        title: "",
        description: "",
    })

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editCoverImage, setEditCoverImage] = useState(null);
    const [isImageOpen, setIsImageOpen] = useState(false)
    const [editValues, setEditValues] = useState({
        title: "",
        description: "",
    })

    const [fetch, setFetch] = useState(false);
    const [blogs, setBlogs] = useState(null);

    const [blogId, setBlogId] = useState(null);
    const [content, setContent] = useState("");
    const [editContent, setEditContent] = useState("");
    const [pageCount, setPageCount] = useState(1)
    const currentPage = useRef()


    const getSunEditorInstance = (sunEditor) => {
        editor.current = sunEditor;
    };

    const editValuesgetSunEditorInstance = (sunEditor) => {
        valuesEditor.current = sunEditor;
    };

    const setCodeHandle = () => {
        setContent(editor.current.getContents());
    };

    const setEditValuesCodeHandle = () => {
        setEditContent(valuesEditor.current.getContents());
    };

    function closeModal() {
        setCoverImage(null)
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function closeEditModal() {
        setIsEditOpen(false)
    }

    function openEditModal(id, title, description, content) {
        setBlogId(id)
        setEditValues({ title, description })
        setEditContent(content)
        setIsEditOpen(true)
    }

    function closeImageModal() {
        setEditCoverImage(null)
        setIsImageOpen(false)
    }

    function openImageModal(id) {
        setBlogId(id)
        setIsImageOpen(true)
    }

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file && file.type.startsWith('image/')) {
            setCoverImage(acceptedFiles[0])
        } else {
            toastHelper.showToast('Please upload a valid image file.');
        }
    };

    const handleEditImageDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file && file.type.startsWith('image/')) {
            setEditCoverImage(acceptedFiles[0])
        } else {
            toastHelper.showToast('Please upload a valid image file.');
        }
    };

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleEditChanges = (e) => {
        setEditValues({ ...editValues, [e.target.name]: e.target.value.trim() })
    }

    const handleCreateBlog = () => {
        
        if (values.title.trim() === "" || values.description.trim() === "" || !coverImage) {
            toastHelper.showToast("Fill the Form")
            return
        }

        const postData = {
            ...values,
            content,
            coverImage: coverImage
        }
        console.log(postData);
        axiosPrivate.post("/user/myBlog", postData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                console.log(res);
                setFetch(true)
            })
            .catch((err) => {
                console.log(err);
            })

        closeModal()
    }

    const handleEditBlog = () => {
        if (editValues.title === "" || editValues.description === "") {
            toastHelper.showToast("Fill the Form")
            return
        }

        const putData = { ...editValues,editContent }
        console.log(putData);

        axiosPrivate.put(`/user/myBlog/${blogId}`, putData)
            .then((res) => {
                console.log(res);
                setFetch(true)
                setEditContent("")
            })
            .catch((err) => {
                console.log(err);
            })

        closeEditModal()
    }

    const handleChangeBlogImage = () => {
        if (!editCoverImage) {
            toastHelper.showToast("Select a image")
            return
        }

        console.log(editCoverImage);
        axiosPrivate.put(`/user/myBlogImage/${blogId}`, { image: editCoverImage }, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                console.log(res);
                setFetch(true)
            })
            .catch((err) => {
                console.log(err);
            })

        closeImageModal()
    }

    const handleBlogDelete = (id) => {
        axiosPrivate.delete(`/user/myBlog/${id}`)
            .then((res) => {
                setFetch(true)
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchMyBlogs = () => {
        axiosPrivate.get(`/user/myBlog?page=${currentPage.current}`)
            .then((res) => {
                console.log(res);
                setBlogs(res?.data?.results?.myBlogs)
                setPageCount(res?.data?.results?.pageCount)
                currentPage.current = res?.data?.results?.page
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handlePageClick = (e) => {
        currentPage.current = e.selected + 1;
        fetchMyBlogs()
    }

    useEffect(() => {
        fetchMyBlogs();
        setFetch(false)
    }, [fetch]);


    return (
        <>
            <div className='w-screen h-screen overflow-x-hidden'>
                <Navbar />
                <div className="w-full h-full p-5 flex flex-col gap-5 bg-gray-300">

                    {blogs && blogs.map((blog) => (
                        <div className="w-full h-24 rounded-lg shadow-lg bg-white flex gap-5 cursor-pointer">
                            <img src={blog?.coverImage?.url} className='w-1/6 h-full object-fit rounded-l-lg hover:bg-black hover:opacity-80' alt="pic" onClick={() => openImageModal(blog?._id)} />
                            <div className='w-full h-full font-bold flex justify-center items-center' onClick={() => openEditModal(blog?._id, blog?.title, blog?.description, blog?.content)}>{blog?.title}</div>
                            <div className='bg-gray-400 flex justify-center items-center rounded-r-lg px-10' ><MdDelete className='text-2xl' onClick={() => handleBlogDelete(blog?._id)} /></div>
                        </div>
                    ))}

                    <div className="w-full h-24 rounded-lg shadow-lg bg-white flex gap-5 cursor-pointer" onClick={openModal}>
                        <div className='w-full h-full font-extrabold text-lg flex justify-center items-center'>Add Blog</div>
                    </div>

                    <div className='w-full flex justify-center py-5 bg-gray-300'>
                        <ReactPaginate
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={0}
                            pageCount={pageCount}
                            // initialPage={currentPage.current}
                            forcePage={currentPage.current}
                            previousLabel="<"
                            pageClassName="inline-block mx-1 page-item"
                            pageLinkClassName=" p-2 page-link"
                            previousClassName="inline-block mx-1 page-item font-bold"
                            previousLinkClassName=" p-2 page-link "
                            nextClassName="inline-block mx-1 page-item font-bold"
                            nextLinkClassName="p-2 page-link"
                            breakLabel="..."
                            breakClassName="page-item inline-flex"
                            breakLinkClassName="page-link "
                            containerClassName="pagination"
                            activeClassName="active bg-red-500"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                </div>
                <Toaster />
            </div>


            {/* create blog modal */}
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
                                        Create Blog
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-3">
                                        <Input label="Title" name='title' onChange={handleChanges} />
                                        <Textarea label="Description" name='description' onChange={handleChanges} />
                                        <SunEditor
                                            getSunEditorInstance={getSunEditorInstance}
                                            onChange={setCodeHandle}
                                            setContents={content}
                                            setOptions={{
                                                width: "100%", // Full width
                                                minHeight: "200px", // Or any other minimum height you want
                                                maxHeight: "70vh", // Set a maximum height to prevent it from expanding too much
                                                overflowY: "auto",
                                                buttonList: [
                                                    ["undo", "redo", "font", "fontSize", "formatBlock"],
                                                    [
                                                        "bold",
                                                        "underline",
                                                        "italic",
                                                        "strike",
                                                        "subscript",
                                                        "superscript",
                                                        "removeFormat",
                                                    ],
                                                    [
                                                        "fontColor",
                                                        "hiliteColor",
                                                        "outdent",
                                                        "indent",
                                                        "align",
                                                        "horizontalRule",
                                                        "list",
                                                        "table",
                                                    ],
                                                    [
                                                        "link",
                                                        "image",
                                                        "video",
                                                        "fullScreen",
                                                        "showBlocks",
                                                        "codeView",
                                                        "preview",
                                                        "print",
                                                        "save",
                                                    ],
                                                ],
                                            }}
                                        />
                                        <Dropzone onDrop={handleDrop}>
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div className='w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer' {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className='flex flex-col h-full justify-center'>

                                                            {coverImage ? <div className='h-1/3 flex items-center justify-center'>{coverImage.name}</div>
                                                                : <p>Drag 'n' drop some files here, or click to select files</p>}
                                                            {coverImage && <img className='w-full h-2/3 object-center pb-4' src={URL.createObjectURL(coverImage)}></img>}

                                                        </div>
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                    </div>

                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleCreateBlog}
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

            {/* Change image modal */}
            < Transition appear show={isImageOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeImageModal}>
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
                                        Image Upload
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-3">
                                        <Dropzone accept={['image/*']} multiple={false} onDrop={handleEditImageDrop}>
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div className='w-full h-40 border-2 border-gray-400 border-dashed outline-none flex items-center justify-center cursor-pointer' {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className='flex flex-col h-full justify-center'>

                                                            {editCoverImage ? <div className='h-1/3 flex items-center justify-center'>{editCoverImage.name}</div>
                                                                : <p>Drag 'n' drop image here, or click to select image</p>}
                                                            {editCoverImage && <img className='w-full h-2/3 object-center pb-4' src={URL.createObjectURL(editCoverImage)}></img>}

                                                        </div>
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                    </div>

                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleChangeBlogImage}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </ Transition>

            {/* Edit Blog modal */}
            <Transition appear show={isEditOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className={`fixed inset-0 bg-black/25`} />
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
                                        Edit Course
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-3">
                                        <Input label="Title" name='title' value={editValues.title} onChange={handleEditChanges} />
                                        <Textarea label="Description" name='description' value={editValues.description} onChange={handleEditChanges} />
                                        <SunEditor
                                            getSunEditorInstance={editValuesgetSunEditorInstance}
                                            onChange={setEditValuesCodeHandle}
                                            setContents={editContent}
                                            setOptions={{
                                                width: "100%", // Full width
                                                minHeight: "200px", // Or any other minimum height you want
                                                maxHeight: "70vh", // Set a maximum height to prevent it from expanding too much
                                                overflowY: "auto",
                                                buttonList: [
                                                    ["undo", "redo", "font", "fontSize", "formatBlock"],
                                                    [
                                                        "bold",
                                                        "underline",
                                                        "italic",
                                                        "strike",
                                                        "subscript",
                                                        "superscript",
                                                        "removeFormat",
                                                    ],
                                                    [
                                                        "fontColor",
                                                        "hiliteColor",
                                                        "outdent",
                                                        "indent",
                                                        "align",
                                                        "horizontalRule",
                                                        "list",
                                                        "table",
                                                    ],
                                                    [
                                                        "link",
                                                        "image",
                                                        "video",
                                                        "fullScreen",
                                                        "showBlocks",
                                                        "codeView",
                                                        "preview",
                                                        "print",
                                                        "save",
                                                    ],
                                                ],
                                            }}
                                        />
                                    </div>

                                    <div className="mt-4 flex justify-center">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleEditBlog}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}

export default MyBlog
