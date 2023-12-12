import { useEffect, useState } from 'react'
import {FaMailBulk, FaPhone } from 'react-icons/fa';
import { useSelector } from 'react-redux'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import ThreeDotMenu from '../../components/common/ThreeDotMenu';
import ProfileIcon from '../../components/common/ProfileIcon';
import profileImg from '../../asset/person.svg'
import { Button } from '@material-tailwind/react';

const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const TeacherProfile = () => {
  const [image, setImage] = useState(null)
  const [teacherData, setTeacherData] = useState({})
  const axiosPrivate = useAxiosPrivate()
  const authState = useSelector((state)=> state.auth)


  const handleEditClick = () => {
    document.getElementById('imageInput').click()
  } 

  const handleUploadImage = (e) =>{
    setImage(e.target.files[0])

    const postData = {
      id: teacherData._id,
      image: e.target.files[0],
    }

    axiosPrivate.post("/teacher/uploadImage", postData, {
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

  const getBackgroundImage = () => {
    if (image) {
      return URL.createObjectURL(image);
    } else if (teacherData?.profileImage?.url) {
      return teacherData.profileImage.url;
    }else {
      return profileImg;
    }
  };

  useEffect(() => { 
    axiosPrivate.get(`/teacher/profile?userId=${authState.userId}`)
    .then((res)=>{
      setTeacherData(res?.data?.teacher)
      console.log(res?.data?.teacher);
    })
    
  }, [image]);

  return (
    <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
      <TeacherNavbar />
      <div className='w-full h-full bg-gray-300 py-5 px-10 flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-3/4 h-full flex flex-col gap-4'>
          <div className='h-1/2 flex flex-col relative'>
            <div className='bg-profile-card-color h-1/3 rounded-tl-md rounded-tr-md'></div>
            <div className='bg-white h-2/3 rounded-bl-md rounded-br-md'>
              <div className='h-1/4 flex justify-end pr-5 gap-4'>
                {/* <Button className='h-10'>hel</Button> */}
                <ThreeDotMenu />
              </div>
              <div className='h-1/4 pl-5 text-2xl font-semibold flex items-center'>{teacherData ? teacherData.fullname : ""}</div>
              <div className='h-2/4 flex flex-col md:flex-row pl-5'>
                <div className='w-1/2 h-full flex items-center'>
                  <ProfileIcon Icon={<FaMailBulk/>} title='email' subtitle={teacherData ? teacherData.email : ""} />
                </div>
                {/* <div className='w-1/2 h-full flex items-center'>
                  <ProfileIcon Icon={<FaPhone/>} title='phone' subtitle='909876883' />
                </div> */}
              </div>
            </div>
            <div className='bg-white w-24 md:w-28 h-24 md:h-28 rounded-full absolute top-14 md:top-8 left-4 flex items-center justify-center'>
              <div style={{backgroundImage: `url(${getBackgroundImage()})`}} onClick={handleEditClick} className='bg-gray-600 hover:opacity-60 bg-cover bg-center w-20 md:w-24 h-20 md:h-24 rounded-full '>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </div>
            </div>
          </div>
          <div className='bg-white h-1/2 rounded-md'>
            <div className='h-2/3 flex flex-col justify-center gap-2 pl-5'>
              <div className='font-bold'>About</div>
              <div className='text-sm w-3/4'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </div>
            </div>
            <div className='h-1/3 flex flex-col justify-center gap-2 pl-5'>
              <div className='font-semibold text-lg'>Expertise:</div>
              <div className='text-sm'>Bug Bounty</div>
            </div>
          </div>
        </div>
        <div className='bg-grey-500 w-full md:w-1/4 h-1/2 flex flex-col gap-2'>
          <div className='bg-white rounded-md h-1/4 flex flex-col justify-center pl-5'>
            <div className='text-sm font-semibold capitalize'>Recent uploads</div>
            <div className='text-verySmall'>Thursday, 10th April , 2022</div>
          </div>
          <div className='bg-white rounded-md h-2/4'>
            <div className='h-1/2 flex flex-col justify-center pl-5'>
                <div className='text-sm font-medium'>Osint</div>
                <div className='text-verySmall-1'>Lessons: 14</div>
              </div>
              <div className='h-1/2 flex'>
                <div className='w-2/3 flex flex-col justify-center pl-5'>
                  <div className='text-verySmall-1'>July 20, 2023</div>
                  <div className='text-verySmall-1'>Students : 3</div>
                </div>
                <div className='w-1/3 flex justify-center items-center'>
                  <div style={{backgroundImage:`url(${profilePic})`}} className='w-12 h-12 bg-center bg-cover rounded-full'></div>
                </div>
              </div>
          </div>
          <div className='bg-profile-card-color bg-opacity-10 hover:bg-opacity-100 rounded-3xl h-1/6 flex justify-center items-center text-sm text-profile-color hover:text-white cursor-pointer'>View More</div>
        </div>
      </div>
    </div>
  )
}

export default TeacherProfile
