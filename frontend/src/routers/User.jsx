import { Routes, Route } from 'react-router-dom'

import Home from '../pages/user/Home'
import UserProfile from '../pages/user/UserProfile'
import Course from '../pages/user/Course'
import CourseDetails from '../pages/user/CourseDetails'
import MyCourses from '../pages/user/MyCourses'
import MyBlog from '../pages/user/MyBlog'
import Blog from '../pages/user/Blog'
import BlogDetails from '../pages/user/BlogDetails'
import ChapterDetails from '../pages/user/ChapterDetails'

function User() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/course" element={<Course />} />
      <Route path="/courseDetails" element={<CourseDetails />} />
      <Route path="/chapterDetails" element={<ChapterDetails />} />
      <Route path="/myCourse" element={<MyCourses />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blogDetails" element={<BlogDetails />} />
      <Route path="/myblog" element={<MyBlog />} />
    </Routes>
  )
}

export default User