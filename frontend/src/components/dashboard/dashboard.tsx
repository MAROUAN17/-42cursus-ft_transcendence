import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Infos } from "../user/login";
import { TbNavigationEast } from "react-icons/tb";


export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<Infos>({ username: "", email: "" });
    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        axios.get('https://localhost:5000/', { withCredentials: true })
            .then(function (res) {
                console.log(res.data.data);
                console.log("Authorized!!");
            })
            .catch(function (err) {
                navigate("/login");
            })
    }

    function handleLogout(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        axios.post('https://localhost:5000/logout', {}, { withCredentials: true })
            .then(function(res) {
                console.log(res);
                navigate("/login");
            })
            .catch(function(err) {
                console.log(err.response.data.error);
            })
    }

    useEffect(() => {
        axios.get('https://localhost:5000/user', { withCredentials: true })
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
            <button className="px-12 py-4 bg-neon text-white" onClick={handleLogout}>logout</button>
        </div>
    )
}