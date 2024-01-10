import { useState, Fragment, useEffect } from 'react'
import { useNavigate } from  'react-router-dom'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { Dialog, Transition } from '@headlessui/react'
import { Input, Textarea, Select, Option } from '@material-tailwind/react'
import { Toaster } from 'react-hot-toast';
import Dropzone from 'react-dropzone'
import { Oval } from 'react-loader-spinner'

import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import TeacherCourseCard from '../../components/teacher/TeacherCourseCard'
import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const UploadCourse = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const navigate = useNavigate()

    const [fetch, setFetch] = useState(false)
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('');
    const [demoVideo, setDemoVideo] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [categories, setCategories] = useState(null);
    const [message, setMessage] = useState(null)
    const [values, setValues] = useState({
        title: "",
        description: "",
        price: "",
    })
    
    const [isOtherCategory, setIsOtherCategory] = useState(false)
    const [otherCategory, setOtherCategory] = useState('')

    const handleCategoryChange = (category) =>{
        console.log("category",category);

        setIsOtherCategory(false)
        if(category.name === "Other"){
            setIsOtherCategory(true)
        }

        setSelectedCategory(category._id)

    }



    function closeModal() {
        setCoverImage(null)
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
        setIsOtherCategory(false)
    }

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file && file.type.startsWith('image/')) {
            setCoverImage(acceptedFiles[0])
        } else {
            toastHelper.showToast('Please upload a valid image file.');
        }
    };

    const handleDemoVideoDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
    
        if (file && file.type.startsWith('video/')) {
          console.log(file);
          setDemoVideo(acceptedFiles[0])
        } else {
          toastHelper.showToast('Please upload a valid video file.');
        }
      };


    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value.trim() })
    }


    const handleCreateCourse = () => {
        if (selectedCategory === "" || values.title === "" || values.description === "" || values.price === "" || !coverImage || !demoVideo) {
            toastHelper.showToast("Fill the Form")
            return
        }

        if(isOtherCategory){
            if(otherCategory.trim() === ""){
                toastHelper.showToast("Fill the Other category")
                return
            }
        }

        if (Number(values.price) < 1) {
            toastHelper.showToast('Price Must greater Zero')
            return
        }

        const postData = { ...values, category: selectedCategory, coverImage: coverImage, demoVideo, otherCategory }
        console.log(postData);

        setLoading(true)

        axiosPrivate.post("/teacher/course", postData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                setMessage(res.data.message)
                setLoading(false)
                // toastHelper.showToast(message)
                console.log(res);
            })
            .catch((err) => {
                setLoading(false)
                toastHelper.showToast("some went wrong")
                console.log(res);
            })

        closeModal()

    }

    

    useEffect(() => {
        axiosPrivate.get("/teacher/course")
        .then((res)=>{
            console.log(res.data.courses);
            setCourses(res.data.courses)
        })
        .catch((err)=>{
            console.log(err);
        })

        axiosPrivate.get("/teacher/category")
        .then((res)=>{
            console.log(res.data.categories);
            setCategories(res.data.categories)
        })
        .catch((err)=>{
            console.log(err);
        })

        setFetch(false)
        
        return ()=> setMessage('')
    }, [message, fetch]);


    return (
        <>
            <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
                <TeacherNavbar />

                {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <Oval
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="oval-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>}

                <div className='w-full h-auto bg-dashboard-bg flex flex-col gap-8'>
                    <div className='w-full h-20 bg-dashboard-bg flex justify-center items-center'>
                        <div className='flex '>
                            <div className='w-14 h-10 rounded-l-md bg-black flex justify-center items-center'>
                                <FaSearch className='text-blue-500' />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="p-2 rounded-r-md w-full md:w-64 text-black text-verySmall-1 bg-white outline-none"
                            />
                        </div>
                    </div>
                    <div className='w-full h-auto flex justify-center px-2 py-2 flex-wrap gap-4'>
                        {courses && courses.map((course) => {
                            return <TeacherCourseCard key={course._id} course={course} setFetch={setFetch} onclick={()=>navigate("/teacher/courseDetails",{state: {id: course._id}})} />
                        })}
                        <div className='h-56 w-64 bg-gray-300 rounded-lg flex justify-center items-center cursor-pointer' onClick={openModal} >
                            <FaPlus className='text-Student-management' size={180} />
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
                                        Create Course
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-3">
                                        <Input label="Title" name='title' onChange={handleChanges} />
                                        <Select variant="outlined" label="Category" id="category" name="category" onChange={(e) => handleCategoryChange(e)}>
                                            {categories && categories.map((category)=>{
                                                return <Option value={category}>{category.name}</Option>
                                            })}
                                        </Select>
                                        {isOtherCategory && <Input label="Other Category" name='otherCategory' onChange={(e)=> setOtherCategory(e.target.value)} />}
                                        <Textarea label="Description" name='description' onChange={handleChanges} />
                                        <Input type='number' label='Price' name='price' onChange={handleChanges} />
                                        {/* <Input type='file' label='Cover Image' name='coverImage' onChange={(e)=> setCoverImage(e.target.files[0])} /> */}
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
                                        <Dropzone accept={['video/*']} multiple={false} onDrop={handleDemoVideoDrop}>
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div className='w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer' {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <div className='flex flex-col h-full justify-center'>

                                                            {demoVideo ? <div className='h-1/3 flex items-center justify-center'>{demoVideo.name}</div>
                                                                : <p>Drag 'n' drop some video here, or click to select video</p>}
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
                                            onClick={handleCreateCourse}
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

export default UploadCourse
