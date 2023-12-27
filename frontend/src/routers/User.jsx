import { Routes, Route } from 'react-router-dom'

import Home from '../pages/user/Home'
import UserProfile from '../pages/user/UserProfile'
import Course from '../pages/user/Course'
import CourseDetails from '../pages/user/CourseDetails'
import MyCourses from '../pages/user/MyCourses'

function User() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/course" element={<Course />} />
      <Route path="/courseDetails" element={<CourseDetails />} />
      <Route path="/myCourse" element={<MyCourses />} />
    </Routes>
  )
}

export default User