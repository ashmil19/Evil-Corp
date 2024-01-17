import React from "react";
import AdminNavbar from "../../components/navbars/AdminNavbar";
import DashboardTextContent from "../../components/common/DashboardTextContent";
import AdminDashboardCardSection from "../../components/admin/AdminDashboardCardSection";
import AdminTransactions from "../../components/admin/AdminTransactions";
import AdminDashboardGraph from "../../components/admin/AdminDashboardGraph";

function AdminHome() {
  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <AdminNavbar />
      <div className="flex h-auto w-full flex-col gap-4  bg-dashboard-bg p-5 md:gap-8 md:p-8 ">
        <DashboardTextContent text="Admin" />
        <AdminDashboardCardSection />
        <AdminDashboardGraph />
      </div>
    </div>
  );
}

export default AdminHome;
