import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";

export default function NewPassword() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [errorMssg, setErrorMssg] = useState<string>("");
  const [timerVerify, setTimerVerify] = useState<number>(5);

  const submitPassReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword != confirmPassword) {
      setErrorFlag(true);
      setErrorMssg("Password is not matching!");
      return;
    }
    axios
      .post("https://localhost:5000/reset-password/verify", {
        token: token,
        password: newPassword,
        confirmPassword: confirmPassword,
      })
      .then(function (res) {
        navigate("/login");
      })
      .catch(function (err) {
        setErrorFlag(true);
        setErrorMssg(err.response.data.error);
      });
  };

  const passInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setNewPassword(e.target.value);
  };

  const passConfirmInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setConfirmPassword(e.target.value);
  };

  useEffect(() => {
    axios.post("https://localhost:5000/reset-password/check", { token: token }).catch(function (err) {
      if (err.response.data.error === "EXPIRED") setExpired(true);
      else navigate("/login");
      const intervId = setInterval(() => {
        setTimerVerify((prevTime) => {
          if (prevTime == 0) {
            clearInterval(intervId);
            navigate("/login");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => {
        clearInterval(intervId);
      };
    });
  }, []);

  return (
    <div className="flex justify-between font-poppins h-screen bg-gameBg items-center overflow-hidden">
      <div className="h-full xl:py-[260px] xl:px-[300px] xl:mt-32 lg:mt-18 lg:w-1/2 lg:px-[220px] space-y-12">
        {expired ? (
          <div className="h-full text-center">
            <h1 className="text-white font-bold text-5xl">Link Already Expired</h1>
            <h2 className="text-white font-light">you'll be redirected to login in {timerVerify}s</h2>
          </div>
        ) : (
          <div className="my-24 space-y-12">
            <div>
              <div className="flex justify-center">
                <img src="/reset-password.png" alt="email-icon" width="92px" height="86px" />
              </div>
            </div>
            <div>
              <h1 className="text-white xl:text-5xl lg:text-4xl font-bold text-center">SET YOUR NEW PASSWORD</h1>
              <p className="text-white text-center text-md py-2 font-light">Your new password should be different from passwords previously used.</p>
            </div>
            {/* this is the password input */}
            <form onSubmit={submitPassReset}>
              <div className="space-y-16">
                <div>
                  <label className="flex text-gray-300">Password</label>
                  <div className="flex items-center mt-5">
                    <input
                      value={newPassword}
                      onChange={passInput}
                      required
                      className={`text-white bg-transparent border-b border-white py-4 w-full`}
                      type="password"
                      placeholder="Password"
                    />
                  </div>
                  {errorFlag && <p className="mt-3 text-red-500">{errorMssg}</p>}
                </div>
                <div className="">
                  <label className="flex text-gray-300">Confirm your new password</label>
                  <div className="">
                    <input
                      value={confirmPassword}
                      onChange={passConfirmInput}
                      required
                      className={`text-white bg-transparent border-b border-white py-4 w-full`}
                      type="password"
                      placeholder="Confirm Password"
                    />
                  </div>
                  {errorFlag && <p className="mt-3 text-red-500">{errorMssg}</p>}
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-56 py-4 rounded-xl text-white bg-neon font-bold shadow-neon shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="">
        <img src="/login-page.png" alt="" />
      </div>
    </div>
  );
}
