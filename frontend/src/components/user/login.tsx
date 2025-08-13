import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('http://localhost:8088/login', { email: email, password: password })
            .then(function(res) {
                console.log(res.data);
                localStorage.setItem('jwtToken', res.data.token);

                console.log(localStorage.getItem('jwtToken'));
                navigate('/game');
            })
            .catch(function (err) {
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

    return (
        <div className="flex justify-between font-poppins h-screen bg-gameBg items-center overflow-hidden">
            <div className="xl:py-[260px] xl:px-[300px] xl:mt-32 lg:mt-24 lg:w-1/2 lg:px-[220px]">
                <form onSubmit={handleForm}>
                <div>
                    <h1 className="text-white xl:text-9xl lg:text-8xl font-bold">
                        WELCOME
                    </h1>
                    <p className="text-white text-center text-xl py-2 font-light">
                        We are glad to see you back with us
                    </p>
                </div>
                <div className="my-24 space-y-12">
                    <div>
                        <label className="flex text-gray-300">Email or username</label>
                        <input value={email} onChange={emailInput} className="text-white bg-transparent border-b border-white py-4 mt-5 w-full" id="email" type="text" placeholder="Email or username" />
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
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                            <input type="checkbox" id="remember" />
                            <p className="text-white text-md rounded-full ">Remember me</p>
                        </div>c
                        <button type="submit" className="px-12 py-4 rounded-xl text-white bg-neon font-bold shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
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
                        <img className="w-[32px] h-[32px]" src="/42-icon.png" alt="42 icon" />
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-white font-light">Don't have an account? <span className="font-bold"><a href="/register" className="href">Signup</a></span></h1>
                    </div>
                </div>
                </form>
            </div>
            <div className="">
                <img src="/login-page.png" alt="" />
            </div>
        </div>
    );
}

export default Login;
