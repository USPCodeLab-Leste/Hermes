import SearchIcon from "../assets/icons/search.svg?react";
import CloseIcon from "../assets/icons/close-circle.svg?react";
import { useState } from "react";

export default function SearchBar() {
  const [searchVal, setSearchVal] = useState(0);
  const [texto, setTexto] = useState("");
  interface SearchBarProps {
    search: string;
    handleSearchChange: (newSearch: string) => void;
  }

  return (
    <div className=" flex flex-row rounded-full border-2 relative">
      <div className="align-center pointer-events-none">
        <SearchIcon
          className="top-1/2 -translate-y-1/2 absolute pl-2"
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
      </div>

      <input
        className="p-1 pl-6 rounded-full w-full border-none outline-none"
        value={texto}
        onChange={(e) => {
          e.target.value == "" ? setSearchVal(0) : setSearchVal(1);
          setTexto(e.target.value);
        }}
        type="search"
        placeholder="Buscar na Hermes"
      />

      {searchVal ? (
        <button
          className="cursor-pointer"
          onClick={() => {
            setTexto("");
            setSearchVal(0);
          }}
        >
          <CloseIcon className="self-center" />{" "}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}
