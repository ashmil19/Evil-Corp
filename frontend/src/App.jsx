import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Layout from "./components/features/Layout"

import Login from "./pages/auth/Login"
import Registration from "./pages/auth/Registration"
import User from "./routers/user"
import Admin from "./routers/Admin"
import Teacher from "./routers/Teacher"
import Home from "./pages/user/Home"


function App() {

  return (
    <div className="font-poppins">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/user/*" element={<User />} />
            <Route path="/teacher/*" element={<Teacher />} />
            <Route path="/admin/*" element={<Admin />} />

            <Route path="/signup" element={<Registration />} />
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
