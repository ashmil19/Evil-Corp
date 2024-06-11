import React from 'react'
import TeacherNavbar from '../../components/navbars/TeacherNavbar'
import DashboardTextContent from '../../components/common/DashboardTextContent'
import DashboardCardSection from '../../components/common/DashboardCardSection'
import RecentTransactions from '../../components/common/RecentTransactions'
import TeacherDashboardGraph from '../../components/teacher/TeacherDashboardGraph'

const TeacherHome = () => {
  return (
    <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
      <TeacherNavbar />
      <div className='w-full h-screen  bg-dashboard-bg p-5 md:p-8  flex flex-col gap-4 md:gap-8'>
          <DashboardTextContent text="teacher" />
          <DashboardCardSection />
          <TeacherDashboardGraph />
      </div>
    </div>
  )
}

export default TeacherHome
