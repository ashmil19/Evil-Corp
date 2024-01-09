import React from 'react'
import {Routes, Route} from 'react-router-dom'
import TeacherHome from '../pages/teacher/TeacherHome'
import TeacherProfile from '../pages/teacher/TeacherProfile'
import UploadCourse from '../pages/teacher/UploadCourse'
import CourseDetails from '../pages/teacher/CourseDetails'
import ChapterDetails from '../pages/teacher/ChapterDetails'
import TeacherChat from '../pages/teacher/TeacherChat'

function Teacher() {
  return (
    <Routes>
        <Route path='/' element={<TeacherHome/>}/>
        <Route path='/profile' element={<TeacherProfile/>}/>
        <Route path='/uploadCourse' element={<UploadCourse />}/>
        <Route path='/courseDetails' element={<CourseDetails />}/>
        <Route path='/chapterDetails' element={<ChapterDetails />}/>
        <Route path='/chat' element={<TeacherChat />}/>
    </Routes>
  )
}

export default Teacher