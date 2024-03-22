// App.js

import Logo from "./Logo";
import MovieForm from "./MovieForm";
import MovieResult from "./MovieResult";

import { createContext, useState } from "react";
import axios from "axios";

export const EmbeddingContext = createContext(null);

function App() {
  const [recommendationResponse, setRecommendationResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function generateRecommendationResponse(userQuery) {
    setIsLoading(true);
    try {
      const response = await axios.post("/.netlify/functions/recommendation", {
        userQuery,
      });
      setRecommendationResponse(response.data);
    } catch (error) {
      console.error("Error fetching recommendation:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function resetRecommendation() {
    setRecommendationResponse(null);
    setIsLoading(false);
  }

  return (
    <>
      <EmbeddingContext.Provider
        value={{
          generateRecommendationResponse,
          resetRecommendation,
          recommendationResponse,
          isLoading,
          setIsLoading,
        }}
      >
        <Logo />
        {recommendationResponse !== null ? <MovieResult /> : <MovieForm />}
      </EmbeddingContext.Provider>
    </>
  );
}

export default App;
