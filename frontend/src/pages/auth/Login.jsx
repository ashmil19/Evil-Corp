import  { useState, Fragment } from 'react'
import { Input, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {Toaster} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'

import Navbar from '../../components/navbars/navbar'
import LoginImage from '../../asset/login.svg'
import axios from '../../helper/axios'
import { setCredentials } from  '../../features/authSlice'
import ToastHelper from '../../helper/ToastHelper';
import GoogleLoginComponent from '../../components/auth/GoogleLoginComponent';

const toastHelper = new ToastHelper();

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [passwordType, setPasswordType] = useState(true);

  const [values, setValues] = useState({
    email: "",
    password: ""
  })

  const [isOpen, setIsOpen] = useState(false)
  const [mail, setMail] = useState("");


  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    return emailRegex.test(email);
  }

  const handleSubmit = ()=>{
    const {email, password} = values

    if(email === "" || password === ""){
      toastHelper.showToast("fill the form")
      return
    }

    if (!isValidEmail(email)){
      toastHelper.showToast("email not in correct form")
      return
    }

    console.log(values);

    axios.post('/login',values,{
      withCredentials: true,
      credentials: 'include'
    })
    .then((res)=>{
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
      toastHelper.showToast(err?.response?.data?.message)
      console.log(err);
    })
  }

  const handleForgotPassword = () =>{
    if(mail === ""){
      toastHelper.showToast("fill the form")
      return;
    }

    if (!isValidEmail(mail)){
      toastHelper.showToast("email not in correct form")
      return
    }

    axios.post("/forgotPassword",{email: mail},{
      withCredentials: true,
      credentials: 'include'
    })
    .then((res)=>{
      navigate('/forgotpassword',{state: {email: mail}})
    })
    .catch((err)=>{
      console.log(err);
    })
  }


  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const handleChanges = (e) =>{
    setValues({...values, [e.target.name]: e.target.value.trim()})
  }

  return (
    <>
    <div className='h-screen w-screen overflow-hidden'>
        <Navbar text="Sign up" onClick={()=>{navigate("/signup")}}/>
        <div className=' h-full flex flex-col md:flex-row'>
          <div className='md:w-1/2 w-full h-1/3 md:h-full flex items-start md:items-center justify-center'>
            <img className='w-full md:w-2/3 h-full' src={LoginImage} alt="" />
          </div>
          <div className='md:w-1/2 w-full flex items-center md:items-start justify-center flex-col gap-6'>
            <div className='text-2xl'>Sign in</div>
            <div className='w-3/4 md:w-1/2 flex flex-col gap-6'>
              <Input variant="standard" name='email' label="Email" color='black' className='!text-black' onChange={handleChanges} />
              <Input variant="standard" name='password' label="Password" type={passwordType ? 'password' : 'text'} color='black' className='!text-black' onChange={handleChanges}
              icon={ passwordType ?
              <FaEyeSlash onClick={()=> setPasswordType(!passwordType)} />
              : <FaEye onClick={()=> setPasswordType(!passwordType)} />
              } />
              <div className='text-verySmall underline cursor-pointer' onClick={openModal}>Forgot Password ?</div>
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
              <GoogleLoginComponent />
            </div>
          </div>
        </div>
        <Toaster/>
    </div>

    {/* mail modal */}
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Forgot Password
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input label="Email" name='email' onChange={(e)=> setMail(e.target.value.trim())} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleForgotPassword}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Login