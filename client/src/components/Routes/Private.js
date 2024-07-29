import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() { 
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth(); 
  
  useEffect(() => {
    const authCheck = async () => {
      console.log(auth);
      const token=auth.token;
      const res = await axios.get("http://localhost:8080/api/v1/auth/user-auth",{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(auth);
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);
  console.log(auth);

  return ok ? <Outlet /> : <Spinner />;
}