import { useState, Fragment } from 'react'
import { Button } from '@material-tailwind/react'
import { FaUpload } from 'react-icons/fa'
import { GoGrabber } from "react-icons/go";
import { RiDeleteBin7Fill } from "react-icons/ri";
import Dropzone from 'react-dropzone'
import { Dialog, Transition } from '@headlessui/react'
import { Input, Textarea, Select, Option } from '@material-tailwind/react'
import { Toaster } from 'react-hot-toast'


import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import ToastHelper from '../../helper/ToastHelper'
const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';


const CourseDetails = () => {
  const toastHelper = new ToastHelper()

  const [isOpen, setIsOpen] = useState(false)
  const [isImageOpen, setIsImageOpen] = useState(false)
  const [isChapterOpen, setIsChapterOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState('');

  const [coverImage, setCoverImage] = useState(null);
  // const [chapterThumbnail, setChapterThumbnail] = useState(null);
  const [chapterVideo, setChapterVideo] = useState(null);

  const [editValues, setEditValues] = useState({
      title: "",
      description: "",
      price: "",
  })

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
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
    // setChapterThumbnail("")
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


  const handleChanges = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value.trim() })
  }

  return (
    <>
      <div className='h-auto overflow-x-hidden'>
        <TeacherNavbar />
        <div className='w-full h-auto py-5 px-5 md:px-10 bg-dashboard-bg flex flex-col gap-5 '>
          <div className='w-full h-auto flex flex-col md:flex-row  gap-5 '>
            <div className='w-full md:w-1/2 h-auto flex flex-col gap-5 '>
              <div className='w-full h-96 '>
                <div className='w-full h-5/6 bg-cover bg-center rounded-t-lg' style={{ backgroundImage: `url(${coverImage ? URL.createObjectURL(coverImage) : profilePic})` }}></div>
                <div className='w-full h-1/6 bg-gray-600 rounded-b-lg flex justify-center items-center'>
                  <Button className='rounded-full bg-custom-bg-color' onClick={openImageModal} >Change</Button>
                </div>
              </div>
              <div className='w-full h-96 bg-teacher-card-bg text-white rounded-lg p-8 flex flex-col justify-evenly gap-2'>
                <div className=''>
                  <div className='font-bold text-xl'>Title</div>
                  <div className='font-normal text-xs opacity-80'>Category</div>
                </div>
                <div className='font-medium text-lg'><span className='text-red-500'>&#x20B9;</span> 1000</div>
                <div className='text-verySmall md:text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde reiciendis delectus eos dignissimos aliquid totam rerum, autem minima dolor minus ipsam saepe doloribus dolorum consequatur vitae, laboriosam corrupti nemo. At!
                  Dolorum exercitationem nihil hic sequi numquam repudiandae nostrum nisi, expedita ullam totam voluptate ut ipsa id accusantium maiores aliquam incidunt dicta omnis esse, odio est voluptatibus repellat. Cum, quis harum!
                </div>
                <div className='w-full flex justify-center'>
                  <Button onClick={openModal}>Edit</Button>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2 h-96 md:h-course rounded-lg bg-teacher-card-bg flex justify-center p-4'>
                <div className='w-full h-16 px-2 py-5 flex bg-course-card rounded-lg  '>
                  <div className='flex items-center'>
                    <GoGrabber className='text-black font-extrabold text-3xl mt-1 cursor-grab' />
                  </div>
                  <span className='cursor-pointer font-semibold text-lg md:text-xl overflow-hidden overflow-ellipsis whitespace-nowrap'>This is Sample title. And this overfloww asdfadflafdladflakdfjsadfasdfasfsasfdlajfldjlsdf afds </span>
                  <div className='flex items-center pl-2' >
                    <RiDeleteBin7Fill className='text-black font-extrabold text-xl mt-1 cursor-pointer' />
                  </div>
                </div>
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
                    <Input label="Title" name='title' onChange={handleChanges} />
                    <Select variant="outlined" label="Category" id="category" name="category" onChange={(e) => setSelectedCategory(e)}>
                      <Option value='Osint'>Osint</Option>
                      <Option value='Malware'>Malware</Option>
                      <Option value='Pentesting'>Pentesting</Option>
                      <Option value='SQL Injection'>SQL Injection</Option>
                      <Option value='Other'>Other</Option>
                    </Select>
                    <Textarea label="Description" name='description' onChange={handleChanges} />
                    <Input type='number' label='Price' name='price' onChange={handleChanges} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      
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
      
      {/* chapter upload modal */}
      <Transition appear  as={Fragment} show={isChapterOpen}>
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
                    Edit Course
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input type='number' label='Index' name='index' onChange={handleChanges} />
                    <Input label="Title" name='title' onChange={handleChanges} />
                    <Dropzone accept={['video/*']} multiple={false} onDrop={handleChapterVideoDrop}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div className='w-full h-40 border-2 border-gray-400 border-dashed flex items-center justify-center cursor-pointer' {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className='flex flex-col h-full justify-center'>

                              {chapterVideo ? <div className='h-1/3 flex items-center justify-center'>{chapterVideo.name}</div>
                                : <p>Drag 'n' drop some video here, or click to select video</p>}
                              {/* {chapterVideo && <img className='w-full h-2/3 object-center pb-4' src={URL.createObjectURL(chapterVideo)}></img>} */}

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

export default CourseDetails
