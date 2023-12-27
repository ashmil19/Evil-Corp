import { useState, Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@material-tailwind/react'
import { FaUpload } from 'react-icons/fa'
import { GoGrabber } from "react-icons/go";
import { RiDeleteBin7Fill } from "react-icons/ri";
import Dropzone from 'react-dropzone'
import { Dialog, Transition } from '@headlessui/react'
import { Input, Textarea, Select, Option } from '@material-tailwind/react'
import { Toaster } from 'react-hot-toast'
import { useLocation } from 'react-router-dom';
import {
  DndContext,
  closestCenter
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'


import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import ToastHelper from '../../helper/ToastHelper'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import SortableItem from '../../components/teacher/SortableItem';
const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';


const CourseDetails = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation();
  const courseId = location.state && location.state.id;

  const toastHelper = new ToastHelper()

  const [message, setMessage] = useState(null);

  const [isOpen, setIsOpen] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [isChapterOpen, setIsChapterOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const [chapterVideo, setChapterVideo] = useState(null);
  const [chapterValues, setChapterValues] = useState({
    title: ""
  })


  const [categories, setCategories] = useState(null);
  const [chapter, setChapter] = useState([]);
  const [course, setCourse] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    price: "",
  })

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setEditValues({
      title: course.title,
      description: course.description,
      price: course.price
    })
    setSelectedCategory(course.category._id)
    setIsOpen(true)
  }

  function closeImageModal() {
    setCoverImage(null)
    setIsImageOpen(false)
  }

  function openImageModal() {
    setIsImageOpen(true)
  }

  function closeChapterModal() {
    setChapterVideo("")
    setIsChapterOpen(false)
  }

  function openChapterModal() {
    setIsChapterOpen(true)
  }


  const handleEditImageDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith('image/')) {
      setCoverImage(acceptedFiles[0])
    } else {
      toastHelper.showToast('Please upload a valid image file.');
    }
  };

  // const handleChapterThumpnailDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];

  //   if (file && file.type.startsWith('image/')) {
  //     setChapterThumbnail(acceptedFiles[0])
  //   } else {
  //     toastHelper.showToast('Please upload a valid image file.');
  //   }
  // };

  const handleChapterVideoDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith('video/')) {
      console.log(file);
      setChapterVideo(acceptedFiles[0])
    } else {
      toastHelper.showToast('Please upload a valid video file.');
    }
  };

  const getBackgroundImage = () => {
    if (coverImage) {
      return URL.createObjectURL(coverImage);
    } else if (course?.coverImage?.url) {
      return course.coverImage.url;
    } else {
      return profilePic;
    }
  };

  const handleUploadChapter = () => {
    if (chapterValues === null || !chapterVideo) {
      toastHelper.showToast("Fill the form")
      return
    }

    const postData = {
      ...chapterValues,
      chapterVideo,
      courseId
    }

    console.log(postData);
    axiosPrivate.post("/teacher/uploadChapter", postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        toastHelper.showToast(err?.response?.data?.message)
        console.log(err);
      })

    closeChapterModal()

  }

  const handleEditCourse = () => {
    if (editValues.title == "" || editValues.description == "" || editValues.price == "") {
      toastHelper.showToast("Fill the form")
      return
    }

    if (editValues.title == course.title && editValues.description == course.description && editValues.price == course.price && selectedCategory == course.category._id) {
      toastHelper.showToast("values not changed")
      return
    }

    console.log({ ...editValues, selectedCategory })
    const putData = { ...editValues, category: selectedCategory }

    axiosPrivate.put(`/teacher/course/${courseId}`, putData)
      .then((res) => {
        setMessage(res.data?.message)
        toastHelper.showToast(res.data?.message)
        console.log(res);
      })
      .catch((err) => {
        toastHelper.showToast(err?.response?.data?.message);
        console.log(err);
      })

    closeModal();
  }

  const handleChangeCourseImage = () => {
    if (!coverImage) {
      toastHelper.showToast("select an image");
      return;
    }

    axiosPrivate.put(`/teacher/courseImage/${courseId}`, { image: coverImage }, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setMessage(res.data?.message)
        setCoverImage(null)
        console.log(res);
        toastHelper.showToast(res.data?.message)
      })
      .catch((err) => {
        console.log(err);
        toastHelper.showToast(err?.response?.data?.message);
      })

    closeImageModal()
  }

  const handleDragEnd = (event) => {
    const {active, over} = event;
    const activeId = active.id._id
    const overId = over.id._id
    console.log(active);
    console.log(over);

    if(activeId !== overId){
      setChapter((value)=>{
        const activeIndex = value.indexOf(active.id)
        const overIndex = value.indexOf(over.id)

        const putData = {
          activeId,
          overId
        }
        axiosPrivate.put(`/teacher/changeIndex/${courseId}`,putData)
        .catch((err)=>{
          console.log(err);
        })

        return arrayMove(value, activeIndex, overIndex);
      })
    }
  }


  const handleChanges = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value.trim() })
  }

  const handleChapterValuesChanges = (e) => {
    setChapterValues({ ...chapterValues, [e.target.name]: e.target.value.trim() })
  }

  useEffect(() => {
    axiosPrivate.get(`/teacher/course/${courseId}`)
      .then((res) => {
        console.log(res.data.course);
        // setSelectedCategory(res.data.course.category.name)
        setCourse(res.data.course);
        setChapter(res.data.course.chapters)
      })
      .catch((err) => {
        console.log(err);
      })

    axiosPrivate.get("/teacher/category")
      .then((res) => {
        console.log(res.data.categories);
        setCategories(res.data.categories)
      })
      .catch((err) => {
        console.log(err);
      })

  }, [message]);

  return (
    <>
      <div className='h-auto overflow-hidden'>
        <TeacherNavbar />
        <div className='w-full h-auto py-5 px-5 md:px-10 bg-dashboard-bg flex flex-col gap-5 '>
          <div className='w-full h-auto flex flex-col md:flex-row  gap-5'>
            <div className='w-full md:w-1/2 h-auto flex flex-col gap-5 '>
              <div className='w-full h-96 '>
                <div className='w-full h-5/6 bg-cover bg-center rounded-t-lg' style={{ backgroundImage: `url(${getBackgroundImage()})` }}></div>
                <div className='w-full h-1/6 bg-gray-600 rounded-b-lg flex justify-center items-center'>
                  <Button className='rounded-full bg-custom-bg-color' onClick={openImageModal} >Change</Button>
                </div>
              </div>
              <div className='w-full h-96 bg-teacher-card-bg text-white rounded-lg p-8 flex flex-col justify-evenly gap-2'>

                <div className=''>
                  <div className='font-bold text-xl'>{course && course.title}</div>
                  <div className='font-normal text-xs opacity-80'>{course && course.category.name}</div>
                </div>
                <div className='font-medium text-lg'><span className='text-red-500'>&#x20B9;</span> {course && course.price}</div>
                <div className='text-verySmall md:text-sm overflow-hidden overflow-ellipsis whitespace-nowrap'>{course && course.description}</div>
                <div className='w-full flex justify-center'>
                  <Button onClick={openModal}>Edit</Button>
                </div>
              </div>
            </div>


            <div className='w-full md:w-1/2 h-96 md:h-course rounded-lg bg-teacher-card-bg flex flex-col justify-start gap-2 p-4'>
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={chapter && chapter} strategy={verticalListSortingStrategy}>
                  {chapter && chapter.map((chap) => <SortableItem key={chap._id} id={chap} chapter={chap} />)}
                </SortableContext>
              </DndContext >
            </div>
          </div>


        </div>
        <div className='bg-white h-8 w-12 rounded-lg flex items-center justify-center text-Student-management fixed bottom-5 right-10 cursor-pointer' onClick={openChapterModal} ><FaUpload /></div>
        <Toaster />
      </div>



      {/* Edit details modal */}
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
                    <Input label="Title" name='title' value={editValues.title} onChange={handleChanges} />
                    <Select variant="outlined" label="Category" id="category" name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e)}>
                      {categories && categories.map((category) => {
                        return <Option value={category._id}>{category.name}</Option>
                      })}
                    </Select>
                    <Textarea label="Description" name='description' value={editValues.description} onChange={handleChanges} />
                    <Input type='number' label='Price' name='price' value={editValues.price} onChange={handleChanges} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleEditCourse}
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
                      onClick={handleChangeCourseImage}
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

      {/* chapter upload modal */}
      <Transition appear as={Fragment} show={isChapterOpen} >
        <Dialog as="div" className="relative z-10" onClose={closeChapterModal}>
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
                    Upload Chapter
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input label="Title" name='title' onChange={handleChapterValuesChanges} />
                    <Dropzone accept={['video/*']} multiple={false} onDrop={handleChapterVideoDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div className='w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer' {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className='flex flex-col h-full justify-center'>

                              {chapterVideo ? <div className='h-1/3 flex items-center justify-center'>{chapterVideo.name}</div>
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
                      onClick={handleUploadChapter}
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

export default CourseDetails
