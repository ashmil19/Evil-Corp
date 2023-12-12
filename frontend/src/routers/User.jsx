import { Routes, Route } from 'react-router-dom'

import Home from '../pages/user/Home'
import UserProfile from '../pages/user/UserProfile'
import Course from '../pages/user/Course'

function User() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/course" element={<Course />} />
    </Routes>
  )
}

export default User