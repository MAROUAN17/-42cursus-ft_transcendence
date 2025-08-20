import { useEffect, useState, type FormEvent } from "react";
import type { Infos } from "../user/login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Page2FA() {
    // const [email, setEmail] = useState("clarion.agl@gmail.com");
    const [qrCode, setQrCode] = useState<string>('');
    const [firstNbr, setFirstNbr] = useState<string>('');
    const [secondNbr, setSecondNbr] = useState<string>('');
    const [thirdNbr, setThirdNbr] = useState<string>('');
    const [fourthNbr, setFourthNbr] = useState<string>('');
    const [fifthNbr, setFifthNbr] = useState<string>('');
    const [sixthNbr, setSixthNbr] = useState<string>('');
    const navigate = useNavigate();
    const [user, setUser] = useState<Infos>({ username: "", email: "" });
    const handleFirstNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFirstNbr(e.target.value);
        console.log(firstNbr);
    }
    const handleSecondNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSecondNbr(e.target.value);
        console.log(secondNbr);
    }
    const handleThirdNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setThirdNbr(e.target.value);
        console.log(thirdNbr);
    }
    const handleFourthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFourthNbr(e.target.value);
        console.log(fourthNbr);
    }
    const handleFifthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFifthNbr(e.target.value);
        console.log(fourthNbr);
    }
    const handleSixthNbr = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSixthNbr(e.target.value);
        console.log(fourthNbr);
    }
    const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpNbr = firstNbr + secondNbr + thirdNbr + fourthNbr + fifthNbr + sixthNbr;
        console.log(otpNbr);
        axios.post('https://localhost:5000/2fa/verify-token', { token: otpNbr }, { withCredentials: true })
            .then(function(res) {
                console.log(res);
                navigate('/');
            })
            .catch(function(err) {
                console.log(err.response.data);
            })
    }

    async function renderQRcode() {
        axios.get('https://localhost:5000/user', { withCredentials: true })
        .then(function(res) {
            axios.post('https://localhost:5000/2fa/verify', 
                { email: res.data.infos.email }, 
                { withCredentials: true })
            .then(function(res) {
                setQrCode(res.data);
            })
            .catch(function(err) {
                console.log(err.response.data);
            })
        })
        .catch(function(err) {
            console.log(err.response.data);
            navigate('/login');
        })
    }

    useEffect(() => {
        renderQRcode();
    }, []);
    return (
        <div className="bg-gameBg h-screen font-poppins">
            <div className="">
                <a href="/login"><img src="/arrow-icon.png" width="80px" height="80px" alt="" /></a>
            </div>
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
                    <input maxLength={1} onChange={handleFirstNbr} id="otp" name="otp" value={firstNbr} className=" text-white text-4xl text-center w-[80px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleSecondNbr} id="otp" name="otp" value={secondNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleThirdNbr} id="otp" name="otp" value={thirdNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                </div>
                <div className="flex justify-center space-x-3 text-center mt-20">
                    <input maxLength={1} onChange={handleFourthNbr} id="otp" name="otp" value={fourthNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleFifthNbr} id="otp" name="otp" value={fifthNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleSixthNbr} id="otp" name="otp" value={sixthNbr} className=" text-white text-4xl text-center w-[90px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                </div>
            </div>
            <div className="mt-12 text-center">
                <button type="submit" className="bg-neon text-white text-xl px-[270px] py-3 rounded-lg font-semibold">Continue</button>
            </div>
            </form>
        </div>
    )
}

export default Page2FA;
