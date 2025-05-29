import React from "react";
import errorImage from "../assets/404.svg";
function NotFound() {
  return (
    <div className="flex justify-between items-center h-screen p-4">
      <img
        src={errorImage}
        alt="Page Not Found"
        style={{ width: "100%", height: "70vh", objectFit: "contain" }}
      />
    </div>
  );
}

export default NotFound;
