import React, { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

type Position = "right" | "left" | "top" | "bottom" | "bottomMiddel";
type Type = "modal" | "drawer";
type Size = "sm" | "md" | "lg" | "xl" | "full" | "auto";

interface Dimensions {
  width?: string;
  height?: string;
}

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  preventOutsideClose?: boolean;
  type?: Type;
  position?: Position;
  size?: Size;
  customDimensions?: Dimensions;
}

const DEFAULT_SIZES = {
  modal: {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full",
    auto: "max-w-fit",
  },
  drawer: {
    vertical: {
      sm: "w-64",
      md: "w-96",
      lg: "w-[32rem]",
      xl: "w-[40rem]",
      full: "w-full",
      auto: "w-fit",
    },
    horizontal: {
      sm: "h-64",
      md: "h-96",
      lg: "h-[32rem]",
      xl: "h-[40rem]",
      full: "h-full",
      auto: "h-fit",
    },
  },
};

export default function Modal({
  children,
  title,
  open,
  setOpen,
  className = "",
  preventOutsideClose = false,
  type = "modal",
  position = "right",
  size = "md",
  customDimensions,
}: ModalProps) {
  const getTransitionStyles = () => {
    if (type === "modal") {
      return {
        enter: "ease-out duration-300",
        enterFrom: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
        enterTo: "opacity-100 translate-y-0 sm:scale-100",
        leave: "ease-in duration-200",
        leaveFrom: "opacity-100 translate-y-0 sm:scale-100",
        leaveTo: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",
      };
    }

    const transitions = {
      right: {
        enter: "transform transition ease-in-out duration-300",
        enterFrom: "translate-x-full",
        enterTo: "translate-x-0",
        leave: "transform transition ease-in-out duration-300",
        leaveFrom: "translate-x-0",
        leaveTo: "translate-x-full",
      },
      left: {
        enter: "transform transition ease-in-out duration-300",
        enterFrom: "-translate-x-full",
        enterTo: "translate-x-0",
        leave: "transform transition ease-in-out duration-300",
        leaveFrom: "translate-x-0",
        leaveTo: "-translate-x-full",
      },
      top: {
        enter: "transform transition ease-in-out duration-300",
        enterFrom: "-translate-y-full",
        enterTo: "translate-y-0",
        leave: "transform transition ease-in-out duration-300",
        leaveFrom: "translate-y-0",
        leaveTo: "-translate-y-full",
      },
      bottom: {
        enter: "transform transition ease-in-out duration-300",
        enterFrom: "translate-y-full",
        enterTo: "translate-y-0",
        leave: "transform transition ease-in-out duration-300",
        leaveFrom: "translate-y-0",
        leaveTo: "translate-y-full",
      },
      bottomMiddel: {
        enter: "transform transition ease-in-out duration-300",
        enterFrom: "translate-y-full",
        enterTo: "translate-y-0",
        leave: "transform transition ease-in-out duration-300",
        leaveFrom: "translate-y-0",
        leaveTo: "translate-y-full",
      },
    };

    return transitions[position];
  };

  const getDrawerPositionClasses = () => {
    const positions = {
      right: "fixed right-0 inset-y-0",
      left: "fixed left-0 inset-y-0",
      top: "fixed top-0 inset-x-0",
      bottom: "fixed bottom-0 inset-x-0",
      bottomMiddel: "fixed bottom-0 mx-auto inset-x-0",
    };

    return positions[position];
  };

  const getDimensionClasses = () => {
    if (customDimensions) {
      const { width, height } = customDimensions;
      return `${width || ""} ${height || ""}`.trim();
    }

    if (type === "modal") {
      return DEFAULT_SIZES.modal[size];
    }

    const isVertical = position === "left" || position === "right";
    const dimensionType = isVertical ? "vertical" : "horizontal";
    return DEFAULT_SIZES.drawer[dimensionType][size];
  };

  const getPanelStyles = () => {
    if (type === "modal") {
      return `relative transform w-full rounded-lg bg-[#F8FAFB] text-left shadow-xl transition-all sm:my-8 ${getDimensionClasses()} ${className}`;
    }

    return `${getDrawerPositionClasses()} ${getDimensionClasses()} bg-[#F8FAFB] shadow-xl ${className} ${
      position === "left" ? "rounded-r-lg" : ""
    } ${position === "right" ? "rounded-l-lg" : ""} ${
      position === "top" ? "rounded-b-lg" : ""
    }  ${
      position === "bottomMiddel" ? "rounded-t-lg" : ""
    } transform transition-all`;
  };

  const handleClose = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (!preventOutsideClose) {
      setOpen(false);
    }
  };

  const handleCrossClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setOpen(false);
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className={`flex min-h-full ${
              type === "modal" ? "items-center justify-center p-4" : ""
            }`}
          >
            <TransitionChild as={Fragment} {...getTransitionStyles()}>
              <DialogPanel className={getPanelStyles()}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full relative">
                      <span
                        className="cursor-pointer absolute right-0 -top-5 font-extrabold hover:text-gray-700"
                        onClick={handleCrossClick}
                      >
                        X
                      </span>
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 text-center"
                      >
                        {title}
                      </DialogTitle>

                      <div className="mx-auto mt-2 content-fit">{children}</div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
