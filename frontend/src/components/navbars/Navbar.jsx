import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Transition } from '@headlessui/react'
import 'hover.css/css/hover-min.css';
import { useSelector, useDispatch } from 'react-redux';

import { logOut } from '../../features/authSlice';
import { axiosPrivate } from '../../helper/axios';
import useLogout from '../../hooks/useLogout';
import myLogo from '../../asset/logo.svg';

function Navbar({onClick, text}) {
  const logout = useLogout()
  const [isOpen, setIsOpen] = useState(false);
  const authState = useSelector((state)=> state.auth)
  const dispatch = useDispatch() 
  const navigate = useNavigate()

  // const handleLogout = () =>{
  //   axiosPrivate.get("/user/logout")
  //   .then((response)=>{
  //     console.log("success");
  //     dispatch(logOut())
  //     navigate('/login')
  //   })
  // }

  const allowedRoles = [1000,2000,3000] 

  return (
    <div>
      <nav className="w-screen bg-custom-bg-color">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full flex items-center justify-between h-16">
            <div className="w-full flex items-center justify-between">
              <div className="flex-shrink-0">
                <div className='w-10 h-10' style={{backgroundImage: `url(${myLogo})`}}></div>
              </div>
              <div className="hidden md:flex md:justify-between">
                <div className=" flex items-center justify-between space-x-7">
                  <Link to='/user'><p className='text-white text-medium cursor-pointer py-1 hvr-underline-from-left'>Home</p></Link>
                  <Link to="/user/course"><p className='text-white text-medium cursor-pointer py-1 hvr-underline-from-left'>Course</p></Link>
                  <p className='text-white text-medium cursor-pointer py-1 hvr-underline-from-left'>About Us</p>
                  <Link to="/user/blog"><p className='text-white text-medium cursor-pointer py-1 hvr-underline-from-left'>Blog</p></Link>
                  <Link to="/user/profile"><p className='text-white text-medium cursor-pointer py-1 hvr-underline-from-left'>Profile</p></Link>
                </div>
              </div>
              <div>
                  {authState?.role?.find(role => allowedRoles?.includes(role))
                  ? <span className='hidden md:block bg-custom-btnColor px-3 py-1 text-custom-btn-color font-medium cursor-pointer  hvr-bounce-to-right' onClick={logout}>Logout</span>
                  : <span className='hidden md:block bg-custom-btnColor px-3 py-1 text-custom-btn-color font-medium cursor-pointer  hvr-bounce-to-right' onClick={onClick == undefined ? ()=> navigate('/login') : onClick}>{text}</span>
                }
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              
                <div className=" flex flex-col gap-3 mb-3">
                  <p className='text-white text-medium cursor-pointer py-1'>Home</p>
                  <p className='text-white text-medium cursor-pointer py-1'>Course</p>
                  <p className='text-white text-medium cursor-pointer py-1'>About Us</p>
                  <p className='text-white text-medium cursor-pointer py-1'>Blog</p>
                  <p className='text-white text-medium cursor-pointer py-1'>Profile</p>
                </div>
              
                

                <span className='md:hidden bg-custom-btnColor px-3 py-1 text-custom-btn-color font-medium cursor-pointer'>Logout</span>
              </div>
            </div>
          )}
        </Transition>
      </nav>

    </div>
  )
}

export default Navbar