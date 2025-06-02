import React from "react";

export default function Card({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  // This component is a placeholder for a card that displays a label and a value.
  return (
    <div className="p-4 rounded-lg shadow max-w-sm bg-white/50">
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-gray-700">{value}</p>
    </div>
  );
}
