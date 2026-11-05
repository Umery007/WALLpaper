import { useState } from "react";

import Header from "../../components/Header";
import Banner from "../../components/Banner";
import Cards from "../../components/Cards";
import { Ferramentas } from "../../components/Ferramentas";
import { Container, Content } from "./styles";

export default function Home({ isVip = import.meta.env.DEV }) {
  const [isFerramentasOpen, setIsFerramentasOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Container>
      <Header
        onOpenFerramentas={() => setIsFerramentasOpen(true)}
        onSearch={setSearch}
        onCategoryChange={setCategory}
      />
      <Banner />
      <Cards search={search} category={category} />
      <Content />

      {isFerramentasOpen && (
        <Ferramentas
          isVip={isVip}
          onClose={() => setIsFerramentasOpen(false)}
        />
      )}
    </Container>
  );
}
