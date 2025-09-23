import { useState } from "react";

export default function AvatarSelection() {
  const [previewImg, setPreviewImg] = useState<string>("/profile1.jpg");

  return (
    <div className="bg-darkBg h-screen w-screen font-poppins">
      <div className="text-center pt-52 text-7xl">
        <h1 className="text-white font-bold">Select your avatar</h1>
      </div>
      <div className="flex justify-center mt-24 space-x-20 items-center">
        <div className="w-[400px] h-[400px] mt-4 outline outline-8 outline-neon rounded-full flex items-center justify-center">
          <img
            className="rounded-full w-[380px] h-[380px] object-cover"
            src={previewImg}
            alt="preview-img"
          />
        </div>
        <div className="grid grid-cols-3 gap-12 mt-3">
          <div className="w-[100px] h-[100px] outline outline-8 outline-neon rounded-full flex items-center justify-center">
            <img
              onClick={() => {
                setPreviewImg("/profile1.jpg");
              }}
              className="rounded-full w-[90px] h-[90px] object-cover"
              src="/profile1.jpg"
              alt="profile1-img"
            />
          </div>
          <div className="w-[100px] h-[100px] outline outline-8 outline-white rounded-full flex items-center justify-center">
            <img
              onClick={() => {
                setPreviewImg("/profile2.jpg");
              }}
              className="rounded-full w-[90px] h-[90px] object-cover"
              src="/profile2.jpg"
              alt="profile2-img"
            />
          </div>
          <div className="w-[100px] h-[100px] outline outline-8 outline-white rounded-full flex items-center justify-center">
            <img
              onClick={() => {
                setPreviewImg("/profile3.jpg");
              }}
              className="rounded-full w-[90px] h-[90px] object-cover"
              src="/profile3.jpg"
              alt="profile3-img"
            />
          </div>
          <div className="w-[100px] h-[100px] outline outline-8 outline-white rounded-full flex items-center justify-center">
            <img
              onClick={() => {
                setPreviewImg("/profile4.jpg");
              }}
              className="rounded-full w-[90px] h-[90px] object-cover"
              src="/profile4.jpg"
              alt="profile4-img"
            />
          </div>
          <div className="w-[100px] h-[100px] outline outline-8 outline-white rounded-full flex items-center justify-center">
            <img
              onClick={() => {
                setPreviewImg("/profile5.jpg");
              }}
              className="rounded-full w-[90px] h-[90px] object-cover"
              src="/profile5.jpg"
              alt="profile5-img"
            />
          </div>
          <div className="w-[100px] h-[100px] outline outline-8 outline-white rounded-full flex items-center justify-center">
            <img
              onClick={() => {
                setPreviewImg("/profile6.jpg");
              }}
              className="rounded-full w-[90px] h-[90px] object-cover"
              src="/profile6.jpg"
              alt="profile6-img"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-52 space-x-2">
        <h1 className="font-bold text-xl text-white">Skip for now</h1>
        <a href="">
          <img
            className="transform scale-x-[-1]"
            width="60px"
            height="60px"
            src="arrow-icon.png"
            alt=""
          />
        </a>
      </div>
    </div>
  );
}
