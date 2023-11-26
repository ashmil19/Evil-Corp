import { Routes, Route } from 'react-router-dom'

import Home from '../pages/user/Home'

function User() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default User