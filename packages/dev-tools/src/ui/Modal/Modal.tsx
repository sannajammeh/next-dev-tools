import { classed } from "@tw-classed/react";
import * as DialogPrimitive from "../Dialog";
import styles from "./Modal.module.css";

export interface ModalProps {}

export const ModalRoot = DialogPrimitive.DialogRoot;

export const ModalViewport = classed(
  DialogPrimitive.DialogViewport,
  styles.Viewport!
);

export const ModalContent = classed(
  DialogPrimitive.DialogContent,
  styles.Content!
);
