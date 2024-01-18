import React, { Fragment, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Rating, Typography } from "@mui/material"
import { Button, Textarea } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { RiEdit2Fill } from "react-icons/ri";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Navbar from '../../components/navbars/navbar'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import ToastHelper from '../../helper/ToastHelper';
import { Dialog, Transition } from '@headlessui/react';
const profilePic = 'https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg';

const CourseDetails = () => {
  const authState = useSelector((state) => state.auth)
  const axiosPrivate = useAxiosPrivate()
  const toastHelper = new ToastHelper()
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state && location.state.courseId;

  const [editReview ,setEditReview] = useState(null)
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

  const [editValues, setEditValues] = useState({
    rating: null,
    review: "",
  })


  const handleEditOpen = (review) =>{
    setIsEdit(true)
    setEditValues({...editValues,rating: review.rating, review: review.review})
    setEditReview(review)
  }

  const closeEditModal = () =>{
    setIsEdit(false)
  }

  const [isReviewShow, setIsReviewShow] = useState(false)
  const [isBuy, setIsBuy] = useState(false)

  const makePayment = async () => {
    const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY)

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

  const handleEditReview = async ()=>{
    if (editValues.rating === editReview.rating && editValues.review.trim() === editReview.review) {
      toastHelper.showToast("please give the different review and rating")
      return;
    }

    if (editValues.rating === null || editValues.review.trim() === "") {
      toastHelper.showToast("please give the review and rating")
      return;
    }

    axiosPrivate.put(`/user/courseReview/${editReview._id}`, editValues)
      .then((res) => {
        console.log(res);
        setFetch(true)
        setEditReview(null)
        setIsEdit(false)
      })
      .catch((err) => {
        console.log(err);
      })

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
    <>
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

          {isReviewShow  && <div className="w-full p-5 flex flex-col gap-2">
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

          {isEdit  && <div className="w-full p-5 flex flex-col gap-2">
            <div>
              <div className='font-medium text-sm'>How would you rate it?</div>
              <Rating
                name="rating"
                value={editValues.rating}
                precision={0.5}
                onChange={(event, newValue) => setEditValues({ ...editValues, rating: newValue })}
              />
            </div>
            <div>
              <div className='font-medium text-sm'>Write your review</div>
              <Textarea label="Review" name='review' value={editValues.review} onChange={(e) => setEditValues({ ...editValues, review: e.target.value })} />
            </div>
            <div className='flex gap-2'>
              <Button size='sm' onClick={handleEditReview}>Submit</Button>  
              <Button size='sm' color='red' onClick={closeEditModal}>Close</Button>  
            </div>
          </div>}

          <div className="w-full p-5 flex flex-col gap-2">
            <div className='font-bold text-lg'>Reviews({reviews?.length})</div>
            {reviews && reviews.map((review) => (
               editReview?._id !== review._id && <div key={review._id} className='w-full h-20 bg-blue-gray-200 rounded-lg p-2 flex flex-col'>
                <div className='text-verySmall font-medium'>{review?.user?._id === authState.userId ? "You" : review?.user?.fullname}</div>
                <div className='flex justify-between'>
                  <div>
                    <Rating
                      size='small'
                      name="rating"
                      value={review?.rating}
                      precision={0.5}
                      readOnly
                    />
                    <div className='text-verySmall-1'>{review?.review}</div>
                  </div>
                  <div className='flex items-center'>
                    {review?.user?._id === authState.userId && <RiEdit2Fill className='cursor-pointer' onClick={()=>handleEditOpen(review)} />}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
        <Toaster />
      </div>

      {/* <Transition appear show={isEdit} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeEditModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Review
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <div>
                      <Rating
                        name="rating"
                        value={2.5}
                        precision={0.5}
                        // onChange={(event, newValue) => setValues({ ...values, rating: newValue })}
                      />
                    </div>
                    <Textarea label="Review" name='review' value={editReview?.review} onChange={(e) => setValues({ ...values, review: e.target.value })} />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      // onClick={handleEdit}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}

    </>
  )
}

export default CourseDetails
