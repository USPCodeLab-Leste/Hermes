import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
  theme: 'light' as 'light' | 'dark',
  toggleTheme: () => {}
})

const initialTheme = () => {
  const savedTheme = localStorage.getItem("theme") as 'light' | 'dark' | null

  if (savedTheme) {
    return savedTheme
  }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme());

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}