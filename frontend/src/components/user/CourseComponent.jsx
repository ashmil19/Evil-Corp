import React from 'react'
import 'hover.css/css/hover-min.css';

import cyberSecurity from '../../asset/cyberSecurity.jpg' 

function CourseComponent({className , course, onclick}) {
    // console.log(course);
    return (
        <div className={className ? className : 'h-64 w-full md:w-2/4 cursor-pointer hvr-grow shadow-lg'} onClick={onclick}>
            <div className='h-2/3 bg-cover bg-center' style={{backgroundImage: `url(${course?.coverImage ? course.coverImage.url : cyberSecurity})`}}></div>
            <div className='h-1/3 flex flex-col gap-2 items-start justify-center pl-6'>
                <div className='text-verySmall md:text-xs font-medium w-full '>{course?.title ? course.title : 'Cyber Security Training for Absolute Beginners'}</div>
                <div className='text-verySmall md:text-xs'>{course?.category?.name && course.category.name }</div>
                <div className='text-verySmall md:text-xs'>&#x20B9;{course?.price }</div>
            </div>
        </div>
    )
}

export default CourseComponent