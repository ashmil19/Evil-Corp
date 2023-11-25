import React from 'react'
import 'hover.css/css/hover-min.css';

import cyberSecurity from '../../asset/cyberSecurity.jpg' 

function CourseComponent() {
    return (
        <div className='h-64 w-full md:w-2/4 cursor-pointer hvr-grow shadow-lg'>
            <div className='h-2/3 bg-cover bg-center' style={{backgroundImage: `url(${cyberSecurity})`}}></div>
            <div className='h-1/3 flex flex-col gap-2 items-start justify-center pl-6'>
                <div className='text-verySmall md:text-xs'>Cyber Security</div>
                <div className='text-xs md:text-sm font-medium w-full md:w-2/3'>Cyber Security Training for Absolute Beginners</div>
            </div>
        </div>
    )
}

export default CourseComponent