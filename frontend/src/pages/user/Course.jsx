import React from 'react'
import { FaSearch } from 'react-icons/fa'

import Navbar from '../../components/navbars/navbar'
import CourseComponent from '../../components/user/CourseComponent'
import courseBanner from '../../asset/courseBanner.jpeg'

const Course = () => {
  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <Navbar />
      <div className='w-full h-full px-3 flex flex-col md:flex-row flex-wrap gap-3 justify-start'>
        <div className='h-56 w-full bg-center bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${courseBanner})` }}>
          <div className='font-medium text-4xl text-white'>Courses</div>
        </div>
        <div className='w-full h-20 flex items-center justify-end px-3'>
          <div className='flex '>
            <input
              type="text"
              placeholder="Search..."
              className="p-2 rounded-l-md w-full md:w-64 text-black font-medium text-verySmall-1 bg-gray-400 outline-none"
            />
            <div className='w-14 h-10 rounded-r-md bg-blue-500 flex justify-center items-center'>
              <FaSearch className='bg-blue-500 text-white' />
            </div>
          </div>
        </div>
        {[1, 2, 4, 5, 6, 7, 7].map(() => {
          return <CourseComponent className="h-64 w-full md:w-56 cursor-pointer hvr-grow shadow-lg" />
        })}
      </div>
    </div>
  )
}

export default Course
