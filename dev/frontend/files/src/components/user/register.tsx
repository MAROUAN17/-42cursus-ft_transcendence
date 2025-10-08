import { useState } from "react";
import { useNavigate } from "react-router";
import Setup2FA from "./setup2FA";
import api from "../../axios";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameErrorMssg, setUsernameErrorMssg] = useState<string>("");
  const [usernameErrorFlag, setUsernameErrorFlag] = useState<boolean>(false);
  const [passErrorMssg, setPassErrorMssg] = useState<string>("");
  const [passErrorFlag, setPassErrorFlag] = useState<boolean>(false);
  const [emailErrorMssg, setEmailErrorMssg] = useState<string>("");
  const [emailErrorFlag, setEmailErrorFlag] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post("/register/verify", {
        username: username,
        email: email,
        password: password,
      })
      .then(function () {
        axios
          .post("https://localhost:5000/register", {
            username: username,
            email: email,
            password: password
          })
          .then(function (res) {
            navigate("/login");
          }).catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (err) {
        if (err.response.data.error.includes("Username")) {
          setUsernameErrorFlag(true);
          setUsernameErrorMssg(err.response.data.error);
        }
        if (err.response.data.error.includes("Email")) {
          setEmailErrorFlag(true);
          setEmailErrorMssg(err.response.data.error);
        }
        if (err.response.data.error.includes("Password")) {
          setPassErrorFlag(true);
          setPassErrorMssg(err.response.data.error);
        }
      });
  };

  const emailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmailErrorFlag(false);
    setEmail(e.target.value);
  };

  const passInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassErrorFlag(false);
    setPassword(e.target.value);
  };

  const usernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsernameErrorFlag(false);
    setUsername(e.target.value);
  };

  return (
    <div className="flex justify-between font-poppins h-screen bg-gameBg overflow-hidden items-center">
      <div className="xl:py-[260px] xl:px-[300px] xl:mt-12 lg:mt-24 w-1/2 lg:px-[220px]">
        <div className="">
          <h1 className="text-white text-center xl:text-9xl lg:text-8xl font-bold">
            SIGNUP
          </h1>
          <p className="text-white text-center text-xl py-2 font-light">
            Join and have fun with your friends
          </p>
        </div>
        <form onSubmit={handleForm}>
          <div className="xl:my-20 lg:my-14 space-y-10">
            <div>
              <label className="flex text-gray-300">Username</label>
              <input
                value={username}
                onChange={usernameInput}
                required
                className={`text-white bg-transparent ${
                  usernameErrorFlag
                    ? "border-b border-red-700"
                    : "border-b border-white"
                } py-4 mt-5 w-full`}
                id="username"
                type="text"
                placeholder="Username"
              />
              {usernameErrorFlag && (
                <p className="mt-3 text-red-500">{usernameErrorMssg}</p>
              )}
            </div>
            <div>
              <label className="flex text-gray-300">Email</label>
              <input
                value={email}
                onChange={emailInput}
                required
                className={`text-white bg-transparent ${
                  emailErrorFlag
                    ? "border-b border-red-700"
                    : "border-b border-white"
                }  py-4 mt-5 w-full`}
                id="email"
                type="email"
                placeholder="Email"
              />
              {emailErrorFlag && (
                <p className="mt-3 text-red-500">{emailErrorMssg}</p>
              )}
            </div>
            {/* this is the password input */}
            <div className="">
              <label className="flex text-gray-300">Password</label>
              <div className="flex items-center mt-5">
                <input
                  value={password}
                  onChange={passInput}
                  required
                  className={`text-white bg-transparent ${
                    passErrorFlag
                      ? "border-b border-red-700"
                      : "border-b border-white"
                  }  py-4 w-full`}
                  id="password"
                  type="password"
                  placeholder="Password"
                />
              </div>
              {passErrorFlag && (
                <p className="mt-3 text-red-500">{passErrorMssg}</p>
              )}
            </div>
            {/* login button */}
            <div className="flex flex-nowrap justify-between items-center xl:space-x-52 lg:space-x-4">
              <div className="flex space-x-3 w-full">
                <input type="checkbox" />
                <p className="text-white xl:text-base lg:text-sm whitespace-nowrap">
                  I accept the terms and conditions
                </p>
              </div>
              <button className="px-12 py-4 rounded-xl text-white bg-neon font-bold shadow-neon">
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
              <img
                className="w-[32px] h-[32px]"
                src="/42-icon.png"
                alt="42 icon"
              />
            </div>
            <div className="flex justify-center">
              <h1 className="text-white font-light">
                Already have an account?{" "}
                <span className="font-bold">
                  <a href="/login" className="href">
                    Login
                  </a>
                </span>
              </h1>
            </div>
          </div>
        </form>
      </div>
      <div className="xl:w-[50%] overflow-hidden lg:w-1/2">
        <img src="/login-page.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
