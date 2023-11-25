import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import User from './routers/User'


function App() {

  return (
    <div className="font-poppins">
      <Router>
        <Routes>
          <Route path="/*" element={<User />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
