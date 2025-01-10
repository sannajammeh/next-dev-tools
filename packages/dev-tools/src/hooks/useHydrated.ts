import { useLayoutEffect, useState } from "react";

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
};
