import { useId } from "react";

export default function movieForm() {
  const movieFormId = useId();

  return (
    <div className="movie-form-wrapper">
      <form className="movie-form">
        <label htmlFor={`q1-${movieFormId}`}>
          What's your favorite movie and why?
        </label>
        <textarea
          id={`q1-${movieFormId}`}
          placeholder="The Shawshank Redemption
Because it taught me to never give up hope no matter how hard life gets"
        />
        <label htmlFor={`q2-${movieFormId}`}>
          Are you in the mood for something new or a classic?
        </label>
        <textarea
          id={`q2-${movieFormId}`}
          placeholder="I want to watch movies that were released after 1990"
        />
        <label htmlFor={`q3-${movieFormId}`}>
          Do you wanna have fun or do you want something serious?
        </label>
        <textarea
          id={`q3-${movieFormId}`}
          placeholder="I want to watch something stupid and fun"
        />
        <button>Let's Go</button>
      </form>
    </div>
  );
}