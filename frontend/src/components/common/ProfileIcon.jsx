import React from 'react'
import { FaMailBulk, FaMailchimp, FaPhone } from 'react-icons/fa'

function ProfileIcon({title="hai", subtitle="hello", Icon}) {
  return (
    <div className='flex w-36'>
        <div className='w-1/3'>
            <div className='bg-red-300 w-10 h-10 rounded-full flex justify-center items-center'>
                {Icon}
            </div>
        </div>
        <div className='w-2/3 flex flex-col'>
            <div className='w-full text-verySmall capitalize'>{title}</div>
            <div className='w-full font-semibold text-verySmall-1'>{subtitle}</div>
        </div>
    </div>
  )
}

export default ProfileIcon