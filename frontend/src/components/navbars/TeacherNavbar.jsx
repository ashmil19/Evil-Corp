import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Transition } from "@headlessui/react";
import "hover.css/css/hover-min.css";
import { useSelector, useDispatch } from "react-redux";

import { logOut } from "../../features/authSlice";
import { axiosPrivate } from "../../helper/axios";
import useLogout from "../../hooks/useLogout";
import myLogo from "../../asset/logo.svg";

function TeacherNavbar() {
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <nav className="w-screen bg-custom-bg-color">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 w-full items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="flex-shrink-0">
                <div
                  className="h-10 w-10"
                  style={{ backgroundImage: `url(${myLogo})` }}
                ></div>
              </div>
              <div className="hidden lg:flex lg:justify-between">
                <div className=" flex items-center justify-between space-x-7">
                  <Link to="/teacher">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Dashboard
                    </p>
                  </Link>
                  <Link to="/teacher/uploadCourse">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Upload Course
                    </p>
                  </Link>
                  <Link to="/teacher/publicCourse">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Public Course
                    </p>
                  </Link>
                  <Link to="/teacher/chat">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Chat
                    </p>
                  </Link>
                  <Link to="/teacher/community">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Community
                    </p>
                  </Link>
                  <Link to="/teacher/transactions">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Payment
                    </p>
                  </Link>
                  <Link to="/teacher/profile">
                    <p className="text-sm hvr-underline-from-left cursor-pointer py-1 text-white">
                      Profile
                    </p>
                  </Link>
                </div>
              </div>
              <div>
                <span
                  className="text-custom-btn-color hvr-bounce-to-right hidden cursor-pointer bg-custom-btnColor px-3 py-1 font-medium  lg:block"
                  onClick={logout}
                >
                  Logout
                </span>
              </div>
            </div>
            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 p-2 text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="lg:hidden" id="mobile-menu">
              <div ref={ref} className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                <div className=" mb-3 flex flex-col gap-3">
                  <Link to="/teacher">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Dashboard
                    </p>
                  </Link>
                  <Link to="/teacher/uploadCourse">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Upload Course
                    </p>
                  </Link>
                  <Link to="/teacher/publicCourse">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Public Course
                    </p>
                  </Link>
                  <Link to="/teacher/chat">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Chat
                    </p>
                  </Link>
                  <Link to="/teacher/community">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Community
                    </p>
                  </Link>
                  <Link to="/teacher/transactions">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Payment
                    </p>
                  </Link>
                  <Link to="/teacher/profile">
                    <p className="text-medium cursor-pointer py-1 text-white">
                      Profile
                    </p>
                  </Link>
                </div>

                <span
                  className="text-custom-btn-color cursor-pointer bg-custom-btnColor px-3 py-1 font-medium lg:hidden"
                  onClick={logout}
                >
                  Logout
                </span>
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
}

export default TeacherNavbar;
