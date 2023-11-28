import React, { useState } from 'react'
import { Input, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Switch } from '@headlessui/react'
import {Toaster} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

import Navbar from '../../components/navbars/navbar'
import LoginImage from '../../asset/login.svg'
import axios from '../../helper/axios'
import ToastHelper from '../../helper/ToastHelper';

const toastHelper = new ToastHelper();


function Registration() {
    const navigate = useNavigate()
    const [passwordType, setPasswordType] = useState(true);
    const [rePasswordType, setRePasswordType] = useState(true);
    const [enabled, setEnabled] = useState(false)

    const [values, setValues] = useState({
      fullname: "",
      email: "",
      password: "",
      confirmpassword: "",
      isTeacher: false
    })


    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      return emailRegex.test(email);
    }

    const handleSubmit = ()=>{
      
      const {fullname,email,password,confirmpassword} = values
      if(fullname.trim() === "" || email.trim() === "" || password.trim() === "" || confirmpassword.trim() === ""){
        toastHelper.showToast("fill the form")
        return
      }

      if (!isValidEmail(email)){
        toastHelper.showToast("email not in correct form")
        return
      }

      if(password !== confirmpassword){
        toastHelper.showToast("password doesnot match")
        return
      }


      const postData = {...values, isTeacher: enabled}

      axios.post('/signup',postData)
      .then((res)=>{
        navigate('/login')
        console.log("success");
      })
      .catch((err)=>{
        toastHelper.showToast(err.response.data.message)
        console.log(err.message);
      })

    }


    const handleChanges = (e)=>{
      setValues({...values, [e.target.name]: e.target.value.trim()})
    }


  return (
    <div className='h-screen w-screen overflow-hidden'>
        <Navbar text="Login" onClick={()=> navigate('/login')}/>
        <div className=' h-full flex flex-col md:flex-row'>

          <div className='md:hidden w-full h-1/4 flex items-center justify-center'>
            <img className='w-full h-full' src={LoginImage} alt="" />
          </div>
          
          <div className='w-full md:w-1/2 flex items-center justify-center flex-col gap-8'>
            <div className='text-2xl'>Sign up</div>
            <div className='w-3/4 md:w-1/2 flex flex-col gap-6'>
              <Input variant="standard" name='fullname' label="Full Name" color='black' className='!text-black' pattern='^[A-Za-z0-9]{3,16}$' onChange={handleChanges} />
              <Input variant="standard" name='email' label="Email" color='black' className='!text-black' onChange={handleChanges}/>
              <Input variant="standard" name='password' label="Password" type={passwordType ? 'password' : 'text'} color='black' className='!text-black' onChange={handleChanges}
              icon={ passwordType ?
              <FaEyeSlash onClick={()=> setPasswordType(!passwordType)} />
              : <FaEye onClick={()=> setPasswordType(!passwordType)} />
              } />
              <Input variant="standard" name='confirmpassword' label="Re-Password" type={rePasswordType ? 'password' : 'text'} color='black' className='!text-black' onChange={handleChanges}
              icon={ rePasswordType ?
              <FaEyeSlash onClick={()=> setRePasswordType(!rePasswordType)} />
              : <FaEye onClick={()=> setRePasswordType(!rePasswordType)} />
              } />
              <label className='flex gap-3 items-center text-xs' htmlFor="sldfa">
                
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    name='isTeacher'
                    className={`${enabled ? 'bg-gray-800' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-gray-400`}
                >
                    {/* <span className="sr-only">Enable notifications</span> */}
                    <span
                        className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-gray-400 transition`}
                    />
                </Switch>
                sign up as teacher
                </label>
              
            </div>
            <div className='w-3/4 md:w-1/2 flex items-start justify-center md:justify-start'>
                <Button variant="filled" onClick={handleSubmit}>Sign up</Button>
            </div>
            
          </div>

          <div className='hidden w-1/2 md:flex items-center justify-center'>
            <img className='w-2/3 h-2/3' src={LoginImage} alt="" />
          </div>
        </div>
        <Toaster />
    </div>
  )
}

export default Registration