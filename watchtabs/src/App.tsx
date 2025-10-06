import { useState } from "react";

function Movie() {
  return (
    <div className="movie">
      <div className="movie-cont">Movie 1</div>
      <div className="movie-button-cont">
        <button className="movie-button"></button>
        <button className="movie-button"></button>
        <button className="movie-button"></button>
      </div>
    </div>
  );
}

function MovieList() {
  return (
    <div className="movie-list">
      <ol className="list-element">
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
