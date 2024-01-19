import React, { useState } from "react";
import { Input, Button } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GridLoader } from "react-spinners";
import CircularProgress from "@mui/material/CircularProgress";

import Navbar from "../../components/navbars/Navbar";
import LoginImage from "../../asset/login.svg";
import axios from "../../helper/axios";
import ToastHelper from "../../helper/ToastHelper";
import OtpComponent from "../../components/auth/OtpComponent";
import { toggleOtpPage } from "../../features/uiSettingsSlice ";

const toastHelper = new ToastHelper();

function Registration() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uiSettingsState = useSelector((state) => state.uiSettings);
  const [passwordType, setPasswordType] = useState(true);
  const [rePasswordType, setRePasswordType] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
    isTeacher: false,
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return passwordRegex.test(password);
  }

  const handleSubmit = () => {
    const { fullname, email, password, confirmpassword } = values;
    if (
      fullname.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmpassword.trim() === ""
    ) {
      toastHelper.showToast("fill the form");
      return;
    }

    if (!isValidEmail(email)) {
      toastHelper.showToast("email not in correct form");
      return;
    }

    if (!isValidPassword(password)) {
      toastHelper.showToast(
        "Password must be at least 6 characters and contain at least one digit, one lowercase letter, and one uppercase letter",
      );
      return;
    }

    if (password !== confirmpassword) {
      toastHelper.showToast("password doesnot match");
      return;
    }

    const postData = {
      ...values,
      fullname: values.fullname.trim(),
      email: values.email.trim(),
      password: values.password.trim(),
      isTeacher: enabled,
    };
    setIsLoading(true);
    // dispatch(toggleOtpPage())

    axios
      .post("/signup", postData, {
        withCredentials: true,
        credentials: "include",
      })
      .then((res) => {
        navigate("/otp");
        console.log("success");
      })
      .catch((err) => {
        setIsLoading(false);
        toastHelper.showToast(err.response.data.message);
        console.log(err.message);
      });
  };

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value.trim() });
  };

  return (
    <div
      className={
        isLoading ? "flex h-screen w-screen items-center justify-center" : ""
      }
    >
      {/* {isLoading ? (
        <GridLoader />
      ) : ( */}
        <div className="h-screen w-screen overflow-hidden">
          <Navbar text="Login" onClick={() => navigate("/login")} />
          <div className=" flex h-full flex-col md:flex-row">
            <div className="flex h-1/4 w-full items-center justify-center md:hidden">
              <img className="h-full w-full" src={LoginImage} alt="" />
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-8 md:w-1/2">
              <div className="text-2xl">Sign up</div>
              <div className="flex w-3/4 flex-col gap-6 md:w-1/2">
                <Input
                  variant="standard"
                  name="fullname"
                  label="Full Name"
                  color="black"
                  className="!text-black"
                  pattern="^[A-Za-z0-9]{3,16}$"
                  onChange={handleChanges}
                />
                <Input
                  variant="standard"
                  name="email"
                  label="Email"
                  color="black"
                  className="!text-black"
                  onChange={handleChanges}
                />
                <Input
                  variant="standard"
                  name="password"
                  label="Password"
                  type={passwordType ? "password" : "text"}
                  color="black"
                  className="!text-black"
                  onChange={handleChanges}
                  icon={
                    passwordType ? (
                      <FaEyeSlash
                        onClick={() => setPasswordType(!passwordType)}
                      />
                    ) : (
                      <FaEye onClick={() => setPasswordType(!passwordType)} />
                    )
                  }
                />
                <Input
                  variant="standard"
                  name="confirmpassword"
                  label="Re-Password"
                  type={rePasswordType ? "password" : "text"}
                  color="black"
                  className="!text-black"
                  onChange={handleChanges}
                  icon={
                    rePasswordType ? (
                      <FaEyeSlash
                        onClick={() => setRePasswordType(!rePasswordType)}
                      />
                    ) : (
                      <FaEye
                        onClick={() => setRePasswordType(!rePasswordType)}
                      />
                    )
                  }
                />
                <label
                  className="flex items-center gap-3 text-xs"
                  htmlFor="sldfa"
                >
                  <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    name="isTeacher"
                    className={`${
                      enabled ? "bg-gray-800" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full border-2 border-gray-400`}
                  >
                    {/* <span className="sr-only">Enable notifications</span> */}
                    <span
                      className={`${
                        enabled ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-gray-400 transition`}
                    />
                  </Switch>
                  sign up as teacher
                </label>
              </div>
              <div>
                {isLoading ? (
                  <Button className="h-12 flex justify-center items-start" variant="filled">
                    <CircularProgress size={'2rem'} color="primary" />
                  </Button>
                ) : (
                  <Button className="h-12" variant="filled" onClick={handleSubmit}>
                    Sign up
                  </Button>
                )}
              </div>
              {/* <div className="flex w-3/4 items-start justify-center md:w-1/2 md:justify-start">
                <Button variant="filled" onClick={handleSubmit}>
                  Sign up
                </Button>
              </div> */}
            </div>

            <div className="hidden w-1/2 items-center justify-center md:flex">
              <img className="h-2/3 w-2/3" src={LoginImage} alt="" />
            </div>
          </div>
          <Toaster />
        </div>
      {/* )} */}
    </div>
  );
}

export default Registration;
