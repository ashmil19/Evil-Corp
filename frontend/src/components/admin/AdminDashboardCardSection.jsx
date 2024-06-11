import { FaRedhat, FaUser } from "react-icons/fa";
import { TbBooks } from "react-icons/tb";
import { GoTrophy } from "react-icons/go";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import DashboardCard from "../common/DashboardCard";
import { useEffect, useState } from "react";

const AdminDashboardCardSection = () => {
  const axiosPrivate = useAxiosPrivate();

  const [data, setData] = useState({
    students: 0,
    teachers: 0,
    allCourses: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    (() => {
      axiosPrivate
        .get("/admin/dashboard")
        .then((res) => {
          console.log(res);
          setData({...data,...res?.data });
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <div className="h-2/5 md:h-28 w-full flex flex-col md:flex-row justify-between gap-5 md:gap-0">
      <DashboardCard
        text="Total student"
        value={data?.students}
        Icon={<FaUser color="white" className="text-xl md:text-veryLarge" />}
      />
      <DashboardCard
        text="total teacher"
        value={data?.teachers}
        Icon={<FaRedhat color="white" className="text-xl md:text-veryLarge" />}
      />
      <DashboardCard
        text="total course"
        value={data?.allCourses}
        Icon={<TbBooks color="white" className="text-xl md:text-veryLarge" />}
      />
      <DashboardCard
        text="Total revenue"
        value={data?.totalAmount}
        Icon={<GoTrophy color="white" className="text-xl md:text-veryLarge" />}
      />
    </div>
  );
};

export default AdminDashboardCardSection;
