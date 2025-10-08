import { useState, type ReactElement } from "react";

function Movie() {
  // Get list of movies from tabs in array
  const movieArr: string[] = [
    "The Matrix (1999)",
    "The Shawshank Redemption (1999)",
    "3 Idiots (2017)",
    "The Matrix (1999)",
    "The Shawshank Redemption (1999)",
    "3 Idiots (2017)",
    "The Matrix (1999)",
    "The Shawshank Redemption (1999)",
    "3 Idiots (2017)",
    "The Matrix (1999)",
    "The Shawshank Redemption (1999)",
    "3 Idiots (2017)",
    "The Matrix (1999)",
    "The Shawshank Redemption (1999)",
    "3 Idiots (2017)",
  ];

  // Create output array of list elements
  let resultArr: ReactElement[] = [];

  // Loop over movies array and create list elements
  for (let i = 0; i < movieArr.length; i++) {
    resultArr.push(
      <div className="movie">
        <div className="movie-cont">{movieArr[i]}</div>
        <div className="movie-button-cont">
          <button className="movie-button">
            <i className="fa-regular fa-clone"></i>
          </button>
          <button className="movie-button">
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    );
  }
  return resultArr;
}

function MovieList() {
  return (
    <div className="movie-list">
      <ol className="list-element">
        <Movie />
      </ol>
    </div>
  );
}

function App() {
  return (
    <>
      <div className="extension-cont">
        <MovieList />
        <div className="export-cont">
          <button className="CSV">CSV</button>
          <button className="TMDB">TMDB</button>
        </div>
      </div>
    </>
  );
}

export default App;
