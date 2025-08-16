import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Infos } from "../user/login";


export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<Infos>({ username: "", email: "" });
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        axios.get('http://localhost:8088/', { withCredentials: true })
            .then(function (res) {
                console.log(res.data);
                console.log("Authorized!!");
            })
            .catch(function (err) {
                navigate("/login");
            })
    }

    useEffect(() => {
        axios.get('http://localhost:8088/user', { withCredentials: true })
            .then(function(res) {
                console.log(res.data.infos);
                setUser(res.data.infos);
            })
            .catch(function(err) {
                console.log(err.response.data);
                navigate('/login');
            })
    }, []);

    return (
        <div>
            <h1>Welcome {user.username}</h1>
            <button className="px-12 py-4 bg-neon text-white" onClick={handleClick}>click</button>
        </div>
    )
}