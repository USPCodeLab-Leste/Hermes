import { MotionConfig } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { createContext, useState, useEffect } from "react";

export type MotionPreference = "system" | "always" | "never";

const STORAGE_KEY = "motion-preference";


type MotionContextType = {
  preference: MotionPreference;
  setPreference: (p: MotionPreference) => void;
  togglePreference: () => void;
  isReducedMotion: boolean;
};

export const MotionContext = createContext<MotionContextType | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const systemReduced = useReducedMotion();
  const [preference, setPreferenceState] = useState<MotionPreference>("system");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as MotionPreference | null;
    if (stored === "system" || stored === "always" || stored === "never") {
      setPreferenceState(stored);
    }
  }, []);

  const setPreference = (value: MotionPreference) => {
    setPreferenceState(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const togglePreference = () => {
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
  };

  const isReducedMotion =
    preference === "system"
      ? systemReduced
      : preference === "always";

  return (
    <MotionContext.Provider value={{ preference, setPreference, togglePreference, isReducedMotion: !!isReducedMotion }}>
      <MotionConfig reducedMotion={isReducedMotion ? "always" : "never"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}
