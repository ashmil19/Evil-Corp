import React from 'react'
import {Routes, Route} from 'react-router-dom'
import AdminHome from '../pages/admin/AdminHome'

function Admin() {
  return (
    <Routes>
        <Route path='/' element={<AdminHome/>} />
    </Routes>
  )
}

export default Admin