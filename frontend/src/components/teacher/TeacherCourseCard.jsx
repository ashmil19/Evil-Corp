import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Switch } from '@headlessui/react'
import { useNavigate } from  'react-router-dom'


import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const profilePic1 = 'https://getwallpapers.com/wallpaper/full/8/f/8/562880.jpg';

const TeacherCourseCard = ({ course, onclick, setFetch}) => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const toastHelper = new ToastHelper()
  const [enabled, setEnabled] = useState(course?.isPublished);

 

   const handlePublishCourse = () =>{
      setEnabled(!enabled)
      axiosPrivate.patch(`/teacher/changePublish/${course._id}`,{isPublished: course.isPublished})
      .then((res)=>{
        // res?.data.updatedCourse?.isPublished
        // ? navigate('/teacher/publicCourse')
        // : navigate('/teacher/uploadCourse')  
        setFetch(true)      
      })
      .catch((err)=>{
        console.log(err);
      })
   }


  return (
    <div className='h-56 w-64'>
        <div className="h-3/4 w-full bg-gray-400 rounded-t-lg bg-cover bg-center cursor-pointer" onClick={onclick} >
            <img className="w-full h-full object-cover rounded-t-lg" src={course ? course?.coverImage?.url : profilePic1} alt="" />
        </div>
        <div className="h-1/4 w-full bg-gray-300 rounded-b-lg flex justify-center items-center gap-4 font-bold text-base">
            <div>
              {course && course?.title}
            </div>
            {/* <label className='flex gap-3 items-center text-xs' htmlFor="sldfa"> */}
              <Switch
                checked={enabled}
                onChange={handlePublishCourse}
                name='isTeacher'
                className={`${enabled ? 'bg-gray-800' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-gray-400`}
              >
                {/* <span className="sr-only">Enable notifications</span> */}
                <span
                  className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-gray-400 transition`}
                />
              </Switch>
              {/* sign up as teacher
            </label> */}
        </div>
    </div>
  )
}

export default TeacherCourseCard
