import { useContext } from "react";
import { MotionContext } from "../contexts/MotionContext";

export function useUserMotionPreference() {
  return useContext(MotionContext)!;
}