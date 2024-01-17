import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Navbar from "../../components/navbars/navbar";
import CourseComponent from "../../components/user/CourseComponent";
import courseBanner from "../../asset/courseBanner.jpeg";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Course = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [courses, setCourses] = useState(null);
  const [categories, setCategories] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [price, setPrice] = React.useState(-1);
  const [category, setCategory] = React.useState(null);

  const currentPage = useRef();

  useEffect(() => {
    getAllCourse(searchQuery);

    setSearchQuery(searchQuery);
  }, [category, price]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const getAllCourse = (search) => {
    axiosPrivate
      .get(`/user/course?page=${currentPage.current}&search=${search}&category=${category}&price=${price}`)
      .then((res) => {
        console.log(res.data.results);
        setCourses(res?.data?.results?.courses);
        setCategories(res?.data?.results?.allCategories);
        setPageCount(res?.data?.results?.pageCount);
        currentPage.current = res?.data?.results?.page;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePageClick = (e) => {
    currentPage.current = e.selected + 1;
    getAllCourse();
  };

  const debounce = (func, delay) => {
    let timeoutId;

    return function (...args) {
      const context = this;
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(getAllCourse, 1000);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    debouncedSearch(event.target.value);
  };

  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <Navbar />
      <div className="h-full w-full">
        <div
          className="flex h-48 w-full items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${courseBanner})` }}
        >
          <div className="text-4xl font-medium text-white">Courses</div>
        </div>
        <div className="flex h-16 w-full items-center justify-around px-8">
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Category</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              size="small"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories?.map((category, index) => (
                <MenuItem key={index} value={category?._id}>
                  {category?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Price</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              size="small"
              value={price}
              label="Price"
              onChange={(e)=> setPrice(e.target.value)} 
            >
              <MenuItem value={-1}>High to Low</MenuItem>
              <MenuItem value={1}>Low to High</MenuItem>
            </Select>
          </FormControl>
          <div className="flex ">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full rounded-l-md bg-gray-400 p-2 text-verySmall-1 font-medium text-black outline-none md:w-64"
            />
            <div className="flex h-9 w-14 items-center justify-center rounded-r-md bg-blue-500">
              <FaSearch className="bg-blue-500 text-white" />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-wrap justify-center gap-4 px-8 md:flex-row">
          {courses && courses.length !== 0 ? (
            courses.map((course) => {
              return (
                <CourseComponent
                  key={course._id}
                  course={course}
                  className="hvr-grow h-64 w-full cursor-pointer shadow-lg md:w-56"
                  onclick={() =>
                    navigate("/user/courseDetails", {
                      state: { courseId: course._id },
                    })
                  }
                />
              );
            })
          ) : (
            <div className="flex h-40 w-full items-center justify-center">
              <div className="text-center text-4xl font-bold capitalize text-black">
                not found anything<span className="text-red-500">!</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full justify-center py-10">
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
            pageLinkClassName="border p-2 page-link"
            previousClassName="inline-block mx-1 page-item font-bold"
            previousLinkClassName="border p-2 page-link "
            nextClassName="inline-block mx-1 page-item font-bold"
            nextLinkClassName="border p-2 page-link"
            breakLabel="..."
            breakClassName="page-item inline-flex"
            breakLinkClassName="page-link "
            containerClassName="pagination "
            activeClassName="active bg-red-500"
            renderOnZeroPageCount={null}
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
