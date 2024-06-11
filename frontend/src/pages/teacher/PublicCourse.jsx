import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import TeacherCourseCard from "../../components/teacher/TeacherCourseCard";
import TeacherNavbar from "../../components/navbars/TeacherNavbar";
import ToastHelper from "../../helper/ToastHelper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PublicCourse = () => {
  const axiosPrivate = useAxiosPrivate();
  const toastHelper = new ToastHelper();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const currentPage = useRef();

  const [courses, setCourses] = useState(null);
  const [fetch, setFetch] = useState(false);

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    fetchCourses();
  };

  const fetchCourses = (search) => {
    axiosPrivate
      .get(`/teacher/myCourse?page=${currentPage.current}&search=${search}`)
      .then((res) => {
        console.log(res?.data?.results?.courses);
        setCourses(res?.data?.results?.courses);
        setPageCount(res?.data?.results?.pageCount);
        currentPage.current = res?.data?.results?.page;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCourses();
    setFetch(false);
  }, [fetch]);

  const handleInputChange = (event) => {
    setSearchQuery(event?.target?.value);
    fetchCourses(event?.target?.value);
  };

  return (
    <>
      <div className="w-screen h-screen+50 md:h-screen overflow-x-hidden">
        <TeacherNavbar />

        <div className="w-full h-full bg-dashboard-bg flex flex-col gap-8">
          <div className="w-full h-20 bg-dashboard-bg flex justify-center items-center">
            <div className="flex ">
              <div className="w-14 h-10 rounded-l-md bg-black flex justify-center items-center">
                <FaSearch className="text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="p-2 rounded-r-md w-full md:w-64 text-black text-verySmall-1 bg-white outline-none"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-full h-auto flex justify-center px-2 py-2 flex-wrap gap-4">
            {courses?.length !== 0 ? (
              courses?.map((course) => {
                return (
                  <TeacherCourseCard
                    key={course._id}
                    course={course}
                    setFetch={setFetch}
                  />
                );
              })
            ) : (
              <div className="flex justify-center items-center text-white font-semibold">
                No Course Found
              </div>
            )}
          </div>
          <div className="w-full flex justify-center bg-dashboard-bg py-6">
            <ReactPaginate
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={0}
              pageCount={pageCount}
              // initialPage={currentPage.current}
              forcePage={currentPage.current}
              previousLabel="<"
              pageClassName="inline-block mx-1 page-item rounded "
              pageLinkClassName=" p-2 page-link"
              previousClassName="inline-block mx-1 page-item font-bold"
              previousLinkClassName=" p-2 page-link "
              nextClassName="inline-block mx-1 page-item font-bold"
              nextLinkClassName=" p-2 page-link"
              breakLabel="..."
              breakClassName="page-item inline-flex"
              breakLinkClassName="page-link "
              containerClassName="pagination text-white"
              activeClassName="active bg-red-500 text-white"
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicCourse;
