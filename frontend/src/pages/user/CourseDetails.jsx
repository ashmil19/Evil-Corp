import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Rating, Typography } from "@mui/material"
import { Button, Textarea } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

import Navbar from '../../components/navbars/navbar'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ToastHelper from '../../helper/ToastHelper';
const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const CourseDetails = () => {
  const authState = useSelector((state) => state.auth)
  const axiosPrivate = useAxiosPrivate()
  const toastHelper = new ToastHelper()
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state && location.state.courseId;

  const [isEdit, setIsEdit] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [fetch, setFetch] = useState(false);
  const [chapter, setChapter] = useState([]);
  const [course, setCourse] = useState([]);
  const [values, setValues] = useState({
    rating: null,
    review: "",
    courseId,
    userId: authState.userId,
  })

  const [isReviewShow, setIsReviewShow] = useState(false)
  const [isBuy, setIsBuy] = useState(false)

  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51OISQWSBQLVhDmRfAhLKSBBKcyKeeIUvfUe1urrofu6ZeWJqqY5N6pVwJ7ItTIVpPSm1kAAWuuR5WJmQMfFUCn6800Wi7hSBjG')
    // const stripe = await loadStripe('pk_test_51ORywXSGSYXlOuXjSdEWVmjRxocXVWRiT3YuSGH4CyaldklV8kVC9c9kt8ClHdtAuKDteTpYaPtunAwCbf8xw4b500btgcGiOT')

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

  const submitReview = async () => {
    if (values.rating === null || values.review.trim() === "") {
      toastHelper.showToast("please give the review and rating")
      return;
    }
    console.log(values);

    axiosPrivate.post("/user/courseReview", values)
      .then((res) => {
        console.log(res);
        setFetch(true)
        setValues({
          review: "",
          rating: null
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  useEffect(() => {
    axiosPrivate.get(`/user/course/${courseId}`)
      .then((res) => {
        console.log(res.data.course);
        setCourse(res.data.course);
        setChapter(res.data.course.chapters)
        setReviews(res.data.course.reviews)

        const isBuy = res.data.course.users.includes(authState.userId)
        const isReviewed = res.data.course.reviews.some(obj => obj.user._id === authState.userId)
        setIsBuy(isBuy)
        setIsReviewShow(isBuy && !(isReviewed))
      })
      .catch((err) => {
        console.log(err);
      })

    setFetch(false)

  }, [fetch]);

  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <Navbar />
      <div className='w-full'>
        <div className='w-full h-full flex flex-col md:flex-row'>
          <div className='w-full md:w-1/2 h-full p-5 flex flex-col gap-5'>
            <div className='text-2xl font-bold'>{course.title}:</div>
            <div>
              {/* <img src={course && course.coverImage?.url} alt="thumbnail" className='' /> */}
              <video width="700" height="360" className='rounded-t-lg' controls key={course?.demoVideo?.url}>
                {<source src={course?.demoVideo?.url} type="video/mp4" />}
                Your browser does not support the video tag.
              </video>
            </div>
            <div>
              <span className="font-bold text-lg">Description: </span>
              <div className="text-justify">{course.description}</div>
            </div>
            {!isBuy && <div
              onClick={makePayment}
              className="w-2/3 border-2 border-gray-300 shadow-md cursor-pointer transition-all duration-500 hover:-translate-y-3 h-20 flex flex-col justify-center text-center"
            >
              <button className="text-xl font-semibold text-gray-500">
                BUY THIS COURSE
              </button>
              <span className="font-semibold text-gray-500">
                Only &#8377;{course.price}
              </span>
            </div>}
          </div>
          {isBuy && <div className='w-full md:w-1/2 h-full p-5 flex flex-col gap-3 items-center'>
            {chapter.map((chapter) => (
              // <div className="p-5" >
              <button
                key={chapter._id}
                id="dropdownDefaultButton"
                className="text-gray-600 bg-gray-300 hover:text-gray-600 transition-colors duration-300 hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-gray-400 font-semibold rounded-lg text-xl w-5/6 overflow-hidden px-2 py-2.5 text-center inline-flex items-center justify-center"
                type="button"
                onClick={() => navigate("/user/chapterDetails", { state: { id: chapter._id } })}
              >
                {chapter.title}
              </button>
              // </div>
            ))}
          </div>}
        </div>

        {isReviewShow && <div className="w-full p-5 flex flex-col gap-2">
          <div>
            <div className='font-medium text-sm'>How would you rate it?</div>
            <Rating
              name="rating"
              value={values.rating}
              precision={0.5}
              onChange={(event, newValue) => setValues({ ...values, rating: newValue })}
            />
          </div>
          <div>
            <div className='font-medium text-sm'>Write your review</div>
            <Textarea label="Review" name='review' value={values.review} onChange={(e) => setValues({ ...values, review: e.target.value })} />
          </div>
          <div>
            <Button size='sm' onClick={submitReview}>Submit</Button>
          </div>
        </div>}

        <div className="w-full p-5 flex flex-col gap-2">
          <div className='font-bold text-lg'>Reviews({reviews?.length})</div>
          {reviews && reviews.map((review) => (
            <div key={review._id} className='w-full h-20 bg-blue-gray-200 rounded-lg p-2 flex flex-col'>
              <div className='text-verySmall font-medium'>{review?.user?._id === authState.userId ? "You" : review?.user?.fullname}</div>
              <Rating
                size='small'
                name="rating"
                value={review?.rating}
                precision={0.5}
                readOnly
              />
              <div className='text-verySmall-1'>{review?.review}</div>
            </div>
          ))}
        </div>
      </div>
      <Toaster />
    </div>

  )
}

export default CourseDetails
