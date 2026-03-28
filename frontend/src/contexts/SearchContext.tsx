import { useCallback, useEffect, useMemo, useState, createContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

type SearchContextType = {
  value: string;
  setValue: (v: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({
  param = "q",
  children,
}: {
  param?: string;
  children: React.ReactNode;
}) {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get(param) ?? "");
  const searchValue = useDebounce(search)

  const setValue = useCallback((newValue: string) => {
    setSearch(newValue);
  }, [])

  useEffect(() => {
    if (searchValue === params.get(param)) return;

    setParams(prev => {
      const next = new URLSearchParams(prev)
      if (searchValue) {
        next.set(param, searchValue);
      } else {
        next.delete(param)
      }
      return next
    }, { replace: true })
  }, [param, searchValue, params, setParams])

  const value = useMemo(() => {
    return { value: search, setValue }
  }, [search, setValue])

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}
