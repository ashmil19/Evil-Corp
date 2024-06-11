import React, { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import CourseComponent from '../../components/user/CourseComponent';
import Navbar from '../../components/navbars/Navbar';
import courseBanner from '../../asset/courseBanner.jpeg'

const MyCourses = () => {
    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()
    const [courses, setCourses] = useState(null);
    const [pageCount, setPageCount] = useState(1)
    const [searchQuery, setSearchQuery] = useState('');
    const currentPage = useRef()

    useEffect(() => {
        getAllCourse()
        return ()=> setSearchQuery("")
    }, []);

    const getAllCourse = (search) => {
        axiosPrivate.get(`/user/myCourse?page=${currentPage.current}&search=${search}`)
            .then((res) => {
                console.log(res.data.results.courses);
                setCourses(res.data.results.courses)
                setPageCount(res?.data?.results?.pageCount)
                currentPage.current = res?.data?.results?.page
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handlePageClick = (e) => {
        currentPage.current = e.selected + 1;
        getAllCourse()
    }

    const debounce = (func, delay) => {
        let timeoutId;

        return function (...args) {
            const context = this;
            clearTimeout(timeoutId)

            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay)
        }
    }

    const debouncedSearch = debounce(getAllCourse, 300)

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value)
        debouncedSearch(event.target.value)
    }



    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Navbar />
            <div className='w-full h-full'>
                <div className='h-48 w-full bg-center bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${courseBanner})` }}>
                    <div className='font-medium text-4xl text-white'>My Courses</div>
                </div>
                <div className='w-full h-16 flex items-center justify-start px-5'>
                    <div className='flex '>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="p-2 rounded-l-md w-full md:w-64 text-black font-medium text-verySmall-1 bg-gray-400 outline-none"
                        />
                        <div className='w-14 h-9 rounded-r-md bg-blue-500 flex justify-center items-center cursor-pointer'>
                            <FaSearch className='bg-blue-500 text-white' />
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 p-5'>
                    {courses?.length > 0 ? courses.map((course) => {
                        return <CourseComponent course={course} className="h-64 w-full md:w-56 cursor-pointer hvr-grow shadow-lg" onclick={() => navigate("/user/courseDetails", { state: { courseId: course._id } })} />
                    }) : <div className='w-full flex justify-center items-center text-red-500'>Not found</div>}
                </div>

                <div className='w-full flex justify-center py-10'>
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
    )
}

export default MyCourses
