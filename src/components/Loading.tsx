import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading() {
  return (
    <div className="flex h-screen justify-center items-center">
      <AiOutlineLoading3Quarters className="text-7xl animate-spin text-pink-600" />
    </div>
  );
}
