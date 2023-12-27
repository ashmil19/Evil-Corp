import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";

import Navbar from '../../components/navbars/navbar'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const CourseDetails = () => {
  const axiosPrivate = useAxiosPrivate()
  const location = useLocation();
  const courseId = location.state && location.state.courseId;
  const [chapter, setChapter] = useState([]);
  const [course, setCourse] = useState([]);

  const makePayment = async ()=>{
    const stripe = await loadStripe('pk_test_51OISQWSBQLVhDmRfAhLKSBBKcyKeeIUvfUe1urrofu6ZeWJqqY5N6pVwJ7ItTIVpPSm1kAAWuuR5WJmQMfFUCn6800Wi7hSBjG')

    try {
      const response = await axiosPrivate.post("/user/buyCourse",{courseId})
      const session = response.data
      console.log(response.data);
      const result = stripe.redirectToCheckout({
        sessionId: session.id
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    axiosPrivate.get(`/user/course/${courseId}`)
      .then((res) => {
        console.log(res.data.course);
        setCourse(res.data.course);
        setChapter(res.data.course.chapters)
      })
      .catch((err) => {
        console.log(err);
      })

  }, []);

  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <Navbar />
      {course && (
        <div className="p-3">
          <div className="flex justify-between">
            <div>
              <span className="text-2xl font-bold">
                {course.title}
                {` `}:
              </span>
              <div className="flex flex-col ml-3 p-5">
            <img
              src={course && course.coverImage?.url}
              alt="thumbnail"
              className="w-1/2"
            />
          </div>
            </div>
            
            <div className="">
              {/* //////////////////// */}
              {chapter.map((chapter) => (
                <div className="relative py-3" >
                  <button
                    id="dropdownDefaultButton"
                    className="text-gray-600 bg-gray-300 hover:text-gray-600 transition-colors duration-300 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-400 font-semibold rounded-lg text-xl w-96 overflow-hidden px-2 py-2.5 text-center inline-flex items-center justify-center"
                    type="button"
                  >
                    {chapter.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="flex flex-col ml-3 p-5">
            <img
              src={course && course.coverImage?.url}
              alt="thumbnail"
              className="w-1/3"
            />
          </div> */}

          <div className="p-3 mx-5 w-2/3">
            <span className="font-bold text-lg">Description:{` `} </span>
            <div className="text-justify">{course.description}</div>
          </div>
          <div
            onClick={makePayment}
            className="w-1/3 border-2 border-gray-300 shadow-md cursor-pointer transition-all duration-500 hover:-translate-y-3 p-3 mx-6 mt-5 h-24 flex flex-col justify-center text-center"
          >
            <button className="text-2xl font-semibold text-gray-500">
              BUY THIS COURSE
            </button>
            <span className="font-semibold text-gray-500">
              Only &#8377;{course.price}
            </span>
          </div>
          {/* {isModalVisible && (
        <div
          aria-hidden="true"
          className="flex fixed bg-gray-300 bg-opacity-20 z-50 justify-center items-center w-full md:inset-0 max-h-full backdrop-filter backdrop-blur-sm"
        >
          <div className="relative  w-full  max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-lg font-semibold text-gray-900">
                  Buy this Course
                </h3>

                <button
                  onClick={paymentModal}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-toggle="crud-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold px-5 pt-5 text-gray-600">
                  Course Name: {courses.courseName}
                </h1>
                <h1 className="text-2xl font-bold px-5 pt-3 pb-5 text-gray-600">
                  Price:{` `}
                  &#8377;{courses.price}/-
                </h1>
              </div>
              <div className="flex justify-center items-center pb-5">
                <button
                  // onClick={handlepayment}
                  style={{ backgroundColor: "#004787" }}
                  className="p-3 border text-white text-xl font-bold hover:-translate-y-3 transition-all duration-500 border-gray-400 rounded-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
          {/* <Toaster /> */}
        </div>
      )}
    </div>

  )
}

export default CourseDetails
