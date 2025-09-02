import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import type { UserInfo } from "../../types/user";


const Setup2FA: React.FC<UserInfo> = (user) => {
    const [errorMssg, setErrorMssg] = useState<string>('');
    const [errorFlag, setErrorFlag] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>("");
    const [qrCodeSecret, setQrCodeSecret] = useState<string>("");
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
        setErrorFlag(false);
        setErrorMssg('');
        setFirstNbr(e.target.value);
        input2Ref.current!.focus();
    }
    const handleSecondNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorFlag(false);
        setErrorMssg('');
        setSecondNbr(e.target.value);
        input3Ref.current!.focus();
    }
    const handleThirdNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorFlag(false);
        setErrorMssg('');
        setThirdNbr(e.target.value);
        input4Ref.current!.focus();
    }
    const handleFourthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setErrorFlag(false);
        setErrorMssg('');
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
        setErrorFlag(false);
        setErrorMssg('');
        setSixthNbr(e.target.value);
    }
    const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpNbr = firstNbr + secondNbr + thirdNbr + fourthNbr + fifthNbr + sixthNbr;
        axios.post('https://localhost:5000/2fa/setup/verify', { token: otpNbr, secret: qrCodeSecret })
            .then(function(res) {
                console.log(res);
                navigate('/login');
                axios.post('https://localhost:5000/register', { username:user.username, email: user.email, password: user.password, secret: qrCodeSecret })
                    .then(function(res) {
                        console.log(res.data);
                        navigate('/login');
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
            })
            .catch(function(err) {
                setErrorFlag(true);
                setErrorMssg(err.response.data.error);
            })
    }

    async function renderQRcode() {
        axios.post('https://localhost:5000/2fa/setup', 
            { email: user.email })
            .then(function(res) {
                setQrCode(res.data[0]);
                setQrCodeSecret(res.data[1]);
            })
            .catch(function(err) {
                navigate('/login');
            })
    }

    useEffect(() => {
        renderQRcode();
        input1Ref.current?.focus();
    }, []);

    return (
        <div className="absolute bg-gameBg border border-white flex left-[300px] top-28 justify-center px-32 py-32 rounded-xl font-poppins">
            <div className="items-center">
                <div className="text-center align-center space-y-6">
                    <div className="space-y-5">
                        <div className="flex justify-center">
                            <img src="/lock-icon.png" alt="email-icon" width="92px" height="86px" />
                        </div>
                        <h1 className="text-white font-bold text-5xl">
                            Scan QR code
                        </h1>
                        <p className="text-white text-xl font-light">Scan  this QR code in-app to verify the device</p>
                    </div>
                </div>

                {errorFlag ? 
                <div className="flex justify-center mt-12">
                    <div className="flex text-center rounded-xl bg-red-600 border border-white w-[420px] h-[120px] items-center justify-center">
                        <p className="text-white font-bold text-2xl align-center">{errorMssg}</p>
                    </div>
                </div>
                :
                <div></div>
                }

                <div className="flex justify-center mt-12">
                    <img width="200px" height="200px" src={qrCode} alt="qrcode" />
                </div>
                <form onSubmit={formHandler}>
                <div className="flex justify-center space-x-12">
                    <div className="flex justify-center space-x-3 text-center mt-20">
                        <input maxLength={1} onChange={handleFirstNbr} ref={input1Ref} value={firstNbr} className=" text-white text-4xl text-center w-[60px] h-[89px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleSecondNbr} ref={input2Ref} value={secondNbr} className=" text-white text-4xl text-center w-[60px] h-[89px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleThirdNbr} ref={input3Ref} value={thirdNbr} className=" text-white text-4xl text-center w-[60px] h-[89px] bg-gameBg border border-white rounded-lg" required type="text" />
                    </div>
                    <div className="flex justify-center space-x-3 text-center mt-20">
                        <input maxLength={1} onChange={handleFourthNbr} ref={input4Ref} value={fourthNbr} className=" text-white text-4xl text-center w-[60px] h-[89px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleFifthNbr} ref={input5Ref} value={fifthNbr} className=" text-white text-4xl text-center w-[60px] h-[89px] bg-gameBg border border-white rounded-lg" required type="text" />
                        <input maxLength={1} onChange={handleSixthNbr} ref={input6Ref} value={sixthNbr} className=" text-white text-4xl text-center w-[60px] h-[89px] bg-gameBg border border-white rounded-lg" required type="text" />
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <button type="submit" className="bg-neon text-white text-xl px-[190px] py-3 rounded-lg font-semibold">Continue</button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default Setup2FA;