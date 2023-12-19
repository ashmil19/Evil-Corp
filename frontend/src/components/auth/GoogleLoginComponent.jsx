import React from 'react'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { decodeJwt } from 'jose';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast'

import ToastHelper from '../../helper/ToastHelper'
import axios from '../../helper/axios'
import { setCredentials } from '../../features/authSlice';


const GoogleLoginComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toastHelper = new ToastHelper()
    
    const handleGoogleLogin = (credentialResponse)=>{
        try {
            const { credential } = credentialResponse;
            const payload = credential ? decodeJwt(credential) : undefined;

            if(payload){
                axios.post("/login/google",{payload},{
                    withCredentials: true,
                    credentials: 'include'
                })
                .then((res)=>{
                    console.log(res);
                    const userCredentials = {
                        user: res.data.fullname,
                        userId: res.data.userId,
                        accessToken: res.data.accessToken,
                        role: res.data.role
                    }
                    dispatch(setCredentials(userCredentials))
                    res.data.role === 3000 ? navigate('/teacher') : navigate('/')
                })
                .catch((err)=>{
                    toastHelper.showToast(err?.response?.data?.message);
                })
                
            }
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <>
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
      <GoogleLogin
     
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </GoogleOAuthProvider>

      <Toaster />
    </>

  )
}

export default GoogleLoginComponent
