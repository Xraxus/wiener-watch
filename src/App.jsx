import Logo from "./Logo";
import MovieForm from "./MovieForm";
import MovieResult from "./MovieResult";

import { createContext } from "react";
import { openai, supabase } from "../config.js";

export const EmbeddingContext = createContext(null);

function App() {
  async function matchUserQuery(input) {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const { data } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 5,
    });

    const match = data.map((obj) => obj.content).join("\n");
    return match;
  }

  async function generateRecommendationResponse(userQuery) {
    const input = await matchUserQuery(userQuery);

    console.log(input);

    const chatMessages = [
      {
        role: "system",
        content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given a piece of information which matched from vector database of movies. Your  job is to return one JSON object which contains movie title, release year and a short description of one movie, based on provided information (like this: {"title" : "MOVIE_TITLE_GOES_HERE", "release": "RELEASE_YEAR_GOES_HERE", "description": "DESCRIPTION_GOES_HERE"}). If you are unsure and cannot find the answer in the context, please do not make up the answer, but return JSON with error property (like this: {"error": "Could not find a movie"}).`,
      },
      {
        role: "user",
        content: `Information from database: ${input} `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
      temperature: 0.5,
      frequency_penalty: 0.5,
    });
    console.log(response.choices[0].message.content);
  }

  return (
    <>
      <EmbeddingContext.Provider
        value={{
          generateRecommendationResponse,
        }}
      >
        <Logo />
        <MovieForm />
      </EmbeddingContext.Provider>
    </>
  );
}

export default App;
