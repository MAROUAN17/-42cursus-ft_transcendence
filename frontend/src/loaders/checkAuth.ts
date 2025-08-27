import axios from "axios";
import { redirect } from "react-router";

export default async function checkAuthLoader() {
    try {
      const res = await axios.post('https://localhost:5000/login/verify',
        {}, 
        { withCredentials: true }
      )
      console.log(res);     
    } catch (err: any) {
      if (err.status == 401 && err.response.data.message == "Already logged in") {
          return redirect('/');
      }
    }
}