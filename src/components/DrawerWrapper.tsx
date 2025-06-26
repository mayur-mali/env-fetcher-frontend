import React from "react";
import { Drawer } from "vaul";

type Direction = "right" | "top" | "bottom" | "left";

interface DrawerWrapperProps {
  // Core drawer props
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string;
  footer?: React.ReactNode;

  // Drawer.Root props
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  container?: HTMLElement;
  direction?: Direction;
  onAnimationEnd?: () => void;
  dismissible?: boolean;
  handleOnly?: boolean;
  repositionInputs?: boolean;

  // Snap points
  snapPoints?: number[];
  activeSnapPoint?: number;
  setActiveSnapPoint?: (snapPoint: string | number | null) => void;
  fadeFromIndex?: number | undefined;
  snapToSequentialPoint?: boolean;

  // Options
  showCloseButton?: boolean;
  disableEscClose?: boolean;
  closeOnOutsideClick?: boolean;
  customClassName?: string;
  forceMount?: boolean;
}

export function DrawerWrapper({
  trigger,
  children,
  title,
  description,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
  container = typeof document !== "undefined" ? document.body : undefined,
  direction = "right",
  onAnimationEnd,
  dismissible = true,
  handleOnly = false,
  repositionInputs = true,
  snapPoints,
  activeSnapPoint,
  setActiveSnapPoint,
  fadeFromIndex,
  snapToSequentialPoint,
  showCloseButton = true,
  disableEscClose = false,
  closeOnOutsideClick = true,
  customClassName = "",
  forceMount = false,
}: DrawerWrapperProps) {
  const getContentClass = () => {
    switch (direction) {
      case "top":
        return "fixed top-0 left-0 right-0 max-h-[90vh] rounded-b-2xl";
      case "bottom":
        return "fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl";
      case "left":
        return "fixed top-0 bottom-0 left-0 w-[90vw] max-w-md rounded-r-2xl";
      case "right":
      default:
        return "fixed top-0 bottom-0 right-0 w-[90vw] max-w-md rounded-l-2xl";
    }
  };

  // Prepare props for Drawer.Root, only including fadeFromIndex if it's allowed
  const drawerRootProps: any = {
    open,
    defaultOpen,
    onOpenChange,
    modal,
    container,
    direction,
    onAnimationEnd,
    dismissible: dismissible && !disableEscClose,
    handleOnly,
    repositionInputs,
    snapPoints,
    activeSnapPoint,
    setActiveSnapPoint,
    snapToSequentialPoint,
  };

  // Only add fadeFromIndex if it's defined and snapPoints is provided (assuming that's the correct condition)
  if (typeof fadeFromIndex === "number" && Array.isArray(snapPoints)) {
    drawerRootProps.fadeFromIndex = fadeFromIndex;
  }

  return (
    <Drawer.Root {...drawerRootProps}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40`}
          asChild={false}
        />
        <Drawer.Content
          className={`bg-white p-4 z-50 overflow-auto ${getContentClass()} ${customClassName}`}
          asChild={false}
          {...(forceMount ? { forceMount: true } : {})}
        >
          <div className="w-full h-full flex flex-col space-y-2">
            <Drawer.Handle className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
            {title && (
              <Drawer.Title asChild={false} className="text-lg font-semibold">
                {title}
              </Drawer.Title>
            )}
            {description && (
              <Drawer.Description
                asChild={false}
                className="text-sm text-gray-500"
              >
                {description}
              </Drawer.Description>
            )}

            <div className="flex-1">{children}</div>

            {footer && <div className="pt-4">{footer}</div>}

            {showCloseButton && (
              <Drawer.Close
                asChild={false}
                className="mt-4 text-blue-500 hover:underline self-start"
              >
                Close
              </Drawer.Close>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
