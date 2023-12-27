import React, { useState } from 'react'
import { Input, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

import ToastHelper from '../../helper/ToastHelper';
import axios from '../../helper/axios'

const NewPassword = () => {
    const navigate = useNavigate()
    const toastHelper = new ToastHelper();
    const location = useLocation();
    const email = location.state && location.state.email;
    const [passwordType, setPasswordType] = useState(true);
    const [rePasswordType, setRePasswordType] = useState(true);

    const [values, setValues] = useState({
        password: "",
        confirmpassword: ""
    })

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value.trim() })
    }

    const handleSubmit = () => {
        const { password, confirmpassword } = values
        if (password.trim() === "" || confirmpassword.trim() === "") {
            toastHelper.showToast("fill the form")
            return
        }

        if (password !== confirmpassword) {
            toastHelper.showToast("password doesnot match")
            return
        }

        const postData = { password: values.password, email }

        axios.post('/changePassword', postData, {
            withCredentials: true,
            credentials: 'include'
        })
            .then((res) => {
                navigate('/login')
                console.log("success");
            })
            .catch((err) => {
                //   toastHelper.showToast(err.response.data.message)
                console.log(err.message);
            })
    }

    return (
        <div className='h-screen w-screen overflow-hidden'>
            <div className=' h-full flex justify-center'>
                <div className='md:w-1/2 w-full flex items-center justify-center flex-col gap-6'>
                    <div className='text-2xl'>Reset Password</div>
                    <div className='w-3/4 md:w-1/2 flex flex-col gap-6'>

                        <Input variant="standard" name='password' label="Password" type={passwordType ? 'password' : 'text'} color='black' className='!text-black' onChange={handleChanges}
                            icon={passwordType ?
                                <FaEyeSlash onClick={() => setPasswordType(!passwordType)} />
                                : <FaEye onClick={() => setPasswordType(!passwordType)} />
                            } />
                        <Input variant="standard" name='confirmpassword' label="Re-Password" type={rePasswordType ? 'password' : 'text'} color='black' className='!text-black' onChange={handleChanges}
                            icon={rePasswordType ?
                                <FaEyeSlash onClick={() => setRePasswordType(!rePasswordType)} />
                                : <FaEye onClick={() => setRePasswordType(!rePasswordType)} />
                            } />
                    </div>
                    <div>
                        <Button variant="filled" onClick={handleSubmit}>Submit</Button>
                    </div>

                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default NewPassword
