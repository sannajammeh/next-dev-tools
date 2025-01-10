"use client";
import { createContext, useContext, useEffect, useRef } from "react";

export interface DialogStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode?: "popover" | "modal";
}
export const DialogContext = createContext<DialogStore>(null!);
export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialogContext must be used within a DialogRoot");
  }
  return context;
};

/**
 * Controller for the dialog element
 */
export const useDialogControl = ({ open, setOpen, mode }: DialogStore) => {
  const ref = useRef<HTMLDialogElement>(null!);

  useEffect(() => {
    const { current: dialog } = ref;
    if (mode === "popover") {
      open ? dialog.show() : dialog.close("no-sync");
      return;
    }

    if (open) {
      dialog.showModal();
      dialog.addEventListener(
        "transitionstart",
        () => {
          dialog.setAttribute("data-state", "open");
        },
        { once: true }
      );
    } else {
      dialog.close("no-sync");
    }
  }, [open, mode]);

  // const handleClose = useCallback(() => {
  //   if (mode === "popover") {
  //     setOpen(false);
  //   }
  // }, [mode]);

  // useClickOutside(ref, handleClose);

  useEffect(() => {
    const { current: dialog } = ref;
    const closeHandler = (e: Event) => {
      const target = e.target as HTMLDialogElement;

      if (target.returnValue !== "no-sync" || e.type === "cancel") {
        setOpen(false);
      }

      dialog.addEventListener(
        "transitionend",
        () => {
          dialog.removeAttribute("data-state");
        },
        { once: true }
      );
    };
    const clickHandler = ({ target: dialogTarget }: MouseEvent) => {
      if (dialogTarget === dialog) {
        dialog.close("dismiss");
      }
    };

    dialog.addEventListener("close", closeHandler);
    dialog.addEventListener("cancel", closeHandler);
    dialog.addEventListener("click", clickHandler);

    return () => {
      dialog.removeEventListener("close", closeHandler);
      dialog.removeEventListener("cancel", closeHandler);
      dialog.removeEventListener("click", clickHandler);
    };
  }, [setOpen]);

  return {
    open,
    setOpen,
    ref,
  };
};
