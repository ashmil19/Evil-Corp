import React from 'react'
import AdminNavbar from '../../components/navbars/AdminNavbar'
import DashboardTextContent from '../../components/common/DashboardTextContent'
import AdminDashboardCardSection from '../../components/admin/AdminDashboardCardSection'
import AdminTransactions from '../../components/admin/AdminTransactions'

function AdminHome() {
  return (
    <div className='w-screen h-screen+50 md:h-screen overflow-x-hidden'>
      <AdminNavbar />
      <div className='w-full h-full bg-dashboard-bg p-5 md:p-8  flex flex-col gap-0 md:gap-8'>
          <DashboardTextContent text="Admin" />
          <AdminDashboardCardSection />
          <AdminTransactions />
      </div>
    </div>
  )
}

export default AdminHome