import React, { useState } from 'react'
import { Input, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import toast,{Toaster} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

import Navbar from '../../components/navbars/navbar'
import LoginImage from '../../asset/login.svg'

function Login() {
  const navigate = useNavigate()
  const [passwordType, setPasswordType] = useState(true);
  const [prevToastId, setPrevToastId] = useState(null);

  const [values, setValues] = useState({
    email: "",
    password: ""
  })

  const showToast = (message)=>{
    
    if(prevToastId){
      toast.dismiss(prevToastId)
    }

    const newToastId = toast.error(message,{
      duration: 3000,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        width: '300px',
      },
    })

    setPrevToastId(newToastId)

  }

  const handleSubmit = ()=>{
    const {email, password} = values

    if(email === "" || password === ""){
      showToast("fill the form")
      return
    }

    console.log(values);
  }


  const handleChanges = (e) =>{
    setValues({...values, [e.target.name]: e.target.value.trim()})
  }

  return (
    <div className='h-screen w-screen overflow-hidden'>
        <Navbar text="Sign up" onClick={()=>{navigate("/signup")}}/>
        <div className=' h-full flex flex-col md:flex-row'>
          <div className='md:w-1/2 w-full h-1/3 md:h-full flex items-start md:items-center justify-center'>
            <img className='w-full md:w-2/3 h-full' src={LoginImage} alt="" />
          </div>
          <div className='md:w-1/2 w-full flex items-center md:items-start justify-center flex-col gap-8'>
            <div className='text-2xl'>Sign in</div>
            <div className='w-3/4 md:w-1/2 flex flex-col gap-6'>
              <Input variant="standard" name='email' label="Email" color='black' className='!text-black' onChange={handleChanges} />
              <Input variant="standard" name='password' label="Password" type={passwordType ? 'password' : 'text'} color='black' className='!text-black' onChange={handleChanges}
              icon={ passwordType ?
              <FaEyeSlash onClick={()=> setPasswordType(!passwordType)} />
              : <FaEye onClick={()=> setPasswordType(!passwordType)} />
              } />

            </div>
            <div>
            <Button variant="filled" onClick={handleSubmit}>Log in</Button>
            </div>
            <div className='w-full md:w-2/3 flex items-center justify-center md:justify-start gap-2'>
              <hr className='w-1/3 md:w-1/3 border-t-2 border-gray-500 my-4'/>
              <span>Or</span>
              <hr className='w-1/3 border-t-2 border-gray-500 my-4'/>
            </div>
            <div className='w-1/2 flex justify-center'>
              google
            </div>
          </div>
        </div>
        <Toaster/>
    </div>
  )
}

export default Login