"use client";

import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  use,
  useEffect,
  useState,
  type ComponentProps,
  type PropsWithChildren,
} from "react";

export interface TabsProps {}

interface TabsContext {
  value: string | null;
  setValue: (value: string) => void;
}

const TabsContext = createContext<TabsContext>(null!);

export const TabsRoot = ({
  children,
  defaultValue = "",
  storageKey,
}: PropsWithChildren<{ defaultValue?: string; storageKey?: string }>) => {
  const [value, setInternal] = useState<string | null>(
    storageKey ? null : defaultValue
  );

  const setValue = (value: string) => {
    if (storageKey) localStorage.setItem(storageKey, value);
    setInternal(value);
  };

  useEffect(() => {
    if (storageKey) {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue || defaultValue) {
        setValue(storedValue || defaultValue);
      }
    }
  }, [defaultValue]);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children }: PropsWithChildren) => {
  return <div>{children}</div>;
};

export const TabsTrigger = ({
  children,
  asChild,
  value,
  ...rest
}: ComponentProps<"button"> & {
  asChild?: boolean;
  value: string;
}) => {
  const { value: activeValue, setValue } = use(TabsContext);
  const Component = asChild ? Slot : "button";

  return (
    <Component
      {...rest}
      data-selected={value === activeValue ? true : undefined}
      onClick={() => setValue(value)}
    >
      {children}
    </Component>
  );
};

export const Tab = ({
  children,
  asChild,
  value,
  ...rest
}: ComponentProps<"div"> & {
  asChild?: boolean;
  value: string;
}) => {
  const { value: activeValue } = use(TabsContext);
  const Component = asChild ? Slot : "div";
  if (value !== activeValue) return null;

  return (
    <Component
      {...rest}
      data-selected={value === activeValue ? true : undefined}
      data-value={value}
    >
      {children}
    </Component>
  );
};
