import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "center";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const TeacherDashboardGraph = () => {
  const axiosPrivate = useAxiosPrivate();

  const [data, setData] = useState(null);

  useEffect(() => {
    (() => {
      axiosPrivate
        .get("/teacher/graph")
        .then((res) => {
          console.log(res);
          setData(res.data?.paymentData);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  return (
    <div className="h-64 flex flex-col md:flex-row gap-2 bg-gray-100 rounded-md">
      <div className="w-full  h-full bg-gray-100 rounded-md flex justify-center items-center">
        <Line
          data={{
            labels: data?.map((payment) =>
              new Date(payment?.date).toLocaleDateString("en-US", {
                month: "long",
              })
            ),
            datasets: [
              {
                label: "Amount",
                data: data?.map((payment) => payment?.totalAmount),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0"
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Payments",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TeacherDashboardGraph;
