import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
    const navigate = useNavigate();
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        axios.get('http://localhost:8088/', { withCredentials: true })
            .then(function (res) {
                console.log(res.data);
                console.log("Authorized!!");
            })
            .catch(function (err) {
                console.log(err.response.data)
                navigate("/login");
            })
    }
    return (
        <div>
            <h1>Logged in</h1>
            <button className="px-12 py-4 bg-neon text-white" onClick={handleClick}>click</button>
        </div>
    )
}