export default function SearchBar() {
  interface SearchBarProps {
    search: string;
    handleSearchChange: (newSearch: string) => void;
  }

  return (
    <input
      className="rounded-full"
      type="search"
      placeholder="Buscar na Hermes"
    />
  );
}
