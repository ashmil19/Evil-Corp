import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from  'react-router-dom'

import TeacherCourseCard from '../../components/teacher/TeacherCourseCard'
import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const PublicCourse = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()
    const navigate = useNavigate()
    const [courses, setCourses] = useState(null)
    const [fetch, setFetch] = useState(false)

    useEffect(() => {
        axiosPrivate.get("/teacher/myCourse")
        .then((res)=>{
            console.log(res?.data?.courses);
            setCourses(res?.data?.courses)
        })
        .catch((err)=>{
            console.log(err);
        })
        
        setFetch(false)
        
    }, [fetch]);

  return (
    <>
        <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
                <TeacherNavbar />

                <div className='w-full h-full bg-dashboard-bg flex flex-col gap-8'>
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
                        {courses?.length !== 0 ? courses?.map((course) => {
                            return <TeacherCourseCard key={course._id} course={course} setFetch={setFetch}  />
                        }) : <div className='flex justify-center items-center text-white font-semibold'>No My Course Found</div>}
                    </div>
                </div>

            </div> 
    </>
  )
}

export default PublicCourse
