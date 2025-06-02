import React, { Fragment, useRef, useState } from "react";

import ReactDOM from "react-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Button,
  Transition,
  TransitionChild,
} from "@headlessui/react";

export default function Modal({
  children,
  title,
  open,
  setOpen,
  className,
  width,
  hasChanged = false,
}: {
  children: React.ReactNode;
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  width?: string;
  hasChanged?: boolean;
}) {
  const cancelButtonRef = useRef(null);
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          if (hasChanged === true) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
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

        <div className="fixed inset-0 z-10 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 m-2 sm:items-center sm:p-0 ">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={`relative transform  w-full rounded-lg bg-[#F8FAFB] text-left shadow transition-all  sm:my-8  ${
                  className && className.includes("max-w")
                    ? className
                    : "max-w-lg"
                }  `}
              >
                <div
                  className={`bg-[#F8FAFB] rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}
                >
                  <div className="sm:flex sm:items-start">
                    {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"> */}
                    {/* <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" /> */}
                    {/* </div> */}
                    <div className="mt-3 w-full relative">
                      <span
                        className="cursor-pointer absolute right-0 -top-5 font-extrabold"
                        onClick={() => setOpen(false)}
                      >
                        X
                      </span>
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 text-center"
                      >
                        {title}
                      </DialogTitle>

                      <div className={"mx-auto mt-2 content-fit" + className}>
                        {children}
                      </div>
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
