import React from 'react'
import {Routes, Route} from 'react-router-dom'
import TeacherHome from '../pages/teacher/TeacherHome'

function Teacher() {
  return (
    <Routes>
        <Route path='/' element={<TeacherHome/>}/>
    </Routes>
  )
}

export default Teacher