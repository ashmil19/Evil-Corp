import React from 'react'
import { useLocation } from 'react-router-dom';

import OtpComponent from './OtpComponent'

const ForgotPasswordOtp = () => {
  const location = useLocation();
  const email = location.state && location.state.email;

  return (
    <>
     <OtpComponent email={email} path="/newpassword" /> 
    </>
  )
}

export default ForgotPasswordOtp
