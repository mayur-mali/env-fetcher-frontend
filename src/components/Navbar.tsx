import React from "react";
import { useAuth } from "../contexts/AuthContext";

import { FaUser } from "react-icons/fa";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="pl-64 bg-white w-full fixed">
      <div className="w-full flex justify-end items-center py-2.5 pr-10">
        <div className="px-3 flex justify-between items-center gap-x-3 py-1 bg-amber-100 rounded-full">
          <div className="rounded-full w-7 h-7 ">
            {user.profilePic && (
              <img
                src={user?.profilePic}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            )}
            {!user.profilePic && (
              <div className="w-full h-full rounded-full bg-gray-200/70 flex items-center justify-center">
                <FaUser className="text-black/70" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold">{user?.firstName}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
