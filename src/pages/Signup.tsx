import React from "react";
import loginSvg from "../assets/login.svg";
import { NavLink } from "react-router-dom";
function Signup() {
  return (
    <div className="h-screen flex">
      <div className="xl:w-2/6 w-full justify-center flex flex-col h-full">
        <div className="pl-4">
          <h1 className="text-5xl font-bold">Sign Up</h1>
          <form onSubmit={(e) => e.preventDefault()} className="mt-10">
            <div className="mt-10">
              <label className="text-lg font-semibold">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6">
              <label className="text-lg font-semibold">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6">
              <label className="text-lg font-semibold">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                required
                className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Sign Up
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
