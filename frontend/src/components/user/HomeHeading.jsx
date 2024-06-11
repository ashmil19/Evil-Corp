import React from 'react'

function homeHeading({title}) {
  return (
    <div className='capitalize text-2xl md:text-3xl font-medium w-full flex justify-center items-center'>{title}</div>
  )
}

export default homeHeading