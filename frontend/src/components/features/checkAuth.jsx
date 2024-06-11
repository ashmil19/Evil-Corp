import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function checkAuth() {
    const authstate = useSelector((state)=> state.auth)
    const location = useLocation();

  return (
    authstate?.accessToken === null
    ? <Outlet state={{from: location}} />
    : authstate?.role[0] === 1000
    ? <Navigate to="/admin" state={{ from: location }} replace />
    : authstate?.role[0] === 3000
    ? <Navigate to="/teacher" state={{ from: location }} replace />
    : <Navigate to="/user" state={{ from: location }} replace />
  )
}

export default checkAuth