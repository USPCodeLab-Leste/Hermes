import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { createContext } from "react";

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

  const setValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, [])

  useEffect(() => {
    setParams(prev => {
      if (search) {
        prev.set(param, search);
      } else {
        prev.delete(param)
      }
      return prev
    }, { replace: true })
  }, [param, search])

  return (
    <SearchContext.Provider value={{ value: search, setValue: setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}
