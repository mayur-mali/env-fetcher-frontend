import React, { Fragment, useEffect, useRef } from "react";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid"; // or any other icon library

// --- Type Definitions ---
export interface CheckboxOption {
  value: string;
  label: string;
}

export interface MultiSelectDropdownProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (newSelectedValues: string[]) => void;
  label?: string;
  placeholder?: string;
}

// --- Component ---
const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  placeholder = "Select options...",
}) => {
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected =
    options.length > 0 && selectedValues.length === options.length;
  const someSelected = selectedValues.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSelectAll = () => {
    onChange(allSelected ? [] : options.map((opt) => opt.value));
  };

  const handleOptionChange = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      return (
        options.find((opt) => opt.value === selectedValues[0])?.label ||
        placeholder
      );
    }
    return `${selectedValues.length} options selected`;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold  mb-1">{label}</label>
      )}
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <MenuButton className="inline-flex w-full justify-between items-center border border-gray-300 rounded bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none">
            <span>{getDisplayText()}</span>
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded bg-white shadow-lg border border-gray-300 focus:outline-none max-h-60 overflow-y-auto">
            <div className="p-1">
              {/* "Select All" Option */}
              <div className="px-2 py-2 border-b border-gray-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                  <span className="font-semibold text-gray-800">
                    Select All
                  </span>
                </label>
              </div>

              {/* Individual Options */}
              {options.map((option) => (
                // NOTE: We are NOT using Menu.Item here to prevent the menu from closing on click
                <div key={option.value} className="px-2 py-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      value={option.value}
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleOptionChange(option.value)}
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default MultiSelectDropdown;
