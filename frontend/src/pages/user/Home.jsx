import React from 'react'
import { Button } from '@material-tailwind/react'

import Navbar from '../../components/navbars/navbar'
import CourseComponent from '../../components/user/CourseComponent'
import HomeHeading from '../../components/user/HomeHeading'

import HomeLogo from '../../asset/home.svg'
import Sql from '../../asset/sql.jpg'
import osint from '../../asset/osint.jpg'
import malware from '../../asset/malware.jpg'
import pentest from '../../asset/pentest.jpg'

function Home() {
  return (
    <div className='w-screen h-screen overflow-x-hidden'>
     <Navbar text="Login" />
    <div className='w-full h-full'>
        <hr class="border-t-1 border-white shadow-md shadow-white" />
        <div style={{ borderRadius: "0 0 6rem 0" }} className='w-full h-homeBanner-sm md:h-homeBanner bg-custom-bg-color flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 h-2/3 md:h-full flex justify-end items-center'>
                <img className='w-full h-full md:h-5/6' src={HomeLogo} alt="" />
            </div>
            <div className='w-full md:w-1/2 h-1/3 md:h-full flex justify-center items-center'>
                <div className='text-3xl md:text-4xl text-white w-3/4 md:w-2/4'>Learn Your Favorite Course From Online</div>
            </div>
        </div>
        <div className='w-full px-8'>
            <div className='w-full py-5'>
                <div className='w-full md:w-1/2 flex flex-col gap-5'>
                    <div className='text-3xl w-full md:w-3/4'>Over 7000 Tutorials From 20 Courses</div>
                    <p className='text-xs w-full md:w-3/4 leading-5'>Our set he for firmament morning sixth subdue darkness creeping gathered divide our let god moving. Moving in fourth air night bring upon you’re it beast let you dominion likeness open place day great wherein heaven sixth lesser subdue fowl</p>
                    <div className='w-full'>
                        <Button variant='filled' className='bg-custom-cyan text-white text-xs font-medium px-8 rounded-full'>Enroll</Button>
                    </div>
                </div>
            </div>
        </div>
        <div className='w-full h-homeBanner md:h-96 px-8 flex flex-col gap-2 py-6'>
            <HomeHeading title='Course Categories' />
            <div className='h-full flex flex-col md:flex-row gap-2'>
                <div className='h-2/3 md:h-full w-full md:w-2/3 flex flex-col gap-2'>
                    <div style={{backgroundImage: `url(${osint})`}} className='h-1/3 md:h-1/2 w-full bg-cover bg-no-repeat bg-center flex justify-end items-end hvr-shrink'>
                        <div className='bg-white w-1/3 md:w-1/6 flex justify-center items-center py-2 border-r-2 border-r-black border-b-2 border-b-black'>OSINT</div>
                    </div>
                    <div className='h-2/3 md:h-1/2 w-full flex flex-col md:flex-row gap-2'>
                        <div style={{backgroundImage: `url(${malware})`}} className='h-full w-full md:w-1/2 bg-cover bg-center flex justify-end items-end hvr-shrink'>
                            <div className='bg-white w-2/3 md:w-2/3 flex justify-center items-center py-2 border-r-2 border-r-black border-b-2 border-b-black'>Malware Analysis</div>
                        </div>
                        <div style={{backgroundImage: `url(${pentest})`}} className='h-full w-full md:w-1/2 bg-cover bg-center flex justify-end items-end hvr-shrink'>
                            <div className='bg-white w-2/3 md:w-2/3 flex justify-center items-center py-2 border-r-2 border-r-black border-b-2 border-b-black'>Pen Testing</div>
                        </div>
                    </div>
                </div>
                <div className='h-1/4 md:h-full w-full md:w-1/3 bg-cover bg-center flex justify-end items-end hvr-grow' style={{backgroundImage: `url(${Sql})`}}>
                    <div className='bg-white w-2/3 md:w-2/3 flex justify-center items-center py-2 border-r-2 border-r-black border-b-2 border-b-black'>SQL Injection</div>
                </div>
            </div>
        </div>

        <div className='w-full px-8 py-5 flex flex-col gap-6'>
            <HomeHeading title='popular courses' />
            <div className='w-full text-xs flex justify-center items-start text-center'>
                <div className='w-4/5 md:w-1/3'>Your domain control panel is designed for ease-of-use and allows for all aspects of your domains.</div>
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
                <CourseComponent />
                <CourseComponent />
                <CourseComponent />
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
                <CourseComponent />
                <CourseComponent />
                <CourseComponent />
            </div>
        </div>
    </div>
    </div>
  )
}

export default Home