import { useState } from "react";
import api from "../../axios";
import { useNavigate } from "react-router";

function SelectUsername() {
  const [errorFlag, setErrorFlag] = useState<boolean>(false);
  const [errorMssg, setErrorMssg] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  function handleUsername(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    api
      .post("/set/username-select", { newUsername: username }, { withCredentials: true })
      .then(function (res) {
        navigate("/dashboard");
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const usernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorFlag(false);
    setUsername(e.target.value);
  };

  return (
    <div className="font-poppins w-full py-12">
      <h1 className="text-center text-white font-bold text-5xl">SELECT YOUR USERNAME</h1>
      <form onSubmit={handleUsername}>
        <div className="px-[800px] pt-[300px] pb-[100px]">
          <label className="flex text-gray-300">Username</label>
          <input
            value={username}
            onChange={usernameInput}
            required
            className={`text-white bg-transparent px-2 ${errorFlag ? "border-b border-red-700" : "border-b border-white"} py-4 mt-5 w-full`}
            type="text"
            placeholder="Enter your username"
          />
          {errorFlag && <p className="mt-3 text-red-500">{errorMssg}</p>}
        </div>
        <div className="flex justify-center mt-32">
          <button type="submit" className="bg-neon text-white text-xl px-28 py-3 rounded-lg font-bold">
            Continue
          </button>
        </div>
      </form>
      <div
        onClick={() => {
          navigate("/dashboard");
        }}
        className="flex justify-center items-center mt-8 space-x-2"
      >
        <h1 className="font-bold text-xl text-white">Skip for now</h1>
        <a href="">
          <img className="transform scale-x-[-1]" width="50px" height="50px" src="arrow-icon.png" alt="" />
        </a>
      </div>
    </div>
  );
}

export default SelectUsername;
