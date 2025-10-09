//import { useState, type ReactElement } from "react";
import browser from "webextension-polyfill";

function TitleGrabber() {
  function logTabs(tabs: browser.Tabs.Tab[]) {
    for (const tab of tabs) {
      // tab.url requires the `tabs` permission or a matching host permission.
      console.log(tab.url);
    }
  }

  function onError(error: unknown) {
    console.error(`Error: ${error}`);
  }

  return browser.tabs.query({}).then(logTabs, onError);
}

function Movie() {
  // Get list of movies from tabs in array
  const movieArr: string[] = [
    "Night of the Day of the Dawn of the Son of the Bride of the Return of the Revenge of the Terror of the Attack of the Evil, Mutant, Hellbound, Flesh-Eating Subhumanoid (2005)",
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

  // Return list elements with key as index
  return movieArr.map((title: string, index: number) => (
    <li key={index} className="movie-element">
      <div className="movie-title">{title}</div>
      <div className="movie-button-cont">
        <button className="movie-button"></button>
        <button className="movie-button"></button>
      </div>
    </li>
  ));
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
        <h1 className="list-heading">Movies detected in current window</h1>
        <MovieList />
        <div className="export-cont">
          <button className="CSV" onClick={TitleGrabber}>
            CSV
          </button>
          <button className="TMDB">TMDB</button>
        </div>
      </div>
    </>
  );
}

export default App;
