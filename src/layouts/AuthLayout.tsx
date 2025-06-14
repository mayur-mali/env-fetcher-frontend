import React from "react";
import loginSvg from "../assets/envault-logo.png";
import { Outlet } from "react-router-dom";
export default function AuthLayout() {
  return (
    <div className="h-screen flex flex-col items-center">
      <div className="w-full flex px-8">
        <img
          src={loginSvg}
          alt="Login Illustration"
          className="w-[150px] h-20 object-contain"
        />
      </div>
      <div className="h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}
