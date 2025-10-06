import { useState } from "react";

function Movie() {
  return (
    <div className="movie">
      Movie 1<button className="movie-button"></button>
      <button className="movie-button"></button>
      <button className="movie-button"></button>
    </div>
  );
}

function MovieList() {
  return (
    <div className="movie-list">
      <ol>
        <Movie />
        <Movie />
        <Movie />
      </ol>
    </div>
  );
}

function App() {
  return (
    <>
      <MovieList />
      <button className="CSV">CSV</button>
      <button className="TMDB">TMDB</button>
    </>
  );
}

export default App;
