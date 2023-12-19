import React, { Fragment, useState } from 'react'
import Dropzone from 'react-dropzone'
import { Dialog, Transition } from '@headlessui/react'
import { Input, Textarea, Select, Option, Button } from '@material-tailwind/react'
import { FaSearch } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast'

import AdminNavbar from '../../components/navbars/AdminNavbar'
import osint from '../../asset/osint.jpg'
import ToastHelper from '../../helper/ToastHelper'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useEffect } from 'react';


const CategoryManagement = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const [isOpen, setIsOpen] = useState(false)
    const [image, setImage] = useState(null);
    const [name, setName] = useState(null);
    const [categories, setCategories] = useState(null);
    const [search, setSearch] = useState("")
    const [message, setMessage] = useState(null)

    const [isImageOpen, setIsImageOpen] = useState(false)
    const [categoryId, setCategoryId] = useState(null)
    const [coverImage, setCoverImage] = useState(null);

    function closeModal() {
        setIsOpen(false)
        setImage(null)
    }

    function openModal() {
        setIsOpen(true)
    }

    function closeImageModal() {
        setCoverImage(null)
        setIsImageOpen(false)
    }

    function openImageModal(id) {
        setCategoryId(id)
        setIsImageOpen(true)
    }

    const handleEditImageDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file && file.type.startsWith('image/')) {
            setImage(acceptedFiles[0])
        } else {
            toastHelper.showToast('Please upload a valid image file.');
        }
    };

    const handleEditCoverImageDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file && file.type.startsWith('image/')) {
            setCoverImage(acceptedFiles[0])
        } else {
            toastHelper.showToast('Please upload a valid image file.');
        }
    };

    const handleCreateCategory = () => {
        if (!image || !name.trim()) {
            toastHelper.showToast("fill the form")
            return
        }

        const postData = {
            image,
            name
        }

        axiosPrivate.post("/admin/category", postData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                toastHelper.showToast(res.data.message)
                setMessage(res.data.message)
                console.log(res);
            })
            .catch((err) => {
                toastHelper.showToast(err?.response?.data?.message)
                console.log(res);
            })

        closeModal()

    }

    const handleImageUpload = () => {
        if (!coverImage) {
            toastHelper.showToast("select any image")
            return
        }

        const postData = {
            id: categoryId,
            image: coverImage,
        }

        console.log(postData);

        axiosPrivate.post("/admin/changeImage", postData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
            setCoverImage(null)
            console.log(res);
            setMessage(res.data.message)
          })
          .catch((err) => {
            console.log(err);
          })

        closeImageModal()
    }

    const hanndleSearch = async () => {
        const response = await axiosPrivate.get(`/admin/category?search=${search}`)
        setCategories(response?.data?.categories)
    }

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await axiosPrivate.get("/admin/category");
            console.log(response.data.categories);
            setCategories(response?.data?.categories)
        }

        fetchCategory()
    }, [message]);

    return (
        <>
            <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
                <AdminNavbar />
                <div className="bg-opacity-50 bg-otp-bg text-black p-4">
                    <div className='w-full h-20 flex items-center justify-end px-0 md:px-4 gap-4'>
                        <div className='flex '>
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                type="text"
                                placeholder="Search..."
                                className="p-2 rounded-l-md w-full md:w-64 text-white text-verySmall-1 bg-dashboard-bg outline-none"
                            />
                            <div className='w-14 h-10 rounded-r-md bg-black flex justify-center items-center cursor-pointer' onClick={hanndleSearch}>
                                <FaSearch className='text-white' />
                            </div>
                        </div>
                        <Button onClick={openModal}>Add</Button>
                    </div>
                    <div className='h-auto md:h-2/4 w-full flex flex-col justify-center'>
                        <div className="relative overflow-x-auto flex justify-center">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                <thead className="text-xs text-gray-800 uppercase bg-gray-300 ">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Sl. no
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Image
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories && categories.map((category, index) => {
                                        return <tr className=" border-b border-black bg-white  text-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                                                {index + 1}
                                            </th>
                                            <td className="px-6 py-4">
                                                <div style={{ backgroundImage: `url(${category ? category.image.url : osint})` }} className='w-8 h-8 bg-cover bg-center'></div>
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {category.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Button size='sm' onClick={()=> openImageModal(category._id)}>Edit</Button>
                                            </td>
                                        </tr>
                                    })

                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* add category */}
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
                                        <Input label="Category Name" name='category' onChange={(e) => setName(e.target.value.trim())} />
                                        <Dropzone accept={['image/*']} multiple={false} onDrop={handleEditImageDrop}>
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div className='w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer' {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className='flex flex-col h-full justify-center'>

                                                            {image ? <div className='h-1/3 flex items-center justify-center'>{image.name}</div>
                                                                : <p>Drag 'n' drop image here, or click to select image</p>}
                                                            {image && <img className='w-full h-2/3 object-center pb-4' src={URL.createObjectURL(image)}></img>}

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
                                            onClick={handleCreateCategory}
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

            <Transition appear show={isImageOpen} as={Fragment}>
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
                                        <Dropzone accept={['image/*']} multiple={false} onDrop={handleEditCoverImageDrop}>
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div className='w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer' {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className='flex flex-col h-full justify-center'>

                                                            {coverImage ? <div className='h-1/3 flex items-center justify-center'>{coverImage.name}</div>
                                                                : <p>Drag 'n' drop image here, or click to select image</p>}
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
                                            onClick={handleImageUpload}
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

            <Toaster />
        </>
    )
}

export default CategoryManagement
