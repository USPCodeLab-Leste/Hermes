import { useState } from "react";
import SearchBar from "../components/SearchBar";

export default function Info() {
  const [search, setSearch] = useState("");
  return (
    <div>
      <h2>Informações</h2>
      <SearchBar search={search} setSearch={setSearch} />

      <p>Esta é a página de informações do aplicativo.</p>
    </div>
  );
}
