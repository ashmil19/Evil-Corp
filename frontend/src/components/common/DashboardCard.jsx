import React from 'react'

const DashboardCard = ({Icon, text, value}) => {
  return (
    <div className='w-full md:w-1/5 h-full bg-gray-600 rounded-md border-white border-2'>
      <div className='h-1/2 w-full flex justify-center items-end'>
        {Icon}
      </div>
      <div className='h-1/2 flex justify-center items-center text-white text-sm md:text-md font-medium capitalize py-4 md:py-0'>{text}: {value}</div>
    </div>
  )
}

export default DashboardCard
