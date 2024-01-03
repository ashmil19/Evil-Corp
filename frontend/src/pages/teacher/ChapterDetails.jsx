import React, { useEffect, useState, Fragment } from 'react'
import { Button, Input } from '@material-tailwind/react'
import { useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import Dropzone from 'react-dropzone'
import { Toaster } from 'react-hot-toast'

import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ToastHelper from '../../helper/ToastHelper'

const dummyVideo = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const ChapterDetails = () => {
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation();
  const chapterId = location.state && location.state.id;
  const courseId = location.state && location.state.courseId;
  const toastHelper = new ToastHelper()

  const [fetch, setFetch] = useState(false)
  const [message, setMessage] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [chapter, setChapter] = useState(null);
  const [isChapterOpen, setIsChapterOpen] = useState(false)
  const [chapterVideo, setChapterVideo] = useState(null);
  const [chapterValues, setChapterValues] = useState({
    title: ""
  })

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setChapterValues({
      index: chapter.index,
      title: chapter.title
    })
    setIsOpen(true)
  }

  function closeChapterModal() {
    setChapterVideo("")
    setIsChapterOpen(false)
  }

  function openChapterModal() {
    setIsChapterOpen(true)
  }

  const handleChapterVideoDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith('video/')) {
      console.log(file);
      setChapterVideo(acceptedFiles[0])
    } else {
      toastHelper.showToast('Please upload a valid video file.');
    }
  };

  const handleChapterVideoChange = () => {
    if (!chapterVideo) {
      toastHelper.showToast("select a video");
      return
    }

   axiosPrivate.patch(`/teacher/chapterVideo/${chapterId}`,{chapterVideo},{
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then((res)=>{
    console.log(res.data?.message);  
    toastHelper.showToast(res.data?.message)
    setFetch(true);
    closeChapterModal()
  })
  .catch((err)=>{
    console.log(err);
    // toastHelper.showToast(err?.response?.data?.message)
  })

  }

  const handleEditChapter = () =>{
    if(chapterValues.index == chapter.index && chapterValues.title == chapter.title){
      toastHelper.showToast("values not changed")
      return
    }

    if(chapterValues.index == "" || chapterValues.title == ""){
      toastHelper.showToast("Fill the form")
      return
    }

    const putData = {...chapterValues}
    axiosPrivate.put(`/teacher/chapter/${chapterId}`,putData)
    .then((res)=>{
      setMessage(res.data?.message)
      console.log(res.data?.message);  
      toastHelper.showToast(res.data?.message)
      setFetch(true)
    })
    .catch((err)=>{
      console.log(err);
      toastHelper.showToast(err?.response?.data?.message)
    })

    closeModal()

  }

  useEffect(() => {
    axiosPrivate.get(`/teacher/chapter/${chapterId}`)
      .then((res) => {
        console.log(res.data.chapter);
        setChapter(res.data.chapter);
        
      })
      .catch((err) => {
        console.log(err);
      })

      return ()=> setFetch(false);
  }, [message, fetch]);

  const handleChapterValuesChanges = (e) => {
    setChapterValues({ ...chapterValues, [e.target.name]: e.target.value.trim() })
  }

  return (
    <>
      <div className='w-screen h-screen overflow-hidden'>
        <TeacherNavbar />
        <div className='w-full h-full px-4 pt-5 bg-white flex flex-col justify-start items-center gap-5'>
          <div className='max-h-[150px] px-2'>
            <div className='capitalize text-center text-3xl md:text-4xl font-semibold flex justify-center break-all'>{chapter && chapter.title}</div>
          </div>
          <video width="640" height="360" controls key={chapter?.video?.url}>
            {chapter?.video?.url && <source src={chapter.video.url} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
          <div className='w-full flex items-center justify-center gap-5 '>
            <Button className='' onClick={openChapterModal}>Change video</Button>
            <Button className='' onClick={openModal}>Edit Details</Button>
          </div>
        </div>
        <Toaster />
      </div>

      {/* change video */}
      <Transition appear as={Fragment} show={isChapterOpen}>
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
                    Change Video
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
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
                      onClick={handleChapterVideoChange}
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
      
      {/* edit chapter */}
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
                    Edit Chapter
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input label="Title" name='title' value={chapterValues.title} onChange={handleChapterValuesChanges} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleEditChapter}
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

export default ChapterDetails
