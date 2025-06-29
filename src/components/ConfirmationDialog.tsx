import React from "react";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  IconComponent,
  iconColorClass = "text-red-500",
  iconBgColorClass = "bg-red-100",
  confirmButtonColorClass = "bg-red-600 hover:bg-red-700 focus:ring-red-500",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto  overflow-hidden md:max-w-lg">
      <div className="p-4">
        <div className="flex justify-center">
          <div className={`p-3 rounded-full ${iconBgColorClass}`}>
            {IconComponent && (
              <IconComponent className={`text-4xl ${iconColorClass}`} />
            )}
          </div>
        </div>
        <div className="text-center space-y-2 mt-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="mt-8 flex justify-center gap-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition ease-in-out duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2 font-semibold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition ease-in-out duration-150 ${confirmButtonColorClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
