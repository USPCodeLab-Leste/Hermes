import { useContext } from "react"
import { SearchContext } from "../contexts/SearchContext";

export function useSharedSearch() {
  return useContext(SearchContext)!;
}