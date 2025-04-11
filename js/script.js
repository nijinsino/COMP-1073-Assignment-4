//group three 



// Movie App using OMDb API
//  (https://www.omdbapi.com/) 
// and TMDb API 
// (https://developer.themoviedb.org/)
// Data and images are fetched from the above APIs 



//here we used API 
// keys from IMDB and TMDB


// it will 
// get references 
const movieContainer = document.getElementById("movieContainer");
const loader = document.getElementById("loader");
const input = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");

// API 
// keys
const omdbKey = "e02b01e6"; // OMDb API key
const tmdbKey = "e14d483c15025803effbfa65577655d1"; // TMDb API key

// this is the 
//  list of random popular 
// movies to pick from when page loads
const randomMovies = [
  "Inception", "Interstellar", "The Matrix", "Gladiator",
  "Avengers", "Joker", "Pulp Fiction", "Titanic",
  "The Dark Knight", "Forrest Gump"
];

// TMDb genre IDs used for 
// genre-based movie discovery
const genreIDs = {
  "Action": 28,
  "Comedy": 35,
  "Drama": 18,
  "Romance": 10749,
  "Sci-Fi": 878
};

// it will help to
// load a random movie from OMDb

window.addEventListener("load", () => {
  const random = randomMovies[Math.floor(Math.random() * randomMovies.length)];

  // this will fetch OMDb details
  fetchSingleMovieByTitle(random); 
});

// here 
// when user 
// clicks the search button, it will search button
searchBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (query) {


    // fetch movie by title
    fetchSingleMovieByTitle(query); 
  } else {
    alert("Please enter a movie name.");
  }
});

// this will 
// allow user
//  to press Enter to search
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// this will 
// set up click event for
//  genre filter buttons
document.querySelectorAll(".genre-btn").forEach(button => {
  button.addEventListener("click", () => {
    const genre = button.dataset.genre;
    const genreId = genreIDs[genre];
    discoverMoviesByGenre(genreId); // Fetch movies by genre
  });
});

// it will discover 
// movies by genre 

function discoverMoviesByGenre(genreId) {
  loader.classList.remove("hidden"); 
  movieContainer.innerHTML = ""; 

  // this will 
  // fetch movies from TMDbs
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=${genreId}&language=en-US&page=1`)
    .then(res => res.json())
    .then(data => {
      const movies = data.results.slice(0, 12); 

      // If no movies found
      if (movies.length === 0) {
        loader.classList.add("hidden");
        movieContainer.innerHTML = `<p style="color:red;">No movies found in this genre.</p>`;
        return;
      }

      // this will 
      // display movie cards


      
      movies.forEach(movie => {
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : "https://via.placeholder.com/300x445?text=No+Image";

        // this will create movie card with
        //  TMDb title and release year
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
          <img src="${poster}" alt="${movie.title}" />
          <p><strong>${movie.title}</strong> (${movie.release_date?.slice(0, 4) || "N/A"})</p>
          <button class="details-btn" data-id="${movie.id}">More Info</button>
        `;

        movieContainer.appendChild(card);
      });

      loader.classList.add("hidden"); // this function will hide loader

      // this will show 
      // "More Info" buttons to fetch 
      document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", () => {
          const tmdbMovieId = button.dataset.id;
          // Get external IMDb ID using TMDb movie ID
          fetch(`https://api.themoviedb.org/3/movie/${tmdbMovieId}/external_ids?api_key=${tmdbKey}`)
            .then(res => res.json())
            .then(idData => {
              const imdbID = idData.imdb_id;
              if (imdbID) {
                fetchSingleMovieByID(imdbID); // Fetch detailed OMDb info
              }
            });
        });
      });

    })
    //error handler
    .catch(err => {
      loader.classList.add("hidden");
      console.error("TMDb genre fetch error:", err);
      
    });
}

// fetch 
// movie data by title using OMDb API
function fetchSingleMovieByTitle(title) {
  fetchAndDisplayMovie(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbKey}`);
}

// this will 
// fetch movie data

function fetchSingleMovieByID(imdbID) {
  fetchAndDisplayMovie(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbKey}`);
}

// Generic function to fetch and display a single movie using OMDb
function fetchAndDisplayMovie(url) {
  loader.classList.remove("hidden"); // Show loader
  movieContainer.innerHTML = ""; // Clear previous content

  fetch(url)
    .then(res => res.json())
    .then(data => {
      loader.classList.add("hidden"); // Hide loader

      // If movie found it 
      if (data.Response === "True") {
        const poster = data.Poster !== "N/A"
          ? data.Poster
          : "https://via.placeholder.com/300x445?text=No+Image";

        // this will 
        // generate genre badges
        const genreTags = data.Genre.split(",")
          .map(g => `<span class="badge">${g.trim()}</span>`)
          .join(" ");

        //this will  
        // display
        //  detailed movie info
        movieContainer.innerHTML = `
          <div class="movie-card">
            <img src="${poster}" alt="${data.Title}" />
            <p><strong>${data.Title}</strong> (${data.Year})</p>
            <p>⭐ <strong>IMDb:</strong> ${data.imdbRating}</p>
            <p><strong>Genres:</strong> ${genreTags}</p>
            <p><strong>Plot:</strong> ${data.Plot}</p>
            <p><strong>Director:</strong> ${data.Director}</p>
            <button class="share-btn">🔗 Copy IMDb Link</button>
          </div>
        `;

        // here user can see a copy 
        // imdb link where user
        //  get the link of movie
        
        document.querySelector(".share-btn").addEventListener("click", () => {
          const imdbUrl = `https://www.imdb.com/title/${data.imdbID}`;
          navigator.clipboard.writeText(imdbUrl)
            .then(() => alert("IMDb link copied to clipboard!"))
            .catch(() => alert("Failed to copy link."));
        });

      } else {
        // this will show error 
        // if movie not found
        movieContainer.innerHTML = `<p style="color:red;">Movie not found.</p>`;
      }
    })

    //this function will 
    // handle errors if the
    //  OMDb API fetch fails
    .catch(err => {
      loader.classList.add("hidden");
      console.error("OMDb fetch error:", err);
      
    });
}
