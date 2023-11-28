import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({allowedRoles})=> {
    const authstate = useSelector((state)=> state.auth)
    const location = useLocation();


    return (
        authstate?.role?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : authstate?.user
            ? <Navigate to={location.state?.from ||  authstate.role[0] === 1000 ? '/admin' : authstate.role[0] === 3000 ? '/teacher' : '/user' } replace />
            : <Navigate to="/login" state={{ from: location.pathname }} replace />
    )
}


export default RequireAuth;