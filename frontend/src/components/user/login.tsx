function Login() {
    return (
        <div className="flex justify-between font-poppins h-screen bg-gameBg items-center overflow-hidden">
            <div className="py-[260px] px-[360px] mt-32">
                <div>
                    <h1 className="text-white text-9xl font-bold">
                        WELCOME
                    </h1>
                    <p className="text-white text-center text-xl py-2 font-light">
                        We are glad to see you back with us
                    </p>
                </div>
                <div className="my-24 space-y-12">
                    <div>
                        <label className="flex text-gray-300">Email or username</label>
                        <input className="text-white bg-transparent border-b border-white py-4 mt-5 w-full" id="email" type="text" placeholder="Email or username" />
                    </div>
                    {/* this is the password input */}
                    <div className="">
                        <label className="flex text-gray-300">Password</label>
                        <div className="flex items-center mt-5">
                            <input className="text-white bg-transparent border-b border-white py-4 w-full" id="password" type="password" placeholder="Password" />
                            {/* <a href=""><img className="w-[18px] h-[18px]" src="/eye.png" alt="hide icon" /></a> */}
                        </div>
                    </div>
                    {/* login button */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-3">
                            <input type="checkbox" />
                            <p className="text-white text-md whitespace-nowrap">Remember me</p>
                        </div>
                        <button className="px-12 py-4 rounded-xl text-white bg-neon font-bold shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                            Login
                        </button>
                    </div>

                    {/* login with others section */}
                    <div className="flex justify-between items-center">
                        <hr className="w-[35%]"></hr>
                        <h1 className="text-white">Login with others</h1>
                        <hr className="w-[35%]"></hr>
                    </div>
                    <div className="flex justify-center">
                        <img className="w-[52px] h-[52px]" src="/42-icon.png" alt="42 icon" />
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-white font-light">Don't have an account? <span className="font-bold"><a href="/register" className="href">Signup</a></span></h1>
                    </div>
                </div>
                
            </div>
            <div className="w-[50%] overflow-hidden">
                <img src="/login-page.jpg" alt="" />
            </div>
        </div>
    );
}

export default Login;
