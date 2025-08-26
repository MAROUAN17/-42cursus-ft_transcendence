import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { redirect, Navigate, useNavigate } from "react-router";
import axios from "axios";

export interface Infos {
    username: string, 
    email: string
}

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMssg, setErrorMssg] = useState("");
    const [errorFlag, setErrorFlag] = useState(false);
    const [forgetFlag, setForgetFlag] = useState(false);
    const [otp1Value, setOtp1Value] = useState<string>("");
    const [otp2Value, setOtp2Value] = useState<string>("");
    const [otp3Value, setOtp3Value] = useState<string>("");
    const [otp4Value, setOtp4Value] = useState<string>("");
    const [otp5Value, setOtp5Value] = useState<string>("");
    const [otp6Value, setOtp6Value] = useState<string>("");
    const inputOtp1Ref = useRef<HTMLInputElement>(null);
    const inputOtp2Ref = useRef<HTMLInputElement>(null);
    const inputOtp3Ref = useRef<HTMLInputElement>(null);
    const inputOtp4Ref = useRef<HTMLInputElement>(null);
    const inputOtp5Ref = useRef<HTMLInputElement>(null);
    const inputOtp6Ref = useRef<HTMLInputElement>(null);

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('https://localhost:5000/login', { email: email, password: password },
            { withCredentials: true }
        )
            .then(function(res) {
                navigate("/verify");
            })
            .catch(function (err) {
                console.log(err.response.data.error);
                setErrorFlag(true);
                setErrorMssg(err.response.data.error);
            })
    }
    
    const emailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorFlag(false);
        setEmail(e.target.value);
    }

    const passInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorFlag(false);
        setPassword(e.target.value);
    }
    
    const handleForgotPass = () => {
        axios.post('https://localhost:5000/reset-password', {email: email}, {})
            .then(function(res) {
                console.log(res.data.message);
            })
            .catch(function (err) {
                setForgetFlag(false);
                setErrorFlag(true);
                setEmail("");
                setErrorMssg(err.response.data.error);
            })
    }

    return (
        <div className="flex justify-between font-poppins h-screen bg-gameBg items-center overflow-hidden">
            {forgetFlag 
            ? 
            <div className="xl:py-[260px] xl:px-[300px] xl:mt-32 lg:mt-18 lg:w-1/2 lg:px-[220px] space-y-12">
                <div className="space-y-6">
                    <h1 className="text-white font-bold text-5xl text-center">Check your email</h1>
                    <p className="text-white text-center font-light">We’ve sent you a passcode. Please check your inbox at m***************@g****.com.</p>
                </div>
                <div className="flex justify-center space-x-12">
                    <div className="flex justify-center space-x-3 text-center mt-16">
                        <input maxLength={1} ref={inputOtp1Ref} value={otp1Value} onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                e.preventDefault();
                                const val = e.target.value;
                                setOtp1Value(val);
                                if (val.length == 1)
                                    inputOtp2Ref.current?.focus();
                            }} className="caret-transparent text-white text-4xl text-center w-[80px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} ref={inputOtp2Ref} value={otp2Value}
                            onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setOtp2Value(val);
                                if (val.length == 1) 
                                    inputOtp3Ref.current?.focus();
                            }}
                            className="caret-transparent text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setOtp3Value(val);
                                if (val.length == 1) 
                                    inputOtp4Ref.current?.focus();
                            }} ref={inputOtp3Ref} value={otp3Value} className="caret-transparent text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    </div>
                    <div className="flex justify-center space-x-3 text-center mt-16">
                        <input maxLength={1} onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setOtp4Value(val);
                                if (val.length == 1) 
                                    inputOtp5Ref.current?.focus();
                            }} ref={inputOtp4Ref} value={otp4Value} className="caret-transparent text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setOtp5Value(val);
                                if (val.length == 1) 
                                    inputOtp6Ref.current?.focus();
                            }} ref={inputOtp5Ref} value={otp5Value} className="caret-transparent text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = e.target.value;
                                setOtp6Value(val);
                                if (val.length == 1) 
                                    inputOtp6Ref.current?.focus();
                            }} ref={inputOtp6Ref} value={otp6Value} className="caret-transparent text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    </div>
                </div>
                <div className="mt-12 flex justify-center">
                    <button type="submit" className="px-[280px] py-4 rounded-xl text-white bg-neon font-bold shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                        Continue
                    </button>
                </div>
                <div>
                    <h1 className="text-center font-light text-white">Didn't receive code? <span className="font-bold">Resend code</span></h1>
                </div>
                <div className="flex items-center justify-center mt-12">
                    <img width={30} height={30} src="/arrow-icon.png" alt="arrow-back" />
                    <button onClick={() => {setForgetFlag(false)}} className=""><p className="text-white font-bold">Back to login</p></button>
                </div>
            </div> 
            :
            <div className="xl:py-[260px] xl:px-[300px] xl:mt-32 lg:mt-24 lg:w-1/2 lg:px-[220px]">
                <div>
                    <h1 className="text-white xl:text-9xl lg:text-8xl font-bold">
                        WELCOME
                    </h1>
                    <p className="text-white text-center text-xl py-2 font-light">
                        We are glad to see you back with us
                    </p>
                </div>
                <form onSubmit={handleForm}>
                <div className="my-24 space-y-12">
                    <div>
                        <label className="flex text-gray-300">Email or username</label>
                        <input value={email} onChange={emailInput} required className={`text-white bg-transparent ${errorFlag ? "border-b border-red-700" : "border-b border-white"} py-4 mt-5 w-full`} id="email" type="text" placeholder="Email or username" />
                        {errorFlag && (
                            <p className="mt-3 text-red-500">{errorMssg}</p>
                        )}
                    </div>
                    {/* this is the password input */}
                    <div className="">
                        <label className="flex text-gray-300">Password</label>
                        <div className="flex items-center mt-5">
                            <input value={password} onChange={passInput} required className={`text-white bg-transparent ${errorFlag ? "border-b border-red-700" : "border-b border-white"} py-4 w-full`} id="password" type="password" placeholder="Password" />
                        </div>
                        {errorFlag && (
                            <p className="mt-3 text-red-500">{errorMssg}</p>
                        )}
                    </div>
                    {/* login button */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                            <input type="checkbox" id="remember" />
                            <p className="text-white text-md rounded-full ">Remember me</p>
                        </div>
                        <div className="">
                            <button className="" onClick={() => {setForgetFlag(true); handleForgotPass()}}><p className="text-white font-bold">Forgot password?</p></button>
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="px-56 py-4 rounded-xl text-white bg-neon font-bold shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                            Login
                        </button>
                    </div>

                    {/* login with others section */}
                    <div className="flex justify-between items-center">
                        <hr className="xl:w-[35%] lg:w-[30%]"></hr>
                        <h1 className="text-white">Login with others</h1>
                        <hr className="xl:w-[35%] lg:w-[30%]"></hr>
                    </div>
                    <div className="flex justify-center">
                        <a href="https://localhost:5000/intra42/login"><img className="w-[32px] h-[32px]" src="/42-icon.png" alt="42 icon" /></a>
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-white font-light">Don't have an account? <span className="font-bold"><a href="/register" className="href">Signup</a></span></h1>
                    </div>
                </div>
                </form>
            </div>}
            <div className="">
                <img src="/login-page.png" alt="" />
            </div>
        </div>
    );
}

export default Login;
