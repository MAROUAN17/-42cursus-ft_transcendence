import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post('https://localhost:5000/login', { email: email, password: password },
            { withCredentials: true }
        )
            .then(function(res) {
                navigate("/");
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
                        <a href="https://localhost:5000/intra42/login"><img className="w-[32px] h-[32px]" src="/42-icon.png" alt="42 icon" /></a>
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
