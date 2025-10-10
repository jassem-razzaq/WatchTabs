///////////////////////////////////////////////
// GOALS
// 1. Two views, one for current window only, one for all windows
// 2. Mark tabs detected as movie tabs but movie could not be found as red in list (clearly imdb or w/e link)
// 3. Mark tabs in list with colours based on which website detected from (yellow imdb, green letterboxd, etc.)
// 4. Able to save a watchlist in browser storage
// 5. Export watchlist to CSV with movie links
// 6. Implement OAuth to sign in to TMDB
// 7. Use TMDB API to create TMDB Watchlist!

// ISSUES:
// 1. Not opening on Firefox -- FIXED (just works)
//////////////////////////////////////////////

//import { useState, type ReactElement } from "react";
import browser from "webextension-polyfill";

// Year regex
const yearRe: RegExp = /(\([0-9]{4}\))$/g;

interface Movie {
  name: string | undefined;
  year: number | undefined;
  tabID: number | undefined;
}

// add options for current window or all windows
function TitleGrabber() {
  const movieArr: Movie[] = [];

  function logTabs(tabs: browser.Tabs.Tab[]) {
    for (const tab of tabs) {
      if (tab === undefined) {
        continue;
      }

      const movie: Movie = {
        name: undefined,
        year: undefined,
        tabID: tab.id,
      };

      const yearMatch: RegExpMatchArray | null | undefined =
        tab.title?.match(yearRe);
      if (yearMatch) {
        console.log("Match!");
        movie.year = Number(yearMatch[0].slice(1, -1));
        movie.name = tab.title?.slice(0, tab.title.length - yearMatch.length);
      } else {
        console.log("year not found!");
      }
      movieArr.push(movie);
      console.log(tab.title);
    }
    console.log(movieArr);
  }

  function onError(error: unknown) {
    console.error(`Error: ${error}`);
  }

  return browser.tabs.query({ currentWindow: true }).then(logTabs, onError);
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
        <button className="movie-button">
          <img className="del-ico" src="del.svg" />
        </button>
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
