import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Layout from "./components/features/Layout"
import "./App.css"
import Login from "./pages/auth/Login"
import Registration from "./pages/auth/Registration"
import User from "./routers/User"
import Admin from "./routers/Admin"
import Teacher from "./routers/Teacher"
import Home from "./pages/user/Home"
import RequireAuth from "./components/features/RequireAuth"
import CheckAuth from "./components/features/checkAuth"
import OtpComponent from "./components/auth/OtpComponent"
import ForgotPasswordOtp from "./components/auth/ForgotPasswordOtp"
import NewPassword from "./pages/auth/NewPassword"
import { stopIsProgressLoading } from "./features/socketSlice"
import { useEffect } from "react"
import io from "socket.io-client";
import { useDispatch } from "react-redux";

const ROLES = {
  'User' : 2000,
  'Teacher' : 3000,
  'Admin' : 1000
}

const socket = io("evilcorp.ashmil.shop", {
  transports: ["websocket", "polling"],
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("videoUpload", (data) => {
      if (data?.isVideoUploaded) {
        dispatch(
          stopIsProgressLoading({ isProgress: false, courseId: data?.courseId }),
        );
      }
    });

    // const handleChapterUploadSocket = (data) => {
    //   dispatch(handleChapterUpload(data));
    // };

    // socket.on("videoUpload", handleChapterUploadSocket);

    return () => {
      socket.off("videoUpload");
    };
  }, [dispatch]);

  return (
    <div className="font-poppins">
        <Routes>
          <Route path="/" element={<Layout />} >

            
            <Route element={<CheckAuth />}>
              <Route path="/" element={<Home />} />
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
