import { useState, type FormEvent } from "react";

function Page2FA() {
    const [email, setEmail] = useState("clarion.agl@gmail.com");
    const [firstNbr, setFirstNbr] = useState<string>('');
    const [secondNbr, setSecondNbr] = useState<string>('');
    const [thirdNbr, setThirdNbr] = useState<string>('');
    const [fourthNbr, setFourthNbr] = useState<string>('');
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
    const formHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpNbr = firstNbr + secondNbr + thirdNbr + fourthNbr;
        console.log(otpNbr);
    }
    return (
        <div className="bg-gameBg h-screen font-poppins">
            <div className="">
                <a href="/login"><img src="/arrow-icon.png" width="80px" height="80px" alt="" /></a>
            </div>
            <div className="text-center align-center space-y-9 mt-44">
                <div className="space-y-5">
                    <div className="flex justify-center">
                        <img src="/email-icon.png" alt="email-icon" width="92px" height="86px" />
                    </div>
                    <h1 className="text-white font-bold text-5xl">
                        Check your email
                    </h1>
                </div>
                <div>
                    <p className="text-white text-2xl font-light">Enter verification code <br />sent to {email}</p>
                </div>
            </div>
            <form onSubmit={formHandler}>
            <div className="flex justify-center space-x-16 text-center mt-20">
                    <input maxLength={1} onChange={handleFirstNbr} id="otp" name="otp" value={firstNbr} className="text-white text-4xl text-center w-[139px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleSecondNbr} id="otp" name="otp" value={secondNbr} className="text-white text-4xl text-center w-[139px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleThirdNbr} id="otp" name="otp" value={thirdNbr} className="text-white text-4xl text-center w-[139px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
                    <input maxLength={1} onChange={handleFourthNbr} id="otp" name="otp" value={fourthNbr} className="text-white text-4xl text-center w-[139px] h-[139px] bg-gameBg border border-white rounded-lg" required type="text" />
            </div>
            <div className="mt-24 text-center">
                <button type="submit" className="bg-neon text-white text-xl px-16 py-3 rounded-lg font-semibold">Verify email</button>
            </div>
            </form>
        </div>
    )
}

export default Page2FA;
