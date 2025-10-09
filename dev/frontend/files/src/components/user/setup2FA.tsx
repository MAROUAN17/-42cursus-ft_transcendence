import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import api from "../../axios";

interface props {
  id: number | undefined;
  email: string | undefined;
  setSetup2fa: React.Dispatch<React.SetStateAction<boolean>>;
  setTwoFAverified: React.Dispatch<React.SetStateAction<boolean>>;
}

const Setup2FA: React.FC<props> = (props) => {
  const [errorMssg, setErrorMssg] = useState<string>("");
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [qrCodeSecret, setQrCodeSecret] = useState<string>("");
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
    api
      .post("/2fa/setup/verify", { token: otpNbr, secret: qrCodeSecret }, { withCredentials: true })
      .then(function (res) {
        // navigate("/");
        props?.setSetup2fa(false);
        props?.setTwoFAverified(true);
      })
      .catch(function (err) {
        setErrorFlag(true);
        setErrorMssg(err.response.data.error);
      });
  };

  async function renderQRcode() {
    api("/2fa/setup", { withCredentials: true })
      .then(function (res) {
        setQrCode(res.data[0]);
        setQrCodeSecret(res.data[1]);
      })
      .catch(function (err) {
        navigate(-1);
      });
  }

  useEffect(() => {
    renderQRcode();
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="bg-darkBg absolute z-10 inset-x-[850px] inset-y-[120px] flex justify-center px-32 py-32 rounded-xl font-poppins">
      <div className="items-center">
        <div className="text-center align-center space-y-6">
          <div className="space-y-5">
            <div className="flex justify-center">
              <img src="/lock-icon.png" alt="email-icon" width="92px" height="86px" />
            </div>
            <h1 className="text-white font-bold text-6xl">Scan QR code</h1>
            <p className="text-white text-xl font-light">Scan this QR code in-app to verify the device</p>
          </div>
        </div>

        {errorFlag ? (
          <div className="flex justify-center mt-4">
            <div className="flex text-center rounded-xl bg-red-600 w-[420px] h-[120px] items-center justify-center">
              <p className="text-white font-bold text-2xl align-center">{errorMssg}</p>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex justify-center mt-12">
          <img width="200px" height="200px" src={qrCode} alt="qrcode" />
        </div>
        <form onSubmit={formHandler}>
          <div className="flex justify-center space-x-12">
            <div className="flex justify-center space-x-3 text-center mt-20">
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
                    className=" text-white text-4xl text-center w-[68px] h-[100px] bg-gameBg border border-white rounded-lg"
                    required
                    type="text"
                  />
                ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <button type="submit" className="bg-neon font-bold text-white text-xl px-[190px] py-3 rounded-lg">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setup2FA;
