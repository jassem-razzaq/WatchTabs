///////////////////////////////////////////////
// GOALS
// -- Seperate handler for each movie link type (IMDB etc.)
// -- Display extracted movie data in exension link
// -- Enable movie list item buttons (delete, open in new tab, select, click and drag)
// -- Two views, one for current window only, one for all windows
// -- Mark tabs detected as movie tabs but movie could not be found as red in list (clearly imdb or w/e link)
// -- Mark tabs in list with colours based on which website detected from (yellow imdb, green letterboxd, etc.)
// -- Able to save a watchlist in browser storage
// -- Export watchlist to CSV with movie links
// -- Implement OAuth to sign in to TMDB
// -- Use TMDB API to create TMDB Watchlist!
// -- Expand to series, anime etc.

// ISSUES:
// 1. Not opening on Firefox -- FIXED (just works)
//////////////////////////////////////////////

//import { useState, type ReactElement } from "react";
import browser from "webextension-polyfill";

// Regex
const yearRe: RegExp = /(\([0-9]{4}\))/g;
const trimRe: RegExp = /(\([0-9]{4}\)).*/g;
const linkRe: RegExp =
  /(imdb\.com\/title)|(letterboxd\.com\/film)|(rottentomatoes\.com\/m)|(flickfocus\.com\/movies)|(themoviedb\.org\/movie\/)/g;

interface Movie {
  name: string;
  year: number;
  tabID: number;
}

// add options for current window or all windows
async function titleGrabber() {
  const titleMovieObjArr: Movie[] = [];

  function logTabs(tabs: browser.Tabs.Tab[]) {
    for (const tab of tabs) {
      if (tab.url && tab.title) {
        // Check for movie url
        const linkMatch = tab.url.match(linkRe);
        if (linkMatch) {
          const movie: Movie = {
            name: "Not Found",
            year: 0,
            tabID: 0,
          };

          // Regex match for year and trim length for title
          const yearMatch: RegExpMatchArray | null = tab.title?.match(yearRe);
          const trimMatch: RegExpMatchArray | null = tab.title?.match(trimRe);

          // Extract year
          if (yearMatch) {
            movie.year = Number(yearMatch[0].slice(1, -1).trim());
          } else {
            console.log("year not found!");
          }
          // Extract title
          if (trimMatch) {
            movie.name = tab.title
              ?.slice(0, tab.title.length - trimMatch[0].length)
              .trim();
          } else {
            movie.name = tab.title;
          }

          // Extract tab id
          if (tab.id) {
            movie.tabID = tab.id;
          }
          titleMovieObjArr.push(movie);
        }
      }
    }
    //console.log(movieArr);
  }

  function onError(error: unknown) {
    console.error(`Error: ${error}`);
  }

  try {
    const tabs = await browser.tabs.query({ currentWindow: true });
    logTabs(tabs);
  } catch (error) {
    onError(error);
  }
  return titleMovieObjArr;
}

const movieObjArr: Movie[] = await titleGrabber();
const movieArr: string[] = movieObjArr.map((movie) => movie.name);

console.log("raw movies data", movieObjArr);
console.log("extracted movie names", movieArr);

function Movie() {
  console.log(movieArr);
  // const movieArr: string[] = [
  //   "Night of the Day of the Dawn of the Son of the Bride of the Return of the Revenge of the Terror of the Attack of the Evil, Mutant, Hellbound, Flesh-Eating Subhumanoid (2005)",
  //   "The Shawshank Redemption (1999)",
  //   "3 Idiots (2017)",
  //   "The Matrix (1999)",
  //   "The Shawshank Redemption (1999)",
  //   "3 Idiots (2017)",
  //   "The Matrix (1999)",
  //   "The Shawshank Redemption (1999)",
  //   "3 Idiots (2017)",
  //   "The Matrix (1999)",
  //   "The Shawshank Redemption (1999)",
  //   "3 Idiots (2017)",
  //   "The Matrix (1999)",
  //   "The Shawshank Redemption (1999)",
  //   "3 Idiots (2017)",
  // ];

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
          <button className="CSV">CSV</button>
          <button className="TMDB">TMDB</button>
        </div>
      </div>
    </>
  );
}

export default App;
