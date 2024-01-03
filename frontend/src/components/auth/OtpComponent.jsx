import { Button } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import axios from '../../helper/axios'
import ToastHelper from '../../helper/ToastHelper'

const OtpComponent = ({path, email}) => {
    const navigate = useNavigate()
    const toastHelper = new ToastHelper()
    const [otp, setOtp] = useState('')
    const [countdownTime, setCountdownTime] = useState(90);
    const [message, setMessage] = useState('');

    const handleOtpVerify = () => {
        if (otp.length !== 4) {
            toastHelper.showToast("Fill the OTP")
            return;
        }
        console.log(otp);

        axios.post("/otpVerify", { otp }, {
            withCredentials: true
        })
            .then((res) => {
                path ? navigate(path, {state: {email}}) : navigate('/login')
            })
            .catch((err) => {
                console.log(err);
                toastHelper.showToast(err?.response?.data?.message);
            })
    }

    const handleOtpResend = () => {

        axios.get("/otpResend", {
            withCredentials: true,
        })
            .then((res) => {
                console.log(res);
                toastHelper.showToast(res?.data?.message)
                setCountdownTime(90);
            })
            .catch((err) => {
                console.log(err);
                toastHelper.showToast(err?.response?.data?.message);
            })
    }

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setCountdownTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
          }, 1000);

          return () => clearInterval(timerInterval);
    }, []);

    return (
        <div className='h-screen w-screen bg-otp-bg flex justify-center items-center px-2'>
            <div className='h-60 w-72 bg-white flex flex-col justify-around items-center shadow-2xl rounded-lg '>
                <div className='w-full flex flex-col items-center justify-center gap-2'>
                    <div className='font-semibold text-center'>OTP Verification</div>
                    <div className='text-xs px-2 text-center'>OTP Send to your registered email</div>
                </div>
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputType='number'
                    shouldAutoFocus
                    inputStyle="[&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] text-4xl  h-13 focus:outline-none focus:shadow-outline border border-gray-500 caret-transparent"
                />
                <div className=' font-medium text-center w-full'>Time Remaining: <span className='text-red-500'>{countdownTime}</span></div>
                <div className='w-full flex justify-center items-center gap-2'>
                    <Button size='sm' onClick={handleOtpVerify}>Verify</Button>
                    <Button size='sm' disabled={countdownTime !== 0 ? true : false} onClick={handleOtpResend} >Resend OTP</Button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default OtpComponent
