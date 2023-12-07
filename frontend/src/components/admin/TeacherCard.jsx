import React from 'react'
import { Button } from "@material-tailwind/react";

const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const TeacherCard = () => {
  return (
    <div className='bg-teacher-card-bg w-64 h-56 rounded-md'>
        <div className='w-full h-2/3'>
            <div className='h-2/3 flex justify-center py-3'>
                <img className='w-1/3 h-full' src={profilePic} alt="" />
            </div>
            <div className='h-2/3 text-white flex flex-col items-center gap-1 capitalize'>
                <div className='text-sm'>Munaroh Steffani</div>
                <div className='text-verySmall'>total Course : 4</div>
            <div className='text-verySmall '>Status : <span className='text-green-500'>Active</span></div>
            </div>
        </div>
        <div className='w-full h-1/3 flex justify-evenly items-center'>
                <Button className='bg-profile-color'>Profile</Button>
                <Button className='bg-teacher-btn'>Profile</Button>
        </div>
    </div>
  )
}

export default TeacherCard
