import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Layout from "./components/features/Layout"

import Login from "./pages/auth/Login"
import Registration from "./pages/auth/Registration"
import User from "./routers/user"
import Admin from "./routers/Admin"
import Teacher from "./routers/Teacher"
import Home from "./pages/user/Home"
import RequireAuth from "./components/features/RequireAuth"
import CheckAuth from "./components/features/checkAuth"
import OtpComponent from "./components/auth/OtpComponent"
import ForgotPasswordOtp from "./components/auth/ForgotPasswordOtp"
import NewPassword from "./pages/auth/NewPassword"
import Blog from "./pages/user/Blog"
import MyBlog from "./pages/user/MyBlog"
import BlogDetails from "./pages/user/BlogDetails"
import ChapterDetails from "./pages/user/ChapterDetails"
import UserChat from "./pages/user/UserChat"

const ROLES = {
  'User' : 2000,
  'Teacher' : 3000,
  'Admin' : 1000
}

function App() {

  return (
    <div className="font-poppins">
        <Routes>
          <Route path="/" element={<Layout />} >

            {/* <Route path="/" element={<UserChat />} /> */}
            
            <Route element={<CheckAuth />}>
              <Route path="/signup" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<OtpComponent/>} />
              <Route path="/forgotpassword" element={<ForgotPasswordOtp/>} />
              <Route path="/newpassword" element={<NewPassword />} />
            </Route>


            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="/user/*" element={<User />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Teacher]} />}>
              <Route path="/teacher/*" element={<Teacher />} />
            </Route>
            
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="/admin/*" element={<Admin />} />
            </Route>

          </Route>
        </Routes>
    </div>
  )
}

export default App
