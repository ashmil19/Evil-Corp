import React from 'react'
import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import { Button } from '@material-tailwind/react'

const ChapterDetails = () => {
  return (
    <div className='w-screen h-screen overflow-hidden'>
        <TeacherNavbar />
        <div className='w-full h-full px-4 bg-white flex flex-col justify-center items-center gap-5'>
            <div className='text-center text-3xl md:text-veryLarge font-semibold'>This is sample Heading</div>
            <video width="640" height="360" controls>
              <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className='w-full flex items-center justify-center gap-5 '>
              <Button className=''>Change video</Button>
              <Button className=''>Edit Details</Button>
            </div>
        </div>
    </div>
  )
}

export default ChapterDetails
