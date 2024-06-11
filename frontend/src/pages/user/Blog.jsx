import React, { useEffect, useRef, useState } from 'react'
import ReactPaginate from 'react-paginate';

import ToastHelper from '../../helper/ToastHelper';
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Navbar from '../../components/navbars/Navbar'
import BlogCard from '../../components/user/BlogCard';
import { FaSearch } from 'react-icons/fa';


const Blog = () => {
    const axiosPrivate = useAxiosPrivate()
    const toastHelper = new ToastHelper()

    const [blogs, setBlogs] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pageCount, setPageCount] = useState(1)
    const currentPage = useRef()

    const fetchAllBlogs = (search) =>{
        axiosPrivate.get(`/user/blogs?page=${currentPage.current}&search=${search}`)
        .then((res)=>{
            console.log(res);
            setBlogs(res.data.results.blogs)
            setPageCount(res?.data?.results?.pageCount)
            currentPage.current = res?.data?.results?.page
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const handlePageClick = (e) => {
        currentPage.current = e.selected + 1;
        fetchAllBlogs()
    }

    useEffect(() => {
        fetchAllBlogs()
    }, []);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value)
        fetchAllBlogs(event.target.value)
    }

    return (
        <div className='w-screen h-screen overflow-x-hidden'>
            <Navbar />
            <div className="w-full h-full p-5 flex flex-col gap-5">
                <div className='w-full h-16 flex items-center justify-center px-5'>
                    <div className='flex '>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleInputChange}
                            className="p-2 rounded-l-md w-full md:w-64 placeholder-blue-gray-900 text-black font-medium text-verySmall-1 bg-gray-400 outline-none"
                        />
                        <div className='w-14 h-9 rounded-r-md bg-blue-500 flex justify-center items-center'>
                            <FaSearch className='bg-blue-500 text-white' />
                        </div>
                    </div>
                </div>
                {blogs && blogs.length !== 0 ? blogs?.map((blog) => (
                    <BlogCard blog={blog} />
                )) : <div className='h-40 w-full flex justify-center items-center'>
                        <div className='text-black text-4xl capitalize font-bold text-center'>not found anything<span className='text-red-500'>!</span></div>
                    </div>}
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
    )
}

export default Blog
