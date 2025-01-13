"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ExpandIcon, FoldHorizontalIcon } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import { useHydrated } from "./hooks";
import styles from "./index.module.css";
import { IconButton } from "./ui/IconButton";
import { ModalRoot } from "./ui/Modal";
import { useReportWebVitals } from "next/web-vitals";

export const AwaitHydration = ({ children }: PropsWithChildren) => {
  const hasHydrated = useHydrated();
  if (!hasHydrated) return null;
  return <>{children}</>;
};

export const sidebarOpen = atomWithStorage("ndt.sidebarOpen", false);
export const darkMode = atomWithStorage("ndt.darkMode", false);

export const devtoolsOpen = atomWithStorage("ndt.devtoolsOpen", true);

export const useDevtoolsOpen = () => {
  return useAtom(devtoolsOpen);
};

export const useDarkMode = () => {
  return useAtom(darkMode);
};

const clsx = (...classes: (string | undefined | boolean)[]) =>
  classes.filter(Boolean).join(" ");

const UnsuspendedSidebar = ({ children }: PropsWithChildren) => {
  const collapsed = useAtomValue(sidebarOpen);
  return (
    <aside className={clsx(styles.sidebar, collapsed && styles.collapsed)}>
      {children}
    </aside>
  );
};

export const Sidebar: typeof UnsuspendedSidebar = ({ children }) => {
  return (
    <AwaitHydration>
      <UnsuspendedSidebar>{children}</UnsuspendedSidebar>
    </AwaitHydration>
  );
};

const UnsuspendedSidebarToggle = () => {
  const collapsed = useAtomValue(sidebarOpen);
  const setCollapsed = useSetAtom(sidebarOpen);
  return (
    <IconButton
      onClick={() => setCollapsed((prev) => !prev)}
      style={{ marginLeft: "auto" }}
    >
      {!collapsed ? <FoldHorizontalIcon /> : <ExpandIcon />}
    </IconButton>
  );
};

export const SidebarToggle: typeof UnsuspendedSidebarToggle = () => {
  return (
    <AwaitHydration>
      <UnsuspendedSidebarToggle />
    </AwaitHydration>
  );
};

const UnsuspendedDevtoolsWrapper = ({ children }: PropsWithChildren) => {
  const [darkMode] = useDarkMode();
  return (
    <div className={clsx(styles.root, !darkMode && styles.light)}>
      {children}
    </div>
  );
};

export const DevtoolsWrapper: typeof UnsuspendedDevtoolsWrapper = ({
  children,
}) => {
  const [open, setOpen] = useDevtoolsOpen();
  return (
    <AwaitHydration>
      <ModalRoot open={open} onOpenChange={setOpen}>
        <UnsuspendedDevtoolsWrapper>{children}</UnsuspendedDevtoolsWrapper>
      </ModalRoot>
    </AwaitHydration>
  );
};
