import Logo from "./Logo";
import MovieForm from "./MovieForm";
import MovieResult from "./MovieResult";

import { createContext } from "react";
import { openai, supabase } from "../config.js";

export const EmbeddingContext = createContext(null);

function App() {
  async function getUserQueryEmbedding(input) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const { data } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
    });
    console.log(data);
  }

  return (
    <>
      <EmbeddingContext.Provider
        value={{
          getUserQueryEmbedding,
        }}
      >
        <Logo />
        <MovieForm />
      </EmbeddingContext.Provider>
    </>
  );
}

export default App;
