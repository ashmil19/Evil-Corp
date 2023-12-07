import React, { useEffect, useState } from 'react'
import { FiEdit } from 'react-icons/fi'
import { IoIosCheckmarkCircleOutline  } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { Input } from '@material-tailwind/react'
 
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Navbar from '../../components/navbars/navbar'
import profileImg from '../../asset/person.svg'

// const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';
// const profilePic = '../../';


const UserProfile = () => {
  const [image, setImage] = useState(null)
  const [userData, setUserData] = useState({})
  const axiosPrivate = useAxiosPrivate()
  const authState = useSelector((state)=> state.auth)

  useEffect(() => {
    
    axiosPrivate.get(`/user/profile?userId=${authState.userId}`)
    .then((res)=>{
      setUserData(res?.data?.user)
      console.log(res?.data?.user);
    })
    
  }, []);


  const handleEditClick  = ()=>{
    document.getElementById('imageInput').click()
  }

  return (
    <div className='w-screen h-screen overflow-hidden'>
      <Navbar />
      <div className='w-full h-full bg-gray-300 py-3.5 px-10 flex justify-center items-center'>
      
            <div className="w-full flex items-center justify-center h-3/4 md:h-2/3 flex-wrap ">
              <div id="profile" className="w-full lg:w-2/3 h-full flex items-center shadow-2xl bg-white opacity-75">
                <div className="p-4 md:p-12 w-full text-center lg:text-left ">
                  <div
                      className=" lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center relative flex  justify-between items-start"
                      style={{backgroundImage: `url(${image ? URL.createObjectURL(image) : profileImg})`}} >
                                                                           
                      <FiEdit className="text-blue-500 text-2xl hover:text-blue-700" onClick={handleEditClick} />
                      {image && <IoIosCheckmarkCircleOutline  className="bg-transparent opacity-60 text-red-800 text-2xl hover:opacity-100 block lg:hidden cursor-pointer"  />}
                      <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        className="hidden"
                        onChange={(e)=> setImage(e.target.files[0])}
                      />
                  </div>
    
                  <h1 className="text-xl lg:text-3xl font-bold pt-8 lg:pt-0">{userData ? userData.fullname : ""}</h1>
    
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
                    <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"  >Change password</button>
                    <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"  >Edit details</button>
                    
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-semibold'>My-Courses</p>
                    <p className='font-semibold'>My-Blogs</p>
                    {/* <span>My-Blogs</span> */}
                  </div>
                </div>
              </div>
              <div className="w-1/3 h-full bg-gray-800 hidden lg:block">
                <div style={{backgroundImage: `url(${image ? URL.createObjectURL(image) : profileImg})`}} className="w-full h-full bg-cover bg-no-repeat bg-center flex flex-col items-end justify-start" >
                  <FiEdit className=" bg-gray-500 opacity-60 text-black text-2xl hover:opacity-100 hidden lg:block cursor-pointer" onClick={handleEditClick}  />
                  {image && <IoIosCheckmarkCircleOutline  className="bg-gray-200 opacity-60 text-red-800 text-2xl hover:opacity-100 hidden lg:block cursor-pointer"  />}
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e)=> setImage(e.target.files[0])}
                  />
                  
                </div>
              </div>
            </div>
          

      </div>
    </div>
  )
}

export default UserProfile
