import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/"); // Redirect to the home page
    }
  }, [isLoggedIn, navigate]);

  const [data, setData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.username.trim() || !data.email.trim() || !data.password) {
      alert("Please fill out all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (data.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/sign-in",
        data
      );

      if (response.status === 200) {
        setData({ username: "", email: "", password: "" });
        alert("Sign-up successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      const errorMessage =
        error.response?.data?.message ||
        (error.request
          ? "Network error: Unable to connect to the server."
          : "Sign-up failed, please try again.");
      alert(errorMessage);
    }
  };

  return (
    <div className="h-[98vh] flex items-center justify-center">
      <div className="p-4 w-2/6 rounded bg-gray-800">
        <h2 className="text-2xl font-semibold text-white">Sign-Up</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="bg-gray-700 px-3 py-2 w-full rounded text-white"
            name="username"
            value={data.username}
            onChange={handleChange}
          />
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="bg-gray-700 px-3 py-2 w-full rounded text-white"
            name="email"
            value={data.email}
            required
            onChange={handleChange}
          />
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="bg-gray-700 px-3 py-2 w-full rounded text-white"
            name="password"
            value={data.password}
            onChange={handleChange}
          />

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="transition ease-in-out delay-150 bg-violet-500 text-white font-semibold w-full px-3 py-2 my-2 rounded-2xl hover:-translate-y-1 hover:scale-110 hover:bg-violet-800 duration-300"
            >
              Sign Up
            </button>
            <Link to="/login" className="text-gray-300 hover:text-gray-700">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;