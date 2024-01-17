import { FaRedhat, FaUser } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { TbBooks } from "react-icons/tb";

import DashboardCard from "./DashboardCard";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";

const DashboardCardSection = () => {
  const axiosPrivate = useAxiosPrivate();

  const [data, setData] = useState({
    students: 0,
    allCourses: 0,
    publicCourses: 0,
    totalAmount: 0
  });

  useEffect(() => {
    (async () => {
      axiosPrivate
        .get("/teacher/dashboard")
        .then((res) => {
          console.log(res?.data);
          setData({...data,...res?.data});
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  },[]);

  return (
    <div className="h-2/5 md:h-28 w-full flex flex-col md:flex-row justify-between gap-5 md:gap-0">
      <DashboardCard
        text="Total Student"
        value={data?.students}
        Icon={<FaUser color="white" className="text-xl md:text-veryLarge" />}
      />
      <DashboardCard
        text="Total Course"
        value={data?.allCourses}
        Icon={<TbBooks color="white" className="text-xl md:text-veryLarge" />}
      />
      <DashboardCard
        text="Public Course"
        value={data?.publicCourses}
        Icon={<FaRedhat color="white" className="text-xl md:text-veryLarge" />}
      />
      <DashboardCard
        text="Total Revenue"
        value={data?.totalAmount}
        Icon={<GoTrophy color="white" className="text-xl md:text-veryLarge" />}
      />
    </div>
  );
};

export default DashboardCardSection;
