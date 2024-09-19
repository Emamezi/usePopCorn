import { useState, useEffect, useRef } from "react";
import Loader from "./loader.component";
import StarRating from "../star-rating";
import { key as KEY } from "../utils/util.js";
import { useKey } from "../useKey.js";

const SelectedMovieDetail = ({
  selectedId,
  onCloseMovie,
  onAddWatch,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const countRef = useRef(0);
  // const KEY = "eda7f831";

  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Actors: actors,
    Poster: poster,
    Plot: plot,
    // Rating: rating,
    Director: director,
    Details: details,
    Runtime: runtime,
    Year: year,
    Title: title,
    Genre: genre,
    Released: released,
    imdbRating,
  } = movie;

  const handleAdd = () => {
    const watchedMovie = {
      imdbID: selectedId,
      userRating,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      countedUserDecision: countRef.current,
    };
    onAddWatch(watchedMovie);
    onCloseMovie();
  };

  //useEffect: getting movie detail upon component mounting
  useEffect(
    function () {
      const getMovieDetails = async () => {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          const data = await res.json();

          setMovie(data);
          setIsLoading(false);
        } catch (error) {}
      };
      getMovieDetails();
    },
    [selectedId]
  );

  //change page title to selected movie upon mount
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie || ${title}`;

      return function () {
        document.title = "UsePopcorn";
      };
    },
    [title]
  );

  //close movie detail upon esc button press
  useKey("Escape", onCloseMovie);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{details}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} imdbRating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add Watched
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} ⭐️ </p>
              )}
            </div>
            <p>
              <em> {plot}</em>
            </p>
            <p>Actors {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
};
export default SelectedMovieDetail;
