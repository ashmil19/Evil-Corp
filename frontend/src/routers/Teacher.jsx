import React from 'react'
import {Routes, Route} from 'react-router-dom'
import TeacherHome from '../pages/teacher/TeacherHome'
import TeacherProfile from '../pages/teacher/TeacherProfile'

function Teacher() {
  return (
    <Routes>
        <Route path='/' element={<TeacherHome/>}/>
        <Route path='/profile' element={<TeacherProfile/>}/>
    </Routes>
  )
}

export default Teacher