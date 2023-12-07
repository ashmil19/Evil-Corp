import React from 'react'
import { FaSearch } from 'react-icons/fa'

import AdminNavbar from '../../components/navbars/AdminNavbar'
import TeacherCard from '../../components/admin/TeacherCard'
import SimplePagination from '../../components/common/SimplePagination'

const TeacherManagement = () => {
  return (
    <div className='w-screen h-screen overflow-x-hidden'>
        <AdminNavbar />
        <div className='w-full h-full bg-dashboard-bg'>
            <div className='w-full px-6 h-24 bg-dashboard-bg flex justify-center items-center'>
                <div className='w-full h-2/3 bg-teacher-card-bg flex items-center justify-end px-4'>
                    <div className='flex '>
                        <div className='w-14 h-10 rounded-l-md bg-black flex justify-center items-center'>
                            <FaSearch className='text-blue-500' />
                        </div>
                        <input
                        type="text"
                        placeholder="Search..."
                        className="p-2 rounded-r-md w-full md:w-64 text-white text-verySmall-1 bg-dashboard-bg outline-none"
                        />
                    </div>
                </div>
            </div>
            <div className='w-full h-auto bg-dashboard-bg flex items-center justify-center flex-wrap gap-4 py-2 px-2'>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(()=>{

                    return <TeacherCard />

                })
                }
                

            </div>
            <div className='w-full h-24 bg-dashboard-bg flex items-center justify-center'>
                <SimplePagination />
            </div>
        </div>
    </div>
  )
}

export default TeacherManagement
