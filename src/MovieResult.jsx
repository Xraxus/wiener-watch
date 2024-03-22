import { useContext } from "react";
import { EmbeddingContext } from "./App";

export default function MovieResult() {
  const { resetRecommendation, recommendationResponse } =
    useContext(EmbeddingContext);

  let content;
  if (recommendationResponse.error) {
    content = (
      <>
        <div className="movie-result">
          <h2>Error happened: {recommendationResponse.error}</h2>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div className="movie-result">
          <h2>
            {recommendationResponse.title} ({recommendationResponse.release})
          </h2>
          <p>{recommendationResponse.description}</p>
        </div>
      </>
    );
  }

  return (
    <>
      {content}
      <button className="movie-result-button" onClick={resetRecommendation}>
        Go Again
      </button>
    </>
  );
}
