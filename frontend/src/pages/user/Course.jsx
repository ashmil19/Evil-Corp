import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

import Navbar from '../../components/navbars/navbar'
import CourseComponent from '../../components/user/CourseComponent'
import courseBanner from '../../asset/courseBanner.jpeg'
import useAxiosPrivate  from '../../hooks/useAxiosPrivate'


const Course = () => {
  const axiosPrivate = useAxiosPrivate()
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    axiosPrivate.get("/user/course")
    .then((res)=>{
      console.log(res.data.courses);
      setCourses(res.data.courses)
    })
    .catch((err)=>{
      console.log(err);
    })

  }, []);

  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <Navbar />
      <div className='w-full h-full flex flex-col md:flex-row flex-wrap justify-start'>
        <div className='h-48 w-full bg-center bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${courseBanner})` }}>
          <div className='font-medium text-4xl text-white'>Courses</div>
        </div>
        <div className='w-full h-16 flex items-center justify-end px-5'>
          <div className='flex '>
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded-l-md w-full md:w-64 text-black font-medium text-verySmall-1 bg-gray-400 outline-none"
            />
            <div className='w-14 h-9 rounded-r-md bg-blue-500 flex justify-center items-center'>
              <FaSearch className='bg-blue-500 text-white' />
            </div>
          </div>
        </div>
        <div className='flex gap-4 px-5'>
          {courses && courses.map((course) => {
            return <CourseComponent course={course} className="h-64 w-full md:w-56 cursor-pointer hvr-grow shadow-lg" />
          })}
        </div>
      </div>
    </div>
  )
}

export default Course
