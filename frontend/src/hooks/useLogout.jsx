import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logOut } from '../features/authSlice';
import axios from '../helper/axios'

function useLogout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logout = async () => {
        try {

            await axios.get("/logout");
            console.log("success");
            dispatch(logOut())
            navigate('/login')

        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    return logout;
}

export default useLogout
