/**
 * Source: https://dialog5.vercel.app/
 */

"use client";

import { Portal } from "@radix-ui/react-portal";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useHydrated } from "../../hooks";
import { DialogContext, useDialogContext, useDialogControl } from "./context";

const cn = (...classes: unknown[]) => classes.filter(Boolean).join(" ");

type AsChild = {
  asChild?: boolean;
};

type RootProps = {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: "modal" | "popover";
};
export const DialogRoot = ({
  children,
  open: externalOpen,
  onOpenChange,
  mode = "modal",
}: RootProps) => {
  const [open, setOpen] = useState(false);

  const setOpenState = useCallback(
    (newOpen: boolean) => {
      onOpenChange?.(newOpen);
      setOpen(newOpen);
    },
    [onOpenChange]
  );

  const preferredOpen = typeof externalOpen === "boolean" ? externalOpen : open;

  return (
    <DialogContext.Provider
      value={{ open: preferredOpen, setOpen: setOpenState, mode }}
    >
      {children}
    </DialogContext.Provider>
  );
};

type ViewportProps = React.ComponentProps<"dialog"> & {
  lock?: boolean;
  mode?: RootProps["mode"];
};

const DialogViewportInner = forwardRef<HTMLDialogElement, ViewportProps>(
  (
    { children, className, lock = true, mode: overrideMode, ...props },
    extRef
  ) => {
    const { open, setOpen, mode } = useDialogContext();

    const { ref } = useDialogControl({
      open,
      setOpen,
      mode: overrideMode || mode,
    });
    useImperativeHandle(extRef, () => ref.current);

    /* The only case where any is allowed - @types/react being invalid */
    const ariaProps = {
      inert: !open ? true : undefined,
      "aria-hidden": !open,
    };

    return (
      <dialog
        {...props}
        {...ariaProps}
        className={cn(className, "fr-dialog")}
        ref={ref}
      >
        {children}
      </dialog>
    );
  }
);

export const DialogViewport = ({
  children,
  portal = true,
  ...props
}: ViewportProps & {
  portal?: boolean;
}) => {
  const hasHydrated = useHydrated();

  if (!portal)
    return <DialogViewportInner {...props}>{children}</DialogViewportInner>;

  if (!hasHydrated) return null;
  return (
    <Portal>
      <DialogViewportInner {...props}>{children}</DialogViewportInner>
    </Portal>
  );
};

DialogViewport.displayName = "DialogViewport";

type TriggerProps = React.ComponentProps<"button"> & AsChild;
export const DialogTrigger = ({
  children,
  asChild,
  ...props
}: TriggerProps) => {
  const { setOpen } = useDialogContext();
  const Component = asChild ? Slot : "button";
  return (
    <Component {...props} onClick={() => setOpen(true)}>
      {children}
    </Component>
  );
};

export type CloseProps = React.ComponentProps<"button"> & AsChild;
export const DialogClose = ({ children, asChild, ...props }: CloseProps) => {
  const { setOpen } = useDialogContext();
  const Component = asChild ? Slot : "button";
  return (
    <Component {...props} onClick={() => setOpen(false)}>
      {children}
    </Component>
  );
};

export type ContentProps = React.ComponentProps<"div">;
export const DialogContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ children, className, ...props }, extRef) => {
  return (
    <div
      {...props}
      className={cn(className, "fr-dialog__content")}
      ref={extRef}
    >
      {children}
    </div>
  );
});

DialogContent.displayName = "DialogContent";
