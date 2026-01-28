import SearchIcon from "../assets/icons/search.svg?react";
import CloseIcon from "../assets/icons/close-circle.svg?react";
interface SearchBarProps {
  search: string;
  setSearch: (newSearch: string) => void;
}

export default function SearchBar({search, setSearch}: SearchBarProps) {
  return (
    <div className="flex flex-row gap-2 items-center p-2 rounded-full border-2 border-paper w-full focus-within:border-teal-light focus-within:text-teal-light transition-colors group">
      <SearchIcon className="text-paper group-focus-within:text-teal-light pointer-events-none"/>

      <input
        className="w-full border-none outline-none appearance-none text-paper"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        placeholder="Buscar na Hermes"
      />

      {search && (
        <button
          className="cursor-pointer"
          onClick={() => setSearch("")}
        >
          <CloseIcon className="text-paper hover:text-teal-light transition-colors"/>
        </button>
      )}
    </div>
  );
}
