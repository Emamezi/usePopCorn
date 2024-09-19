import { useEffect, useState } from "react";
import { key as KEY } from "./utils/util.js";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // const KEY = "eda7f831";
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal }
        );
        if (!res.ok) throw new Error("Could not fetch movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error("movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        //set loader to false regardles of if movie data displayes or error occurs
        setIsLoading(false);
      }
    }
    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }
    // handleCloseMovie();
    fetchMovies();

    return () => controller.abort();
  }, [query]);
  return { movies, isLoading, error };
}
