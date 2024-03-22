import { useContext, useId, useState } from "react";
import { EmbeddingContext } from "./App";

export default function movieForm() {
  const { generateRecommendationResponse } = useContext(EmbeddingContext);
  const movieFormId = useId();

  const [userInput, setUserInput] = useState({
    favMovie: "",
    mood: "",
    fun: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    generateRecommendationResponse(
      `I want to watch a movie here are some preferences: 
       - In terms of mood: ${userInput.mood},
       - In terms of fun/seriousness: ${userInput.fun},
       - My favorite movie is ${userInput.favMovie}.
      `
    );
    setUserInput({
      favMovie: "",
      mood: "",
      fun: "",
    });
  }

  function handleUserInputChange(event) {
    setUserInput((UI) => {
      return { ...UI, [event.target.name]: event.target.value };
    });
  }

  return (
    <div className="movie-form-wrapper">
      <form className="movie-form" onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor={`q1-${movieFormId}`}>
          What's your favorite movie and why?
        </label>
        <textarea
          id={`q1-${movieFormId}`}
          placeholder="The Shawshank Redemption
Because it taught me to never give up hope no matter how hard life gets"
          name="favMovie"
          onChange={(e) => handleUserInputChange(e)}
          value={userInput.favMovie}
        />
        <label htmlFor={`q2-${movieFormId}`}>
          Are you in the mood for something new or a classic?
        </label>
        <textarea
          id={`q2-${movieFormId}`}
          placeholder="I want to watch movies that were released after 1990"
          name="mood"
          onChange={(e) => handleUserInputChange(e)}
          value={userInput.mood}
        />
        <label htmlFor={`q3-${movieFormId}`}>
          Do you wanna have fun or do you want something serious?
        </label>
        <textarea
          id={`q3-${movieFormId}`}
          placeholder="I want to watch something stupid and fun"
          name="fun"
          onChange={(e) => handleUserInputChange(e)}
          value={userInput.fun}
        />
        <button>Let's Go</button>
      </form>
    </div>
  );
}
