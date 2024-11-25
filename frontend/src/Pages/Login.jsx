import { IoLogIn } from "react-icons/io5";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../store/auth";
const Login = () => {
  const [Data, setData] = useState({ username: "", password: "" });
  const history = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn === true) {
    history("/");
  }
  const dispatch = useDispatch();
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };
  const submit = async () => {
    try {
      if (Data.username === "" || Data.password === "") {
        alert("All fields are required");
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/log-in",
          Data
        );
        setData({ username: "", password: "" });
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("token", response.data.token);
        dispatch(authActions.login());
        history("/");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div className=" h-[98vh] flex items-center justify-center">
      <div className="p-4 w-5/6 md:w-4/6 lg:w-2/6 rounded bg-gray-800">
        <div className="flex items-center   ">
          <div className="text-2xl font-semibold">LogIn</div>
          <div className="px-2 size-3">
            <IoLogIn />
          </div>
        </div>

        <input
          type="username"
          placeholder="username"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded "
          name="username"
          value={Data.username}
          onChange={change}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded "
          name="password"
          value={Data.password}
          onChange={change}
        />
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <button
            className="bg-purple-500  font-semibold text-black px-3 py-2 rounded  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-purple-700 duration-300"
            onClick={submit}
          >
            Login
          </button>
          <Link to="/signup" className="text-gray-400 hover:text-gray-200">
            <div className=" py-2 ">Not having an account? SignUp here</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
