import { useState } from "react";
import axios from "axios";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8088/register', { username:username, email: email, password: password })
            .then(function(res) {
                console.log(res.data);
            })
            .catch(function(err) {
                console.log(err.response.data);
            })
    }
    
    const emailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const passInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setPassword(e.target.value)
    }
    
    const usernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setUsername(e.target.value)
    }

    return (
        <div className="flex justify-between font-poppins h-screen bg-gameBg overflow-hidden items-center">
            <div className="xl:py-[260px] xl:px-[360px] xl:mt-12 lg:mt-24 lg:w-1/2 lg:px-[220px]">
                <div className="">
                    <h1 className="text-white text-center xl:text-9xl lg:text-8xl font-bold">
                        SIGNUP
                    </h1>
                    <p className="text-white text-center text-xl py-2 font-light">
                        Join and have fun with your friends
                    </p>
                </div>
                <form onSubmit={handleForm}>
                    <div className="xl:my-24 xl:my-12 lg:my-14 space-y-12">
                        <div>
                            <label className="flex text-gray-300">Username</label>
                            <input value={username} onChange={usernameInput} className="text-white bg-transparent border-b border-white py-4 mt-5 w-full" id="username" type="text" placeholder="username" />
                        </div>
                        <div>
                            <label className="flex text-gray-300">Email</label>
                            <input value={email} onChange={emailInput} className="text-white bg-transparent border-b border-white py-4 mt-5 w-full" id="email" type="text" placeholder="Email" />
                        </div>
                        {/* this is the password input */}
                        <div className="">
                            <label className="flex text-gray-300">Password</label>
                            <div className="flex items-center mt-5">
                                <input value={password} onChange={passInput} className="text-white bg-transparent border-b border-white py-4 w-full" id="password" type="password" placeholder="Password" />
                                {/* <a href=""><img className="w-[18px] h-[18px]" src="/eye.png" alt="hide icon" /></a> */}
                            </div>
                        </div>
                        {/* login button */}
                        <div className="flex justify-between items-center xl:space-x-52 lg:space-x-4">
                            <div className="flex space-x-3">
                                <input type="checkbox" />
                                <p className="text-white xl:text-base lg:text-sm whitespace-nowrap">I accept the terms and conditions</p>
                            </div>
                            <button className="px-12 py-4 rounded-xl text-white bg-neon font-bold shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                                REGISTER
                            </button>
                        </div>

                        {/* login with others section */}
                        <div className="flex justify-between items-center">
                            <hr className="xl:w-[35%] lg:w-[30%]"></hr>
                            <h1 className="text-white">Login with others</h1>
                            <hr className="xl:w-[35%] lg:w-[30%]"></hr>
                        </div>
                        <div className="flex justify-center">
                            <img className="w-[32px] h-[32px]" src="/42-icon.png" alt="42 icon" />
                        </div>
                        <div className="flex justify-center">
                            <h1 className="text-white font-light">Already have an account? <span className="font-bold"><a href="/login" className="href">Login</a></span></h1>
                        </div>
                    </div>
                </form>
                
            </div>
            <div className="xl:w-[50%] overflow-hidden lg:w-1/2">
                <img src="/login-page.png" alt="" />
            </div>
        </div>
    )
}

export default Register;