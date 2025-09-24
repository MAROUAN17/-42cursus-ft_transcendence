import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";


export default function ResetPasswordForm() {
    const [email, setEmail] = useState<string>('');
    const [errorMssg, setErrorMssg] = useState<string>('');
    const [errorFlag, setErrorFlag] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);

    const emailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorFlag(false);
        setErrorMssg('');
        setEmail(e.target.value);
    }

    const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('https://localhost:4000/reset-password', { email: email })
            .then(function(res) {
                console.log(res);
                setEmailSent(true);
            })
            .catch(function(err) {
                console.log(err);
                setErrorFlag(true)
                setErrorMssg(err.response.data.error);
            })
    }

    return (
        <div className="flex justify-between font-poppins h-screen bg-gameBg items-center overflow-hidden">
            {emailSent 
            ?
            <div className="xl:py-[260px] xl:px-[300px] xl:mt-32 lg:mt-18 lg:w-[1320px] lg:px-[210px]">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <img width="80px" height="80px" src="/mail-icon.png" alt="" />
                    </div>
                    <div className="space-y-12">
                        <h1 className="text-white font-bold text-6xl">Check your email</h1>
                        <p className="text-white text-xl">we've sent a password reset link to your email. Please check your inbox and follow the steps to reset your password</p>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-12">
                    <a href="/login"><img width="60px" height="60px" src="arrow-icon.png" alt="" /></a>
                    <a href="/login"><p className="text-xl font-bold text-white">Back to login</p></a>
                </div>
            </div> 
            :
            <div className="xl:py-[260px] xl:px-[300px] xl:mt-32 lg:mt-18 lg:w-1/2 lg:px-[210px]">
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <img width="92px" height="86px" src="/mail-icon.png" alt="" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-6xl">FORGOT PASSWORD</h1>
                        <p className="text-white">Enter the email address you used to create the account, and we will email you with instructions to reset your password</p>
                    </div>
                </div>
                <form onSubmit={formHandler}>
                    <div className="mt-20">
                        <label className="flex text-gray-300">Email</label>
                        <input value={email} onChange={emailInput} required className={`text-white bg-transparent ${errorFlag ? "border-b border-red-700" : "border-b border-white"} py-4 mt-5 w-full`} type="email" placeholder="Enter your email" />
                        {errorFlag && (
                            <p className="mt-3 text-red-500">{errorMssg}</p>
                        )}
                    </div>
                    <div className="text-center mt-20">
                        <button type="submit" className="bg-neon text-white text-lg px-[210px] py-3 rounded-lg font-semibold">Continue</button>
                    </div>
                    <div className="flex justify-center items-center mt-12">
                        <a href="/login"><img width="60px" height="60px" src="arrow-icon.png" alt="" /></a>
                        <a href="/login"><p className="text-xl font-bold text-white">Back to login</p></a>
                    </div>
                </form>
            </div>
            }
            <div className="">
                <img src="/login-page.png" alt="" />
            </div>
        </div>
    )
} 