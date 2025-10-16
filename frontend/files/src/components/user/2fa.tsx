import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";

function Page2FA() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userEmail = searchParams.get("email");
  const [errorMssg, setErrorMssg] = useState<string>("");
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [timerVerify, setTimerVerify] = useState<number>(60);
  const [numbers, setNumbers] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const handleChange = (index: number, value: string) => {
    setErrorFlag(false);
    setErrorMssg("");

    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpNbr = numbers.join("");
    axios
      .post("https://localhost:5000/2fa/verify-token", { token: otpNbr, email: userEmail }, { withCredentials: true })
      .then(function (res) {
        console.log(res);
        navigate("/avatar");
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
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
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
            <img src="/lock-icon.png" alt="email-icon" width="92px" height="86px" />
          </div>
          <h1 className="text-white font-bold text-6xl">OTP Code</h1>
          <p className="text-white text-3xl font-light">Type your secret otp code</p>
        </div>
      </div>
      {errorFlag ? (
        <div className="flex justify-center mt-12">
          <div className="flex text-center rounded-xl bg-red-600 border border-white w-[420px] h-[120px] items-center justify-center">
            <p className="text-white font-bold text-2xl align-center">{errorMssg}</p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <form onSubmit={formHandler}>
        <div className="flex justify-center space-x-12">
          <div className="flex justify-center space-x-4 text-center mt-20">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <input
                  maxLength={1}
                  onChange={(e) => {
                    handleChange(i, e.target.value);
                  }}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  value={numbers[i]}
                  className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg"
                  required
                  type="text"
                />
              ))}
          </div>
        </div>
        <div className="mt-28 text-center">
          <button type="submit" className="bg-neon text-white text-xl px-[270px] py-3 rounded-lg font-semibold">
            Continue
          </button>
        </div>
      </form>
      <div className="text-center mt-12">
        <p className="text-white font-bold text-2xl">{formatTime(timerVerify)}</p>
      </div>
    </div>
  );
}

export default Page2FA;
