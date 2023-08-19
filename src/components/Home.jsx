import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token)
  const is_admin = useSelector(state => state.auth.is_admin);
  const logout_time = useSelector(state => state.auth.autoLogout);

  const time_diff = logout_time - Date.now();

  useEffect(() => {

    // logout_time != null && time_diff > 0
    if (token != "") {
      if (is_admin) {
        navigate("/users");
      } else {
        navigate("/projects");
      }
    } else {
      navigate("/login");
    }
  }, []);

  // useEffect(() => {
  //   if (token) {
  //     console.log(token);
  //     // getAllUsers();
  //   }
  // }, [token]);

  const getAllUsers = async () => {
    const userResponse = await axios(
      `http://localhost:8000/api/user/?token=${token}`
    );
    console.log("userResponse", userResponse);
  };

  return (
    <>
      <Navbar></Navbar>
    </>
  );
}

export default Home;
