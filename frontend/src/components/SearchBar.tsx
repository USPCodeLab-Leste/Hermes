import SearchIcon from "../assets/icons/search.svg?react";
import CloseIcon from "../assets/icons/close-circle.svg?react";
interface SearchBarProps {
  search: string;
  setSearch: (newSearch: string) => void;
  placeholder?: string;
  isDark?: boolean;
}

export default function SearchBar({search, setSearch, placeholder, isDark}: SearchBarProps) {
  return (
    <div className={`flex flex-row gap-2 items-center p-2 rounded-full border-2 w-full focus-within:border-teal-light focus-within:text-teal-light transition-colors group ${isDark ? 'border-ink dark:border-paper text-ink dark:text-paper' : 'border-paper text-paper'}`}>

      <SearchIcon className={`group-focus-within:text-teal-light pointer-events-none ${isDark ? 'text-ink dark:text-paper' : 'text-paper'}`} />

      <input
        className={`w-full border-none outline-none appearance-none ${isDark ? 'text-ink dark:text-paper' : 'text-paper'}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        placeholder={placeholder || "Buscar no Hermes"}
      />

      {search && (
        <button
          className="cursor-pointer"
          onClick={() => setSearch("")}
        >
          <CloseIcon className={`hover:text-teal-light transition-colors ${isDark ? 'text-ink dark:text-paper' : 'text-paper'}`} />
        </button>
      )}
    </div>
  );
}
