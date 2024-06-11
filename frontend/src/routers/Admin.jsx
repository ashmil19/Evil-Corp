import React from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminHome from '../pages/admin/AdminHome'
import StudentManagement from '../pages/admin/StudentManagement'
import TeacherManagement from '../pages/admin/TeacherManagement'
import CategoryManagement from '../pages/admin/CategoryManagement'
import BlogReportManagement from '../pages/admin/BlogReportManagement'
import Transactions from '../pages/admin/Transactions'

function Admin() {
  return (
    <Routes>
        <Route path='/' element={<AdminHome />} />
        <Route path='/students' element={<StudentManagement />} />
        <Route path='/teachers' element={<TeacherManagement />} />
        <Route path='/category' element={<CategoryManagement />} />
        <Route path='/blogReport' element={<BlogReportManagement />} />
        <Route path='/transactions' element={<Transactions />} />
    </Routes>
  )
}

export default Admin