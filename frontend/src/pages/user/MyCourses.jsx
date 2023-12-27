import React, { useEffect, useState } from 'react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import CourseComponent from '../../components/user/CourseComponent';
import Navbar from '../../components/navbars/navbar';

const MyCourses = () => {
    const axiosPrivate = useAxiosPrivate()
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        axiosPrivate.get("/user/myCourse")
            .then((res) => {
                console.log(res.data.courses);
                setCourses(res.data.courses)
            })
            .catch((err) => {
                console.log(err);
            })

    }, []);
    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Navbar />
            <div className='flex gap-4 p-5'>
                {courses && courses.map((course) => {
                    console.log("hh", course._id);
                    return <CourseComponent course={course} className="h-64 w-full md:w-56 cursor-pointer hvr-grow shadow-lg" />
                })}
            </div>
        </div>
    )
}

export default MyCourses
