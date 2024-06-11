import React, { useEffect, useState, Fragment } from 'react'
import { FiEdit } from 'react-icons/fi'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Textarea, Select, Option } from '@material-tailwind/react'
import { Dialog, Transition } from '@headlessui/react'
import { Toaster } from 'react-hot-toast'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ToastHelper from '../../helper/ToastHelper'
import Navbar from '../../components/navbars/Navbar.jsx'
import profileImg from '../../asset/person.svg'
import { updateUser } from '../../features/authSlice'
import { Link } from 'react-router-dom'

// const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';
// const profilePic = '../../';


const UserProfile = () => {
  const dispatch = useDispatch()
  const toastHelper = new ToastHelper()
  const axiosPrivate = useAxiosPrivate()
  const authState = useSelector((state) => state.auth)

  const [isOpen, setIsOpen] = useState(false)
  const [isOldPasswordOpen, setIsOldPasswordOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const [oldPassword, setOldPassword] = useState(null)
  const [password, setPassword] = useState(null)
  const [rePassword, setRePassword] = useState(null)

  const [editValues, setEditValues] = useState({
    fullname: authState.user,
  })

  const handleEditClick = () => {
    document.getElementById('imageInput').click()
  }

  const uploadImage = () => {
    const postData = {
      id: userData._id,
      image,
    }
    
    axiosPrivate.post("/user/uploadImage", postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((res) => {
        setImage(null)
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const checkOldPassword = () =>{
    const postData = {
      password: oldPassword,
      userId: userData._id
    }
    axiosPrivate.post("/user/checkPassword",postData)
    .then((res)=>{
      console.log("dslfa");
      openPasswordModal()
      openOldPasswordModal()
    })
    .catch((err)=>{
      toastHelper.showToast(err?.response?.data?.message);
    })
  }

  const changePassword = () =>{
    if(password !== rePassword){
      toastHelper.showToast("Password does not match")
      return;
    }
    const postData = {
      password: password,
      userId: userData._id
    }

    axiosPrivate.post("/user/changePassword",postData)
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      toastHelper.showToast(err?.response?.data?.message)
    })
    
    closePasswordModal();

  }

  const getBackgroundImage = () => {
    if (image) {
      return URL.createObjectURL(image);
    } else if (userData?.profileImage?.url) {
      return userData.profileImage.url;
    } else {
      return profileImg;
    }
  };

  const handleEdit = () => {
    if (editValues.fullname.trim() === "") {
      toastHelper.showToast("field is empty")
      return
    }
    if (editValues.fullname === authState.user) {
      toastHelper.showToast("provided fullname is same previous fullname")
      return
    }

    axiosPrivate.patch(`/user/profile/${authState.userId}`, { fullname: editValues.fullname })
      .then((res) => {
        const userCredentials = {user: editValues.fullname}
        dispatch(updateUser(userCredentials))
        setIsOpen(false)
        toastHelper.showToast(res.data.message)
      })
      .catch((err) => {
        console.log(err);
        toastHelper.showToast("something went wrong");
      })
  }


  function closeModal() {
    setIsOpen(false)
  }

  function closeOldPasswordModal() {
    setIsOldPasswordOpen(false)
  }

  function closePasswordModal() {
    setIsPasswordOpen(false)
  }

  function openModal() {
    setEditValues({ ...editValues, fullname: userData.fullname })
    setIsOpen(true)
  }

  function openOldPasswordModal() {
    setIsOldPasswordOpen(true)
  }

  function openPasswordModal() {
    setIsPasswordOpen(true)
  }

  const handleChanges = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value.trim() })
  }

  useEffect(() => {
    axiosPrivate.get(`/user/profile?userId=${authState.userId}`)
      .then((res) => {
        setUserData(res?.data?.user)
        // setEditValues({...editValues, fullname: res?.data?.user?.fullname})
        // console.log(res?.data?.user);
        console.log("1");
      })

  }, [isOpen, image]);

  return (
    <>
      <div className='w-screen h-screen overflow-hidden'>
        <Navbar />
        <div className='w-full h-full bg-gray-300 py-3.5 px-10 flex justify-center items-center'>

          <div className="w-full flex items-center justify-center h-3/4 md:h-2/3 flex-wrap ">
            <div id="profile" className="w-full lg:w-2/3 h-full flex items-center shadow-2xl bg-white opacity-75">
              <div className="p-4 md:p-12 w-full text-center lg:text-left ">
                <div
                  className=" lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center relative flex  justify-between items-start"
                  style={{ backgroundImage: `url(${getBackgroundImage()})` }} >

                  <FiEdit className="text-blue-500 text-2xl hover:text-blue-700" onClick={handleEditClick} />
                  {image && <IoIosCheckmarkCircleOutline className="bg-transparent opacity-60 text-red-800 text-2xl hover:opacity-100 block lg:hidden cursor-pointer" />}
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>

                <h1 className="text-xl lg:text-3xl font-bold pt-8 lg:pt-0">{userData && userData.fullname}</h1>

                <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
                  <svg className="h-4 fill-current text-green-700 pr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21,4H3A2,2 0 0,0 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6A2,2 0 0,0 21,4M21,6L12,11L3,6H21M3,18V8L12,13L21,8V18H3Z" />
                  </svg>
                  {userData ? userData.email : ""}
                </p>

                {/* <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                    <svg className="h-4 fill-current text-green-700 pr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 0a7.44 7.44 0 0 1 5.3 2.2 7.48 7.48 0 0 1 2.2 5.3c0 4-3.4 7.2-7.5 7.2S2.5 11.5 2.5 7.3 5.9 0 10 0zM10 18c-4.9 0-9-3.9-9-9s4.1-9 9-9 9 3.9 9 9-4.1 9-9 9z"></path>
                      <path d="M10 4.2a4.8 4.8 0 0 0-4.8 4.8c0 2.7 2.2 4.8 4.8 4.8s4.8-2.2 4.8-4.8-2.2-4.8-4.8-4.8zm0 8.6a3.8 3.8 0 0 1-3.8-3.8 3.8 3.8 0 0 1 3.8-3.8 3.8 3.8 0 0 1 3.8 3.8 3.8 3.8 0 0 1-3.8 3.8z"></path>
                    </svg>
                    Username: userData.userName
                  </p> */}
                {/* <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                    <svg className="h-4 fill-current text-green-700 pr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M10 0a7.44 7.44 0 0 1 5.3 2.2 7.48 7.48 0 0 1 2.2 5.3c0 4-3.4 7.2-7.5 7.2S2.5 11.5 2.5 7.3 5.9 0 10 0zM10 18c-4.9 0-9-3.9-9-9s4.1-9 9-9 9 3.9 9 9-4.1 9-9 9z"></path>
                      <path d="M10 4.2a4.8 4.8 0 0 0-4.8 4.8c0 2.7 2.2 4.8 4.8 4.8s4.8-2.2 4.8-4.8-2.2-4.8-4.8-4.8zm0 8.6a3.8 3.8 0 0 1-3.8-3.8 3.8 3.8 0 0 1 3.8-3.8 3.8 3.8 0 0 1 3.8 3.8 3.8 3.8 0 0 1-3.8 3.8z"></path>
                    </svg>
                    Phone: userData.phoneNumber
                  </p> */}

                {/* <ChangePasswordModal isOpen={isModalOpen} onRequestClose={closeModal} />  */}
                {/* <EditDetailsModal isOpen={isEditModalOpen} onRequestClose={editCloseModal} userData={userData}/> */}
                <div className="pt-12 pb-8 flex flex-col md:flex-row gap-2 md:gap-0 justify-between">
                  <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full" onClick={openOldPasswordModal} >Change password</button>
                  <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full" onClick={openModal}  >Edit details</button>

                </div>
                <div className='flex justify-between'>
                  <Link to="/user/myCourse"><p className='font-semibold'>My-Courses</p></Link>
                  <Link to="/user/myblog"><p className='font-semibold'>My-Blogs</p></Link>
                </div>
              </div>
            </div>
            <div className="w-1/3 h-full bg-gray-800 hidden lg:block">
              <div style={{ backgroundImage: `url(${getBackgroundImage()})` }} className="w-full h-full bg-cover bg-no-repeat bg-center flex flex-col items-end justify-start" >
                <FiEdit className=" bg-gray-500 opacity-60 text-black text-2xl hover:opacity-100 hidden lg:block cursor-pointer" onClick={handleEditClick} />
                {image && <IoIosCheckmarkCircleOutline className="bg-gray-200 opacity-60 text-red-800 text-2xl hover:opacity-100 hidden lg:block cursor-pointer" onClick={uploadImage} />}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />

              </div>
            </div>
          </div>


        </div>
      </div>

      {/* edit details */}
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
                    Edit Details
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input label="fullname" name='fullname' value={editValues.fullname} onChange={handleChanges} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleEdit}
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

      {/* old password */}
      <Transition appear show={isOldPasswordOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeOldPasswordModal}>
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
                    Old Password
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input label="Old Password" name='oldPassword' onChange={(e)=> setOldPassword(e.target.value)} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={checkOldPassword}
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

      {/* change password */}
      <Transition appear show={isPasswordOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closePasswordModal}>
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
                    Change Password
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input label="New Password" name='newPassword' onChange={(e)=> setPassword(e.target.value)} />
                    <Input label="Re New Password" name='reNewPassword' onChange={(e)=> setRePassword(e.target.value)} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={changePassword}
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

export default UserProfile
