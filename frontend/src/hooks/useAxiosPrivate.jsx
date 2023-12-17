import { useEffect } from 'react';
import { useSelector } from 'react-redux'

import { axiosPrivate } from '../helper/axios'
import useRefreshToken from './useRefreshToken'
import useLogout from './useLogout';

const useAxiosPrivate = () => {
    const logout = useLogout()
    const refresh = useRefreshToken();
    const authState = useSelector((state) => state.auth)


    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authState?.accessToken}`
                }

                return config;
            }, (error) => Promise.reject(error)
        )


        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;

                if (error?.response?.status === 401 && error?.response?.data?.access){
                    await logout()
                    return 
                }

                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    const newConfig = {
                        ...prevRequest,
                        headers: {
                            ...prevRequest.headers,
                            'Authorization': `Bearer ${newAccessToken}`
                        }
                    }
                    // prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(newConfig)
                }
                
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }


    }, [authState, refresh]);

    return axiosPrivate;

}

export default useAxiosPrivate
