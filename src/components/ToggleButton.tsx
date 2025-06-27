interface ToggleButtonProps {
  isOn: boolean | undefined;
  handleToggle: () => void;
  className?: string;
  isDiseble?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  handleToggle,
  className = "",
  isDiseble = false,
}) => {
  return (
    <button
      onClick={handleToggle}
      disabled={isDiseble}
      className={`relative w-14 disabled:cursor-not-allowed h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? "bg-blue-500" : "bg-gray-300"
      } ${className}`}
      aria-pressed={isOn}
    >
      <span
        className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
