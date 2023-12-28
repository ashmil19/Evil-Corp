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

  const makePayment = async () => {
    // const stripe = await loadStripe('pk_test_51OISQWSBQLVhDmRfAhLKSBBKcyKeeIUvfUe1urrofu6ZeWJqqY5N6pVwJ7ItTIVpPSm1kAAWuuR5WJmQMfFUCn6800Wi7hSBjG')
    const stripe = await loadStripe('pk_test_51ORywXSGSYXlOuXjSdEWVmjRxocXVWRiT3YuSGH4CyaldklV8kVC9c9kt8ClHdtAuKDteTpYaPtunAwCbf8xw4b500btgcGiOT')

    try {
      const response = await axiosPrivate.post("/user/buyCourse", { courseId })
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
      {/* {course && (
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
        </div>
      )} */}

      <div className='w-full h-full flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 h-full p-5 flex flex-col gap-5'>
          <div className='text-2xl font-bold'>{course.title}:</div>
          <div>
            <img src={course && course.coverImage?.url} alt="thumbnail" className='' />
          </div>
          <div>
          <span className="font-bold text-lg">Description: </span>
            <div className="text-justify">{course.description}</div>
          </div>
          <div
            onClick={makePayment}
            className="w-2/3 border-2 border-gray-300 shadow-md cursor-pointer transition-all duration-500 hover:-translate-y-3 h-20 flex flex-col justify-center text-center"
          >
            <button className="text-xl font-semibold text-gray-500">
              BUY THIS COURSE
            </button>
            <span className="font-semibold text-gray-500">
              Only &#8377;{course.price}
            </span>
          </div>
        </div>
        <div className='w-full md:w-1/2 h-full p-5 flex flex-col gap-3 items-center'>
        {chapter.map((chapter) => (
                // <div className="p-5" >
                  <button
                    id="dropdownDefaultButton"
                    className="text-gray-600 bg-gray-300 hover:text-gray-600 transition-colors duration-300 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-400 font-semibold rounded-lg text-xl w-5/6 overflow-hidden px-2 py-2.5 text-center inline-flex items-center justify-center"
                    type="button"
                  >
                    {chapter.title}
                  </button>
                // </div>
              ))}
        </div>
      </div>
    </div>

  )
}

export default CourseDetails
