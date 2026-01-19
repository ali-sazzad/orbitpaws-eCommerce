"use client";

import * as React from "react";

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export function useLocalStorageState<T>(key: string, initialValue: T): readonly [T, Setter<T>, boolean] {
  // IMPORTANT: do NOT read localStorage during initial render (prevents hydration mismatch)
  const [state, setState] = React.useState<T>(initialValue);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // Now we're on the client — safe to read localStorage
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setState(JSON.parse(raw) as T);
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
     
  }, [key]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state, hydrated]);

  return [state, setState, hydrated] as const;
}
