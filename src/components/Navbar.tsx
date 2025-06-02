import React from "react";

export default function Navbar() {
  return (
    <div className="pl-64 bg-white w-full fixed">
      <div className="w-full flex justify-end items-center py-2.5 pr-10">
        <div className="px-3 flex justify-between items-center gap-x-3 py-1 bg-amber-50 rounded-full">
          <div className="rounded-full w-7 h-7 bg-red-200"></div>
          <h3 className="text-xs font-bold">Mayur</h3>
        </div>
      </div>
    </div>
  );
}
