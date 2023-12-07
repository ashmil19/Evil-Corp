import { Routes, Route } from 'react-router-dom'

import Home from '../pages/user/Home'
import UserProfile from '../pages/user/UserProfile'

function User() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  )
}

export default User