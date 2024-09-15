import { useState, useEffect } from "react";
import Loader from "./loader.component";
import StarRating from "../star-rating";
import { key as KEY } from "../utils/util.js";

const SelectedMovieDetail = ({
  selectedId,
  onCloseMovie,
  onAddWatch,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

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
    };
    onAddWatch(watchedMovie);
    onCloseMovie();
  };

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
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie || ${title}`;

      return function () {
        document.title = "UsePopcorn";
        console.log(`Clean up for movie ${title}`);
      };
    },
    [title]
  );
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
