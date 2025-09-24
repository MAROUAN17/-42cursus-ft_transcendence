import { useState, useContext, useEffect } from "react";
import api from "../../axios";
import { useUserContext } from "../contexts/userContext";
import { useNavigate } from "react-router";

export default function AvatarSelection() {
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState<string>("/profile1.jpg");
  const { user } = useUserContext();
  const avatars = [
    "/profile1.jpg",
    "/profile2.jpg",
    "/profile3.jpg",
    "/profile4.jpg",
    "/profile5.jpg",
    "/profile6.jpg",
  ];

  const handleAvatar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api
      .post(
        "/set/avatar",
        { id: user?.id, avatar: previewImg },
        { withCredentials: true }
      ).then(function() {navigate('/')})
      .catch(function (err) {
        console.log(err);
      });
  };

  return (
    <div className="bg-darkBg h-screen w-screen font-poppins">
      <div className="text-center pt-52 text-7xl">
        <h1 className="text-white font-bold">Select your avatar</h1>
      </div>
      <form onSubmit={handleAvatar}>
        <div className="flex justify-center mt-24 space-x-20 items-center">
          <div className="w-[400px] h-[400px] mt-4 outline outline-8 outline-neon rounded-full flex items-center justify-center">
            <img
              className="rounded-full w-[380px] h-[380px] object-cover"
              src={previewImg}
              alt="preview-img"
            />
          </div>
          <div className="grid grid-cols-3 gap-12 mt-3">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`w-[100px] h-[100px] outline outline-8 outline-neon rounded-full flex items-center justify-center transition-all duration-500 ease-in-out
              ${previewImg === avatar ? "outline-neon" : "outline-white"}`}
              >
                <img
                  onClick={() => {
                    setPreviewImg(avatar);
                  }}
                  className="rounded-full w-[90px] h-[90px] object-cover"
                  src={avatar}
                  alt={`${avatar}-img`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-32">
          <button
            type="submit"
            className="bg-neon text-white text-xl px-28 py-3 rounded-lg font-semibold"
          >
            Continue
          </button>
        </div>
      </form>
      <div className="flex justify-center items-center mt-8 space-x-2">
        <h1 className="font-bold text-xl text-white">Skip for now</h1>
        <a href="">
          <img
            className="transform scale-x-[-1]"
            width="50px"
            height="50px"
            src="arrow-icon.png"
            alt=""
          />
        </a>
      </div>
    </div>
  );
}
