import { useEffect, useState, useRef, type FormEvent, type InputHTMLAttributes, type KeyboardEvent } from "react";
import type { Infos } from "../user/login";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";

export default function Setup2FA() {
    const [searchParams, setSearchParams] = useSearchParams();
    const userEmail = searchParams.get('email');
    const [qrGenerated, setQrGenerated] = useState<boolean>(false);
    const [errorMssg, setErrorMssg] = useState<string>('');
    const [errorFlag, setErrorFlag] = useState<boolean>(false);
    const [nbrQrcode, setNbrQrcode] = useState<number>(0);
    const [timerVerify, setTimerVerify] = useState<number>(60);
    const [qrCode, setQrCode] = useState<string>("");
    const [firstNbr, setFirstNbr] = useState<string>('');
    const [secondNbr, setSecondNbr] = useState<string>('');
    const [thirdNbr, setThirdNbr] = useState<string>('');
    const [fourthNbr, setFourthNbr] = useState<string>('');
    const [fifthNbr, setFifthNbr] = useState<string>('');
    const [sixthNbr, setSixthNbr] = useState<string>('');
    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);
    const input3Ref = useRef<HTMLInputElement>(null);
    const input4Ref = useRef<HTMLInputElement>(null);
    const input5Ref = useRef<HTMLInputElement>(null);
    const input6Ref = useRef<HTMLInputElement>(null);


    const navigate = useNavigate();

    const handleFirstNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFirstNbr(e.target.value);
        input2Ref.current!.focus();
    }
    const handleSecondNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSecondNbr(e.target.value);
        input3Ref.current!.focus();
    }
    const handleThirdNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setThirdNbr(e.target.value);
        input4Ref.current!.focus();
    }
    const handleFourthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFourthNbr(e.target.value);
        input5Ref.current!.focus();
    }
    const handleFifthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFifthNbr(e.target.value);
        input6Ref.current!.focus();
    }
    const handleSixthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSixthNbr(e.target.value);
    }
    const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpNbr = firstNbr + secondNbr + thirdNbr + fourthNbr + fifthNbr + sixthNbr;
        axios.post('https://localhost:5000/2fa/setup/verify', { token: otpNbr, email: userEmail })
            .then(function(res) {
                console.log(res);
                navigate('/login');
            })
            .catch(function(err) {
                console.log(err.response.data);
                // navigate('/login');
            })
    }

    async function renderQRcode() {
        axios.post('https://localhost:5000/2fa/setup', 
            { email: userEmail })
            .then(function(res) {
                setQrCode(res.data);
            })
            .catch(function(err) {
                console.log(err);
                // navigate('/');
            })
    }

    const formatTime = (timerVerify: number) => {
        const minutes = Math.floor(timerVerify / 60);
        const seconds = timerVerify % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        renderQRcode();
        setNbrQrcode(nbrQrcode + 1);
        input1Ref.current?.focus();
        const intervId  = setInterval(() => {
            setTimerVerify((prevTime) => {
                if (prevTime == 0) {
                    clearInterval(intervId);
                    // navigate('/login');
                    return 0;
                } 
                return (prevTime - 1);
            });
        }, 1000)
        return () => { clearInterval(intervId); }
    }, []);

    return (
        <div className="absolute bg-gameBg flex left-[400px] justify-center px-48 py-48 rounded-lg font-poppins">
            <div className="items-center">
                <div className="">
                    <a href="/login"><img src="/arrow-icon.png" width="80px" height="80px" alt="" /></a>
                </div>
                {errorFlag ? 
                    <div>
                        <p className="text-red-900 font-bold text-xl">{errorMssg}</p>
                    </div>
                    :
                    <div></div>
                }
                <div className="text-center align-center space-y-9 mt-36">
                    <div className="space-y-5">
                        <div className="flex justify-center">
                            <img src="/lock-icon.png" alt="email-icon" width="92px" height="86px" />
                        </div>
                        <h1 className="text-white font-bold text-6xl">
                            Scan QR code
                        </h1>
                        <p className="text-white text-3xl font-light">Scan  this QR code in-app to verify the device</p>
                    </div>
                </div>
                <div className="flex justify-center mt-12">
                    <img width="220px" height="220px" src={qrCode} alt="qrcode" />
                </div>
                <form onSubmit={formHandler}>
                <div className="flex justify-center space-x-12">
                    <div className="flex justify-center space-x-3 text-center mt-20">
                        <input maxLength={1} onChange={handleFirstNbr} ref={input1Ref} value={firstNbr} className=" text-white text-4xl text-center w-[80px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleSecondNbr} ref={input2Ref} value={secondNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleThirdNbr} ref={input3Ref} value={thirdNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    </div>
                    <div className="flex justify-center space-x-3 text-center mt-20">
                        <input maxLength={1} onChange={handleFourthNbr} ref={input4Ref} value={fourthNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleFifthNbr} ref={input5Ref} value={fifthNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleSixthNbr} ref={input6Ref} value={sixthNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <button type="submit" className="bg-neon text-white text-xl px-[270px] py-3 rounded-lg font-semibold">Continue</button>
                </div>
                </form>
                <div className="text-center mt-12">
                    <p className="text-white font-bold text-2xl">{formatTime(timerVerify)}</p>
                </div>
            </div>
        </div>
    )
}