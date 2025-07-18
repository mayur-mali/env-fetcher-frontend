import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, ReactNode } from "react";

type OptionType = {
  id: string | number;
  name: string;
  [key: string]: any;
};

type CustomComboboxProps = {
  options: OptionType[];
  value?: OptionType | null;
  onChange: (value: any) => void;
  filter?: boolean;
  placeholder?: string;
  inputClassName?: string;
  optionClassName?: string;
  optionsClassName?: string;
  buttonClassName?: string;
  containerClassName?: string;
  displayValue?: (option: OptionType) => string;
  children?: ReactNode; // for advanced customizations, e.g. option rendering
};

export function CustomSelect({
  options,
  value,
  onChange,
  filter = false,
  placeholder = "Select...",
  inputClassName = "",
  optionClassName = "",
  optionsClassName = "",
  buttonClassName = "",
  containerClassName = "",
  displayValue,
  children,
}: CustomComboboxProps) {
  const [query, setQuery] = useState("");

  const defaultFilter = (option: OptionType, q: string) =>
    option.name.toLowerCase().includes(q.toLowerCase());

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => defaultFilter(option, query));

  return (
    <div className={clsx("relative", containerClassName)}>
      <Combobox
        value={value}
        onChange={onChange}
        onClose={() => setQuery("")}
        __demoMode
      >
        <div>
          <ComboboxButton className={clsx("w-full relative", buttonClassName)}>
            <ComboboxInput
              className={clsx(
                "w-full rounded-lg  bg-white py-1.5 pr-8 pl-3 text-sm text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
                inputClassName
              )}
              displayValue={
                displayValue
                  ? displayValue
                  : (option: OptionType) => option?.name || ""
              }
              onChange={(event) => {
                if (!filter) return;
                setQuery(event.target.value);
              }}
              placeholder={placeholder}
              disabled={!filter}
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-black/60 group-data-hover:fill-black" />
            </ComboboxButton>
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) z-50 [--anchor-gap:--spacing(1)] rounded-xl border border-gray-200 bg-white p-1 empty:invisible transition duration-100 ease-in data-leave:data-closed:opacity-0",
            optionsClassName
          )}
        >
          {filteredOptions.map((option) =>
            children ? (
              // @ts-ignore
              children(option)
            ) : (
              <ComboboxOption
                key={option.id}
                value={option}
                className={clsx(
                  "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-black/10",
                  optionClassName
                )}
              >
                <CheckIcon className="invisible size-4 fill-black group-data-selected:visible" />
                <div className="text-sm/6 text-black">{option.name}</div>
              </ComboboxOption>
            )
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
