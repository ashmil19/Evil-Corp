import React from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminHome from '../pages/admin/AdminHome'
import StudentManagement from '../pages/admin/StudentManagement'
import TeacherManagement from '../pages/admin/TeacherManagement'

function Admin() {
  return (
    <Routes>
        <Route path='/' element={<AdminHome />} />
        <Route path='/students' element={<StudentManagement />} />
        <Route path='/teachers' element={<TeacherManagement />} />
    </Routes>
  )
}

export default Admin