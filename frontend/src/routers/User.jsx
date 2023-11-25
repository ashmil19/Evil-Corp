import { Routes, Route } from 'react-router-dom'

import Login from '../pages/auth/Login'
import Registration from '../pages/auth/Registration'
import Home from '../pages/user/Home'

function User() {
  return (
   <div>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
   </div>
  )
}

export default User