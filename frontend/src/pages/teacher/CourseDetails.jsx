import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { FaUpload } from "react-icons/fa";
import { GoGrabber } from "react-icons/go";
import { RiDeleteBin7Fill } from "react-icons/ri";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";

import { Oval } from "react-loader-spinner";
import Dropzone from "react-dropzone";
import { Dialog, Transition } from "@headlessui/react";
import { Input, Textarea, Select, Option } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TeacherNavbar from "../../components/navbars/TeacherNavbar";
import ToastHelper from "../../helper/ToastHelper";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SortableItem from "../../components/teacher/SortableItem";
import { handleChapterUpload } from "../../thunks/socketThunks";
import { startIsProgressLoading, stopIsProgressLoading } from "../../features/socketSlice";

const profilePic =
  "https://akademi.dexignlab.com/react/demo/static/media/8.0ec0e6b47b83af64e0c9.jpg";
const dummyVideo =
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const socket = io("evilcorp.ashmil.shop", {
  transports: ["websocket", "polling"],
});

const CourseDetails = () => {
  const socketProgress = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const courseId = location.state && location.state.id;

  const toastHelper = new ToastHelper();

  const [progress, setprogress] = useState(0);
  const [progressLoading, setprogressLoading] = useState(false);

  const [fetch, setFetch] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isChapterOpen, setIsChapterOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const [demoVideo, setDemoVideo] = useState(null);
  const [chapterVideo, setChapterVideo] = useState(null);
  const [chapterValues, setChapterValues] = useState({
    title: "",
  });

  const [categories, setCategories] = useState(null);
  const [chapter, setChapter] = useState([]);
  const [course, setCourse] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    price: "",
  });

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setEditValues({
      title: course.title,
      description: course.description,
      price: course.price,
    });
    setSelectedCategory(course.category._id);
    setIsOpen(true);
  }

  function closeVideoModal() {
    setIsVideoOpen(false);
  }

  function openVideoModal() {
    setIsVideoOpen(true);
  }

  function closeImageModal() {
    setCoverImage(null);
    setIsImageOpen(false);
  }

  function openImageModal() {
    setIsImageOpen(true);
  }

  function closeChapterModal() {
    setChapterVideo("");
    setIsChapterOpen(false);
  }

  function openChapterModal() {
    setIsChapterOpen(true);
  }

  const handleEditImageDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith("image/")) {
      setCoverImage(acceptedFiles[0]);
    } else {
      toastHelper.showToast("Please upload a valid image file.");
    }
  };

  // const handleChapterThumpnailDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];

  //   if (file && file.type.startsWith('image/')) {
  //     setChapterThumbnail(acceptedFiles[0])
  //   } else {
  //     toastHelper.showToast('Please upload a valid image file.');
  //   }
  // };

  const handleDemoVideoDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith("video/")) {
      console.log(file);
      setDemoVideo(acceptedFiles[0]);
    } else {
      toastHelper.showToast("Please upload a valid video file.");
    }
  };

  const handleChapterVideoDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file && file.type.startsWith("video/")) {
      console.log(file);
      setChapterVideo(acceptedFiles[0]);
    } else {
      toastHelper.showToast("Please upload a valid video file.");
    }
  };

  const getBackgroundImage = () => {
    if (coverImage) {
      return URL.createObjectURL(coverImage);
    } else if (course?.coverImage?.url) {
      return course.coverImage.url;
    } else {
      return profilePic;
    }
  };

  const handleUploadChapter = () => {
    if (chapterValues.title === "" || !chapterVideo) {
      toastHelper.showToast("Fill the form");
      return;
    }

    const postData = {
      ...chapterValues,
      chapterVideo,
      courseId,
    };

    console.log(postData);

    axiosPrivate
      .post("/teacher/uploadChapter", postData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res.data?.Queued);

        if (res.data?.Queued) {
          setprogressLoading(true);
          dispatch(
            startIsProgressLoading({ isProgress: true, courseId: courseId }),
          );
        }
      })
      .catch((err) => {
        toastHelper.showToast(err?.response?.data?.message);
        console.log(err);
      });

    closeChapterModal();
  };

  const handleEditCourse = () => {
    if (
      editValues.title == "" ||
      editValues.description == "" ||
      editValues.price == ""
    ) {
      toastHelper.showToast("Fill the form");
      return;
    }

    if (
      editValues.title == course.title &&
      editValues.description == course.description &&
      editValues.price == course.price &&
      selectedCategory == course.category._id
    ) {
      toastHelper.showToast("values not changed");
      return;
    }

    console.log({ ...editValues, selectedCategory });
    const putData = { ...editValues, category: selectedCategory };

    axiosPrivate
      .put(`/teacher/course/${courseId}`, putData)
      .then((res) => {
        setMessage(res.data?.message);
        toastHelper.showToast(res.data?.message);
        console.log(res);
      })
      .catch((err) => {
        toastHelper.showToast(err?.response?.data?.message);
        console.log(err);
      });

    closeModal();
  };

  const handleChangeCourseImage = () => {
    if (!coverImage) {
      toastHelper.showToast("select an image");
      return;
    }

    axiosPrivate
      .put(
        `/teacher/courseImage/${courseId}`,
        { image: coverImage },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      )
      .then((res) => {
        setMessage(res.data?.message);
        setCoverImage(null);
        console.log(res);
        toastHelper.showToast(res.data?.message);
      })
      .catch((err) => {
        console.log(err);
        toastHelper.showToast(err?.response?.data?.message);
      });

    closeImageModal();
  };

  const handleChangeDemoVideo = () => {
    if (!demoVideo) {
      toastHelper.showToast("please fill the form");
      return;
    }

    setLoading(true);

    axiosPrivate
      .put(
        `/teacher/courseDemoVideo/${courseId}`,
        { demoVideo },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      )
      .then((res) => {
        console.log(res);
        setFetch(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    closeVideoModal();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeId = active.id._id;
    const overId = over.id._id;
    console.log(active);
    console.log(over);

    if (activeId !== overId) {
      setChapter((value) => {
        const activeIndex = value.indexOf(active.id);
        const overIndex = value.indexOf(over.id);

        const putData = {
          activeId,
          overId,
        };
        axiosPrivate
          .put(`/teacher/changeIndex/${courseId}`, putData)
          .catch((err) => {
            console.log(err);
          });

        return arrayMove(value, activeIndex, overIndex);
      });
    }
  };

  const handleChanges = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value.trim() });
  };

  const handleChapterValuesChanges = (e) => {
    setChapterValues({
      ...chapterValues,
      [e.target.name]: e.target.value.trim(),
    });
  };

  useEffect(() => {
    axiosPrivate
      .get(`/teacher/course/${courseId}`)
      .then((res) => {
        console.log(res.data.course);
        // setSelectedCategory(res.data.course.category.name)
        setCourse(res.data.course);
        setChapter(res.data.course.chapters);
      })
      .catch((err) => {
        console.log(err);
      });

    axiosPrivate
      .get("/teacher/category")
      .then((res) => {
        console.log(res.data.categories);
        setCategories(res.data.categories);
      })
      .catch((err) => {
        console.log(err);
      });

    setFetch(false);
  }, [message, fetch, socketProgress]);

  useEffect(() => {
    socket.on("videoUpload", (data) => {
      if (data?.isVideoUploaded) {
        dispatch(
          stopIsProgressLoading({ isProgress: false, courseId: courseId }),
        );
        setFetch(true);
      }
    });

    // const handleChapterUploadSocket = (data) => {
    //   dispatch(handleChapterUpload(data));
    // };

    // socket.on("videoUpload", handleChapterUploadSocket);

    return () => {
      socket.off("videoUpload");
    };
  }, [dispatch]);

  useEffect(() => {
    socket.on("chapterProgress", (data) => {
      console.log("d", data);
      setprogress(data?.progress);
    });

    return () => {
      socket.off("chapterProgress");
    };
  });

  return (
    <>
      <div className="h-auto overflow-hidden">
        <TeacherNavbar />

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}

        <div className="flex h-auto w-full flex-col gap-5 bg-dashboard-bg px-5 py-5 md:px-10 ">
          <div className="flex h-auto w-full flex-col gap-5  md:flex-row">
            <div className="flex h-auto w-full flex-col gap-5 md:w-1/2">
              <div className="flex w-full flex-col gap-4">
                <div className="w-full">
                  <video
                    width="700"
                    height="360"
                    className="rounded-t-lg"
                    controls
                    key={course?.demoVideo?.url}
                  >
                    {<source src={course?.demoVideo?.url} type="video/mp4" />}
                    Your browser does not support the video tag.
                  </video>
                  <div className="flex h-12 w-full items-center justify-center rounded-b-lg bg-gray-600">
                    <Button
                      size="sm"
                      className="rounded-full bg-custom-bg-color"
                      onClick={openVideoModal}
                    >
                      Change
                    </Button>
                  </div>
                </div>
                <div className="h-80 w-full">
                  <div
                    className="h-5/6 w-full rounded-t-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${getBackgroundImage()})` }}
                  ></div>
                  <div className="flex h-1/6 w-full items-center justify-center rounded-b-lg bg-gray-600">
                    <Button
                      className="rounded-full bg-custom-bg-color"
                      onClick={openImageModal}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex h-96 w-full flex-col justify-evenly gap-2 rounded-lg bg-teacher-card-bg p-8 text-white">
                <div className="">
                  <div className="text-xl font-bold">
                    {course && course.title}
                  </div>
                  <div className="text-xs font-normal opacity-80">
                    {course && course.category.name}
                  </div>
                </div>
                <div className="text-lg font-medium">
                  <span className="text-red-500">&#x20B9;</span>{" "}
                  {course && course.price}
                </div>
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-verySmall md:text-sm">
                  {course && course.description}
                </div>
                <div className="flex w-full justify-center">
                  <Button onClick={openModal}>Edit</Button>
                </div>
              </div>
            </div>

            <div className="flex h-96 w-full flex-col justify-start gap-2 rounded-lg bg-teacher-card-bg p-4 md:h-course md:w-1/2">
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={chapter && chapter}
                  strategy={verticalListSortingStrategy}
                >
                  {chapter &&
                    chapter.map((chap) => (
                      <SortableItem key={chap._id} id={chap} chapter={chap} />
                    ))}
                </SortableContext>
              </DndContext>
              {socketProgress.isProgressLoading &&
                socketProgress.courses?.includes(courseId) && (
                  <div className="flex h-16 w-full  items-center justify-center rounded-lg bg-gray-400 px-2">
                    <Box sx={{ position: "relative" }}>
                      <CircularProgress
                        variant="determinate"
                        sx={{
                          color: (theme) =>
                            theme.palette.grey[
                              theme.palette.mode === "light" ? 400 : 800
                            ],
                        }}
                        size={40}
                        thickness={4}
                        value={100}
                      />
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "#1a90ff"
                              : "#308fe8",
                          animationDuration: "550ms",
                          position: "absolute",
                          left: 0,
                          [`& .${circularProgressClasses.circle}`]: {
                            strokeLinecap: "round",
                          },
                        }}
                        size={40}
                        thickness={4}
                      />
                    </Box>
                  </div>
                )}

              {/* {uiSettings.isProgressLoading && (
                <div className="flex h-16 w-full  items-center justify-center rounded-lg bg-gray-300 px-2">
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      color="success"
                      value={progress}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        {progress}
                      </Typography>
                    </Box>
                  </Box>
                </div>
              )} */}
            </div>
          </div>
        </div>
        <div
          className="fixed bottom-5 right-10 flex h-8 w-12 cursor-pointer items-center justify-center rounded-lg bg-white text-Student-management"
          onClick={openChapterModal}
        >
          <FaUpload />
        </div>
        <Toaster />
      </div>

      {/* Edit details modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className={`fixed inset-0 bg-black/25`} />
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
                    Edit Course
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input
                      label="Title"
                      name="title"
                      value={editValues.title}
                      onChange={handleChanges}
                    />
                    <Select
                      variant="outlined"
                      label="Category"
                      id="category"
                      name="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e)}
                    >
                      {categories &&
                        categories.map((category) => {
                          return (
                            <Option value={category._id}>
                              {category.name}
                            </Option>
                          );
                        })}
                    </Select>
                    <Textarea
                      label="Description"
                      name="description"
                      value={editValues.description}
                      onChange={handleChanges}
                    />
                    <Input
                      type="number"
                      label="Price"
                      name="price"
                      value={editValues.price}
                      onChange={handleChanges}
                    />
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleEditCourse}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Change image modal */}
      <Transition appear show={isImageOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeImageModal}>
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
                    Image Upload
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Dropzone
                      accept={["image/*"]}
                      multiple={false}
                      onDrop={handleEditImageDrop}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            className="flex h-40 w-full cursor-pointer items-center justify-center border-2 border-dashed border-gray-400"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="flex h-full flex-col justify-center">
                              {coverImage ? (
                                <div className="flex h-1/3 items-center justify-center">
                                  {coverImage.name}
                                </div>
                              ) : (
                                <p>
                                  Drag 'n' drop image here, or click to select
                                  image
                                </p>
                              )}
                              {coverImage && (
                                <img
                                  className="h-2/3 w-full object-center pb-4"
                                  src={URL.createObjectURL(coverImage)}
                                ></img>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleChangeCourseImage}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* change video modal */}
      <Transition appear show={isVideoOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeVideoModal}>
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
                    Video Upload
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Dropzone
                      accept={["video/*"]}
                      multiple={false}
                      onDrop={handleDemoVideoDrop}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            className="flex h-40 w-full cursor-pointer items-center justify-center border-2 border-dashed border-gray-400"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="flex h-full flex-col justify-center">
                              {demoVideo ? (
                                <div className="flex h-1/3 items-center justify-center">
                                  {demoVideo.name}
                                </div>
                              ) : (
                                <p>
                                  Drag 'n' drop some video here, or click to
                                  select video
                                </p>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleChangeDemoVideo}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* chapter upload modal */}
      <Transition appear as={Fragment} show={isChapterOpen}>
        <Dialog as="div" className="relative z-10" onClose={closeChapterModal}>
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
                    Upload Chapter
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col gap-3">
                    <Input
                      label="Title"
                      name="title"
                      onChange={handleChapterValuesChanges}
                    />
                    <Dropzone
                      accept={["video/*"]}
                      multiple={false}
                      onDrop={handleChapterVideoDrop}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div
                            className="flex h-40 w-full cursor-pointer items-center justify-center border-2 border-dashed border-gray-400"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="flex h-full flex-col justify-center">
                              {chapterVideo ? (
                                <div className="flex h-1/3 items-center justify-center">
                                  {chapterVideo.name}
                                </div>
                              ) : (
                                <p>
                                  Drag 'n' drop some video here, or click to
                                  select video
                                </p>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleUploadChapter}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CourseDetails;
