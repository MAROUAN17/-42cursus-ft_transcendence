import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import api from "../../axios";
import { useWebSocket } from "../chat/websocketContext";
import type { ProfileUserInfo } from "../../types/user";

function Page2FA() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userEmail = searchParams.get("email");
  const [qrGenerated, setQrGenerated] = useState<boolean>(false);
  const [errorMssg, setErrorMssg] = useState<string>("");
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [nbrQrcode, setNbrQrcode] = useState<number>(0);
  const [timerVerify, setTimerVerify] = useState<number>(60);
  const [qrCode, setQrCode] = useState<string>("");
  const [firstNbr, setFirstNbr] = useState<string>("");
  const [secondNbr, setSecondNbr] = useState<string>("");
  const [thirdNbr, setThirdNbr] = useState<string>("");
  const [fourthNbr, setFourthNbr] = useState<string>("");
  const [fifthNbr, setFifthNbr] = useState<string>("");
  const [sixthNbr, setSixthNbr] = useState<string>("");
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);
  const input5Ref = useRef<HTMLInputElement>(null);
  const input6Ref = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const handleFirstNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setFirstNbr(e.target.value);
    input2Ref.current!.focus();
  };
  const handleSecondNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSecondNbr(e.target.value);
    setErrorFlag(false);
    setErrorMssg("");
    input3Ref.current!.focus();
  };
  const handleThirdNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setThirdNbr(e.target.value);
    input4Ref.current!.focus();
  };
  const handleFourthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setFourthNbr(e.target.value);
    input5Ref.current!.focus();
  };
  const handleFifthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setFifthNbr(e.target.value);
    input6Ref.current!.focus();
  };
  const handleSixthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setErrorMssg("");
    setSixthNbr(e.target.value);
  };
  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpNbr =
      firstNbr + secondNbr + thirdNbr + fourthNbr + fifthNbr + sixthNbr;
    axios
      .post(
        "https://localhost:5000/2fa/verify-token",
        { token: otpNbr, email: userEmail },
        { withCredentials: true }
      )
      .then(function (res) {
        console.log(res);
        navigate("/");
      })
      .catch(function (err) {
        if (err.response.data.error == "INVALID_OTP") {
          setErrorFlag(true);
          setErrorMssg("OTP code incorrect");
          return;
        }

        navigate("/login");
      });
  };

  const formatTime = (timerVerify: number) => {
    const minutes = Math.floor(timerVerify / 60);
    const seconds = timerVerify % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    input1Ref.current?.focus();
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
  }, []);

  return (
    <div className="bg-gameBg h-screen font-poppins">
      <div className="">
        <a href="/login">
          <img src="/arrow-icon.png" width="80px" height="80px" alt="" />
        </a>
      </div>
      <div className="text-center align-center space-y-9 mt-44">
        <div className="space-y-5">
          <div className="flex justify-center">
            <img
              src="/lock-icon.png"
              alt="email-icon"
              width="92px"
              height="86px"
            />
          </div>
          <h1 className="text-white font-bold text-6xl">OTP Code</h1>
          <p className="text-white text-3xl font-light">
            Type your secret otp code
          </p>
        </div>
      </div>
      {errorFlag ? (
        <div className="flex justify-center mt-12">
          <div className="flex text-center rounded-xl bg-red-600 border border-white w-[420px] h-[120px] items-center justify-center">
            <p className="text-white font-bold text-2xl align-center">
              {errorMssg}
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <form onSubmit={formHandler}>
        <div className="flex justify-center space-x-12">
          <div className="flex justify-center space-x-3 text-center mt-20">
            <input
              maxLength={1}
              onChange={handleFirstNbr}
              ref={input1Ref}
              value={firstNbr}
              className=" text-white text-4xl text-center w-[80px] h-[139px] bg-gameBg border border-white rounded-lg"
              required
              type="text"
            />
            <input
              maxLength={1}
              onChange={handleSecondNbr}
              ref={input2Ref}
              value={secondNbr}
              className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg"
              required
              type="text"
            />
            <input
              maxLength={1}
              onChange={handleThirdNbr}
              ref={input3Ref}
              value={thirdNbr}
              className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg"
              required
              type="text"
            />
          </div>
          <div className="flex justify-center space-x-3 text-center mt-20">
            <input
              maxLength={1}
              onChange={handleFourthNbr}
              ref={input4Ref}
              value={fourthNbr}
              className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg"
              required
              type="text"
            />
            <input
              maxLength={1}
              onChange={handleFifthNbr}
              ref={input5Ref}
              value={fifthNbr}
              className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg"
              required
              type="text"
            />
            <input
              maxLength={1}
              onChange={handleSixthNbr}
              ref={input6Ref}
              value={sixthNbr}
              className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg"
              required
              type="text"
            />
          </div>
        </div>
        <div className="mt-28 text-center">
          <button
            type="submit"
            className="bg-neon text-white text-xl px-[270px] py-3 rounded-lg font-semibold"
          >
            Continue
          </button>
        </div>
      </form>
      <div className="text-center mt-12">
        <p className="text-white font-bold text-2xl">
          {formatTime(timerVerify)}
        </p>
      </div>
    </div>
  );
}

export default Page2FA;
