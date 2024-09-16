import { useEffect, useState } from "react";
import Search from "./components/search.component";
import Loader from "./components/loader.component";
import Box from "./components/box-component.js";
import SelectedMovieDetail from "./components/selected-movie-detail.component";
import ErrorMessage from "./components/error-message.component";
import WatchedSummary from "./components/watched-summary.component";
import WatchedMovieList from "./components/watched-movie-list.component.js";
import Movie from "./components/movie.js";
import { key as KEY } from "./utils/util.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  const handleSelectedMovie = (id) =>
    setSelectedId((selectId) => (selectId === id ? null : id));
  const handleCloseMovie = () => setSelectedId(null);

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };
  const handleDeleteWateched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  //store wathed movies in local storage
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  //Fetch movies request
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
    handleCloseMovie();
    fetchMovies();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onMovieSelect={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovieDetail
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatch={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWateched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};
const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length} </strong> results
    </p>
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const MovieList = ({ movies, onMovieSelect }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onMovieSelect={onMovieSelect} />
      ))}
    </ul>
  );
};
