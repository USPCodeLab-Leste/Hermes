import { MotionConfig } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { createContext, useCallback, useMemo, useState } from "react";

export type MotionPreference = "system" | "always" | "never";

const STORAGE_KEY = "motion-preference";


type MotionContextType = {
  preference: MotionPreference;
  setPreference: (p: MotionPreference) => void;
  togglePreference: () => void;
  isReducedMotion: boolean;
};

const getDefaultPreference = (): MotionPreference => {
  const stored = localStorage.getItem(STORAGE_KEY) as MotionPreference | null;
  if (stored === "system" || stored === "always" || stored === "never") {
    return stored;
  }
  return "system";
}

export const MotionContext = createContext<MotionContextType | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const systemReduced = useReducedMotion();
  const [preference, setPreferenceState] = useState<MotionPreference>(getDefaultPreference());

  const setPreference = useCallback((value: MotionPreference) => {
    setPreferenceState((prev) => (Object.is(prev, value) ? prev : value));
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  const togglePreference = useCallback(() => {
    setPreferenceState(prev => {
      let next: MotionPreference;

      if (prev === "system") {
        next = systemReduced ? "never" : "always";
      } else {
        next = prev === "always" ? "never" : "always";
      }

      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, [systemReduced]);

  const isReducedMotion =
    preference === "system"
      ? systemReduced
      : preference === "always";

  const value = useMemo(() => {
    return {
      preference,
      setPreference,
      togglePreference,
      isReducedMotion: !!isReducedMotion,
    }
  }, [preference, setPreference, togglePreference, isReducedMotion])

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={isReducedMotion ? "always" : "never"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}
