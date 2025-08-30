import axios from "axios";
import { redirect } from "react-router";

export default function getUserDataLoader() {
    try {
        axios.get('https://localhost:5000/user', { withCredentials: true })
            .then(function(res) {
                console.log(res.data.infos);
                return res.data.infos;
            })
            .catch(function(err) {
                console.log(err.response.data);
                return redirect('/login');
            })   
    } catch (error) {
        
    }
}