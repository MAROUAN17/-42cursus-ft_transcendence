import { useNavigate } from "react-router";

export default function notFound() {
    const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-darkBg font-poppins flex flex-col justify-center">
      <div className="h-1/2 items-center flex flex-col justify-center">
        <h1 className="text-white font-bold flex justify-center text-[320px] m-[-80px]">404</h1>
        <h1 className="text-white font-bold flex justify-center text-[70px]">Page Not Found</h1>
        <button onClick={() => navigate('/dashboard')} className="mt-12 bg-neon shadow-neon shadow-[0_5px_40px_5px_rgba(0,0,0,0.4)] p-2 px-8 flex items-center rounded-full gap-2">
          <p className="text-white text-xl font-extrabold">Back home</p>
        </button>
      </div>
    </div>
  );
}
