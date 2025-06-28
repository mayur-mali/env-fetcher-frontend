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
      className={`relative w-10 disabled:cursor-not-allowed h-2 flex items-center rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? "bg-blue-500" : "bg-gray-300"
      } ${className}`}
      aria-pressed={isOn}
    >
      <span
        className={`absolute w-5 h-5 bg-white rounded-full border border-gray-200 shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
