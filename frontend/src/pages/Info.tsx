import { useState } from "react";
import SearchBar from "../components/SearchBar";
import AppHeader from "../components/AppHeader";

export default function Info() {
  const [search, setSearch] = useState("");
  return (
    <>
      <AppHeader />
      <main className="main-app">
        <h2>Informações</h2>
        <SearchBar search={search} setSearch={setSearch} />

        <p>Esta é a página de informações do aplicativo.</p>
      </main>
    </>
  );
}
