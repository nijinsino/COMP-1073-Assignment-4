const movieContainer = document.getElementById("movieContainer");
const loader = document.getElementById("loader");
const input = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");

const omdbKey = "e02b01e6";
const tmdbKey = "e14d483c15025803effbfa65577655d1";

// Random movie titles for page load
const randomMovies = [
  "Inception", "Interstellar", "The Matrix", "Gladiator",
  "Avengers", "Joker", "Pulp Fiction", "Titanic",
  "The Dark Knight", "Forrest Gump"
];

// TMDb genre IDs
const genreIDs = {
  "Action": 28,
  "Comedy": 35,
  "Drama": 18,
  "Romance": 10749,
  "Sci-Fi": 878
};

// Load a random movie on page load
window.addEventListener("load", () => {
  const random = randomMovies[Math.floor(Math.random() * randomMovies.length)];
  fetchSingleMovieByTitle(random);
});

// Handle search
searchBtn.addEventListener("click", () => {
  const query = input.value.trim();
  if (query) {
    fetchSingleMovieByTitle(query);
  } else {
    alert("Please enter a movie name.");
  }
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Genre buttons → TMDb discovery
document.querySelectorAll(".genre-btn").forEach(button => {
  button.addEventListener("click", () => {
    const genre = button.dataset.genre;
    const genreId = genreIDs[genre];
    discoverMoviesByGenre(genreId);
  });
});

// Fetch multiple movies from TMDb by genre
function discoverMoviesByGenre(genreId) {
  loader.classList.remove("hidden");
  movieContainer.innerHTML = "";

  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${tmdbKey}&with_genres=${genreId}&language=en-US&page=1`)
    .then(res => res.json())
    .then(data => {
      const movies = data.results.slice(0, 12); // limit to 12

      if (movies.length === 0) {
        loader.classList.add("hidden");
        movieContainer.innerHTML = `<p style="color:red;">No movies found in this genre.</p>`;
        return;
      }

      movies.forEach(movie => {
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
          : "https://via.placeholder.com/300x445?text=No+Image";

        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
          <img src="${poster}" alt="${movie.title}" />
          <p><strong>${movie.title}</strong> (${movie.release_date?.slice(0, 4) || "N/A"})</p>
          <button class="details-btn" data-id="${movie.id}">More Info</button>
        `;

        movieContainer.appendChild(card);
      });

      loader.classList.add("hidden");

      // Attach OMDb fetch to each "More Info" button
      document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", () => {
          const tmdbMovieId = button.dataset.id;
          fetch(`https://api.themoviedb.org/3/movie/${tmdbMovieId}/external_ids?api_key=${tmdbKey}`)
            .then(res => res.json())
            .then(idData => {
              const imdbID = idData.imdb_id;
              if (imdbID) {
                fetchSingleMovieByID(imdbID);
              }
            });
        });
      });

    })
    .catch(err => {
      loader.classList.add("hidden");
      console.error("TMDb genre fetch error:", err);
      movieContainer.innerHTML = `<p style="color:red;">Error fetching genre movies.</p>`;
    });
}

// Fetch movie by title using OMDb
function fetchSingleMovieByTitle(title) {
  fetchAndDisplayMovie(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${omdbKey}`);
}

// Fetch movie by IMDb ID using OMDb
function fetchSingleMovieByID(imdbID) {
  fetchAndDisplayMovie(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbKey}`);
}

// Fetch + display single movie details (OMDb)
function fetchAndDisplayMovie(url) {
  loader.classList.remove("hidden");
  movieContainer.innerHTML = "";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      loader.classList.add("hidden");

      if (data.Response === "True") {
        const poster = data.Poster !== "N/A"
          ? data.Poster
          : "https://via.placeholder.com/300x445?text=No+Image";

        const genreTags = data.Genre.split(",")
          .map(g => `<span class="badge">${g.trim()}</span>`)
          .join(" ");

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

        // Share IMDb link
        document.querySelector(".share-btn").addEventListener("click", () => {
          const imdbUrl = `https://www.imdb.com/title/${data.imdbID}`;
          navigator.clipboard.writeText(imdbUrl)
            .then(() => alert("IMDb link copied to clipboard!"))
            .catch(() => alert("Failed to copy link."));
        });

      } else {
        movieContainer.innerHTML = `<p style="color:red;">Movie not found.</p>`;
      }
    })
    .catch(err => {
      loader.classList.add("hidden");
      console.error("OMDb fetch error:", err);
      movieContainer.innerHTML = `<p style="color:red;">Something went wrong.</p>`;
    });
}
