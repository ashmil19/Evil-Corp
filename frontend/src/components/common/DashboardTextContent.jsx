import React from 'react'

const DashboardTextContent = ({text}) => {
  return (
    <div className='h-1/5 md:h-20 flex flex-col justify-center'>
      <div className='capitalize text-white text-lg md:text-2xl'>hello {text}</div>
      <div className='capitalize text-dashboard text-lg md:text-2xl'>Welcome to Dashboard</div>
      <div className='capitalize text-white text-lg md:text-2xl'>Congratulation ,You Have Some Good News</div>
    </div>
  )
}

export default DashboardTextContent
