import React from 'react'
import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import DashboardTextContent from '../../components/common/DashboardTextContent'
import DashboardCardSection from '../../components/common/DashboardCardSection'
import RecentTransactions from '../../components/common/RecentTransactions'

const TeacherHome = () => {
  return (
    <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
      <TeacherNavbar />
      <div className='w-full h-full bg-dashboard-bg p-5 md:p-8  flex flex-col gap-0 md:gap-8'>
          <DashboardTextContent text="teacher" />
          <DashboardCardSection />
          <RecentTransactions />
      </div>
    </div>
  )
}

export default TeacherHome
