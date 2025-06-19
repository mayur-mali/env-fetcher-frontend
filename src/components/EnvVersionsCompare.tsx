import React from "react";

export default function EnvVersionsCompare() {
  return (
    <div className="overflow-auto border rounded">
      <div className="grid grid-cols-2 bg-gray-100 text-sm font-bold p-2 border-b">
        <div>Version {"versionA"}</div>
        <div>Version {"versionB"}</div>
      </div>
      {[
        {
          left: "REACT_APP_API_BASE_URL=https://env-fetcher-backend.onrender.com\r",
          right:
            "REACT_APP_API_BASE_URL=https://env-fetcher-backend.onrender.com\r",
          change: "same",
        },
        {
          left: "REACT_BACKEND_URL=https://edviron.com",
          right: "",
          change: "removed",
        },
        {
          left: "",
          right: "REACT_BACKEND=https://edviron.com",
          change: "added",
        },
      ].map((row, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-2 text-sm border-b ${
            row.change === "added"
              ? "bg-green-50"
              : row.change === "removed"
              ? "bg-red-50"
              : ""
          }`}
        >
          <div className="p-2 border-r">
            <pre className="whitespace-pre-wrap">{row.left || ""}</pre>
          </div>
          <div className="p-2">
            <pre className="whitespace-pre-wrap">{row.right || ""}</pre>
          </div>
        </div>
      ))}
    </div>
  );
}
