///////////////////////////////////////////////
// GOALS
// -- Seperate handler for each movie link type (IMDB etc.)
// -- Display extracted movie data in extension list -- DONE
// -- Enable movie list item buttons
//      delete          -- DONE
//      open in new tab -- DONE
//      expand          -- DONE
//      select          -- DONE
//      click and drag  --
// -- Two views, one for current window only, one for all windows
// -- Mark tabs detected as movie tabs but movie could not be found as red in list (clearly imdb or w/e link)
// -- Show icon of imdb, letterboxd, tmdb or more sites in list item
// -- Able to save a watchlist in browser storage
// -- Export watchlist to CSV with movie links
// -- Use TMDB API through backend to get movie info, posters
// -- Implement OAuth to sign in to TMDB
// -- Use TMDB API to create TMDB Watchlist!
// -- Expand to series, anime etc.

// ISSUES:
// 1. Not opening on Firefox -- FIXED (just works)
// component for each element inside list element
// boolean flag initialized to false to display poster
// when button click onclick flip boolean flag
//////////////////////////////////////////////

//import { useState, type ReactElement } from "react";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

// Regex
const yearRe: RegExp = /(\([0-9]{4}\))/g;
const trimRe: RegExp = /(\([0-9]{4}\)).*/g;
const linkRe: RegExp =
  /(imdb\.com\/title)|(letterboxd\.com\/film)|(rottentomatoes\.com\/m)|(flickfocus\.com\/movies)|(themoviedb\.org\/movie\/)/g;
const imdbRe: RegExp = /(imdb\.com\/title)/;
const tmdbRe: RegExp = /(themoviedb\.org\/movie\/)/;
const letterboxdRe: RegExp = /(letterboxd\.com\/film)/;
const rottentomatoesRe: RegExp = /(rottentomatoes\.com\/m)/;
const flickfocusRe: RegExp = /(flickfocus\.com\/movies)/;

// Icons
const imdbIco: string = "imdb.png";
const tmbdIco: string = "tmdb.png";
const letterboxdIco: string = "letterboxd.png";
const rottentomatoesIco: string = "rottentomatoes.png";
const flickfocusIco: string = "flickfocus.png";

type Movie = {
  name: string;
  year: number;
  link: string;
  icon: string;
  tabID: number;
  isExpanded: boolean;
};

type MovieListItemProps = {
  movie: Movie;
  onOpen: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
  onToggleExpand: (movie: Movie) => void;
};

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
            link: "",
            icon: "",
            tabID: 0,
            isExpanded: false,
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
          // Extract url
          movie.link = tab.url;
          // Set icon
          if (tab.url.match(imdbRe)) movie.icon = imdbIco;
          else if (tab.url.match(tmdbRe)) movie.icon = tmbdIco;
          else if (tab.url.match(letterboxdRe)) movie.icon = letterboxdIco;
          else if (tab.url.match(rottentomatoesRe))
            movie.icon = rottentomatoesIco;
          else if (tab.url.match(flickfocusRe)) movie.icon = flickfocusIco;
          if (linkMatch[0])
            if (tab.id) {
              // Extract tab id
              movie.tabID = tab.id;
            }
          titleMovieObjArr.push(movie);
        }
      }
    }
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

function MovieListItem({
  movie,
  onOpen,
  onDelete,
  onToggleExpand,
}: MovieListItemProps) {
  return (
    <li key={movie.tabID} className="movie-element">
      <div className="movie-title">{movie.name}</div>
      <div className="movie-button-cont">
        <img className="movie-ico" src={movie.icon} />

        <button className="movie-button" onClick={() => onToggleExpand(movie)}>
          <img className="exp-ico" src="expand.png" />
        </button>

        <button className="movie-button" onClick={() => onOpen(movie)}>
          <img className="open-ico" src="open.png" />
        </button>

        <button className="movie-button" onClick={() => onDelete(movie)}>
          <img className="del-ico" src="trash.png" />
        </button>

        <label className="checkmark">
          <input type="checkbox" name="myCheckbox" value={movie.tabID} />
        </label>
      </div>
      {movie.isExpanded && (
        <div className="movie-expand">
          <p>Image</p>
          <div className="movie-details">
            <p>This is a short synopsis about the movie</p>
          </div>
        </div>
      )}
    </li>
  );
}

function Movie() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    async function grabMovieTitles() {
      const movieTabs = await titleGrabber();
      setMovies(movieTabs);
    }
    grabMovieTitles();
  }, []);

  const handleOpen = (movie: Movie) => {
    browser.tabs.update(movie.tabID, { active: true });
  };

  const handleDelete = (movie: Movie) => {
    setMovies((prev) => prev.filter((m) => m.tabID !== movie.tabID));
  };

  const handleToggleExpand = (movie: Movie) => {
    setMovies((prev) =>
      prev.map((m) =>
        m.tabID === movie.tabID ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  return (
    <>
      {movies.map((movie) => (
        <MovieListItem
          key={movie.tabID}
          movie={movie}
          onOpen={handleOpen}
          onDelete={handleDelete}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </>
  );
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
          <button className="CSV" onClick={() => console.log("CSV clicked")}>
            CSV
          </button>
          <button className="TMDB" onClick={() => console.log("TMDB clicked")}>
            TMDB
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
