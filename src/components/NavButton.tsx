import React from "react";
import { NavLink } from "react-router-dom";

export default function NavButton({
  path,
  label,
  icon,
}: {
  path: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <NavLink to={path} className="action-btn">
        <h3 className="text-lg flex items-center gap-x-2 font-semibold">
          {icon} {label}
        </h3>
      </NavLink>
    </div>
  );
}
