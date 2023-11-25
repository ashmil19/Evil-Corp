import React, { useState } from 'react'
import { Input, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Switch } from '@headlessui/react'

import Navbar from '../../components/navbars/navbar'
import LoginImage from '../../asset/login.svg'


function Registration() {
    const [passwordType, setPasswordType] = useState(true);
    const [rePasswordType, setRePasswordType] = useState(true);
    const [enabled, setEnabled] = useState(false)

  return (
    <div className='h-screen w-screen overflow-hidden'>
        <Navbar />
        <div className=' h-full flex flex-col md:flex-row'>

          <div className='md:hidden w-full h-1/4 flex items-center justify-center'>
            <img className='w-full h-full' src={LoginImage} alt="" />
          </div>
          
          <div className='w-full md:w-1/2 flex items-center justify-center flex-col gap-8'>
            <div className='text-2xl'>Sign up</div>
            <div className='w-3/4 md:w-1/2 flex flex-col gap-6'>
              <Input variant="standard" label="Full Name" color='black' className='!text-black' />
              <Input variant="standard" label="Email" color='black' className='!text-black' />
              <Input variant="standard" label="Password" type={passwordType ? 'password' : 'text'} color='black' className='!text-black' 
              icon={ passwordType ?
              <FaEyeSlash onClick={()=> setPasswordType(!passwordType)} />
              : <FaEye onClick={()=> setPasswordType(!passwordType)} />
              } />
              <Input variant="standard" label="Re-Password" type={rePasswordType ? 'password' : 'text'} color='black' className='!text-black' 
              icon={ rePasswordType ?
              <FaEyeSlash onClick={()=> setRePasswordType(!rePasswordType)} />
              : <FaEye onClick={()=> setRePasswordType(!rePasswordType)} />
              } />
              <label className='flex gap-3 items-center text-xs' htmlFor="sldfa">
                
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${enabled ? 'bg-gray-800' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-gray-400`}
                >
                    <span className="sr-only">Enable notifications</span>
                    <span
                        className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-gray-400 transition`}
                    />
                </Switch>
                sign up as teacher
                </label>
              
            </div>
            <div className='w-3/4 md:w-1/2 flex items-start justify-center md:justify-start'>
                <Button variant="filled">Sign up</Button>
            </div>
            
          </div>

          <div className='hidden w-1/2 md:flex items-center justify-center'>
            <img className='w-2/3 h-2/3' src={LoginImage} alt="" />
          </div>
        </div>
    </div>
  )
}

export default Registration