import React, { useState } from "react";
import loginSvg from "../assets/login.svg";
import { Navigate, NavLink, useNavigate } from "react-router-dom";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { registerApi } from "../services/api";
function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await registerApi(email as string, password as string);
      if (res) {
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("error while creating user", error.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="xl:w-2/6 w-full justify-center flex flex-col h-full">
        <div className="pl-4">
          <h1 className="text-5xl font-bold">Sign Up</h1>
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="mt-10">
              <label className="text-lg font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6">
              <label className="text-lg font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6">
              <label className="text-lg font-semibold">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-10 disabled:bg-blue-100 disabled:text-black bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-600 hover:underline">
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
      <div className="md:flex bg-[#faf4f0] m-10 rounded-2xl hidden w-full  items-center justify-center p-10">
        <img src={loginSvg} className=" w-[70%] object-contain" alt="login" />
      </div>
    </div>
  );
}

export default Signup;
