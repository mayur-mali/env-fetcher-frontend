import React from "react";

export default function Card({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-4 flex justify-center items-center flex-col rounded-lg shadow gap-y-2 w-full bg-white/50">
      {icon && icon}
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p className="text-gray-700 text-lg">{label}</p>
    </div>
  );
}
