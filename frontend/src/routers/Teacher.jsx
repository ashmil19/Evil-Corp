import React from 'react'
import {Routes, Route} from 'react-router-dom'
import TeacherHome from '../pages/teacher/TeacherHome'
import TeacherProfile from '../pages/teacher/TeacherProfile'
import UploadCourse from '../pages/teacher/UploadCourse'
import CourseDetails from '../pages/teacher/CourseDetails'

function Teacher() {
  return (
    <Routes>
        <Route path='/' element={<TeacherHome/>}/>
        <Route path='/profile' element={<TeacherProfile/>}/>
        <Route path='/uploadCourse' element={<CourseDetails />}/>
    </Routes>
  )
}

export default Teacher