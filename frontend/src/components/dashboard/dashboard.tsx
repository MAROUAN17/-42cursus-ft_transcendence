import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Infos } from "../user/login";


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
                console.log(err.response);
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
                if (err.response.status == 401 && err.response.data.error == "Unauthorized")
                    navigate('/login');
            })

        axios.interceptors.response.use(
            (response) => {return response},
            async(error) => {
                const originalReq = error.config;

                if (error.response.status == 401 && error.response.data.error == "JWT_EXPIRED") {
                    originalReq._retry = false;
                    try {
                        const res  = await axios.post('https://localhost:5000/jwt/new', {}, { withCredentials: true });
                        console.log(res);
                        return axios(originalReq);
                    } catch (error) {
                        console.log(error);
                    }
                }
                return Promise.reject(error);
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