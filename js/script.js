function searchMovie() {
    const movieName = document.getElementById('movieInput').value.trim();
    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
  
    resultDiv.innerHTML = '';
    loader.classList.remove('hidden');
  
    if (!movieName) {
      loader.classList.add('hidden');
      alert("Please enter a movie name.");
      return;
    }
  
    // Corrected: added backticks ``
    fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=e02b01e6`)
      .then(res => res.json())
      .then(data => {
        loader.classList.add('hidden');
  
        if (data.Response === "True") {
          resultDiv.innerHTML = `
            <div class="movie-card">
              <img src="${data.Poster}" alt="${data.Title}">
              <div class="movie-info">
                <div class="movie-title">${data.Title} (${data.Year})</div>
                <div class="movie-rating">⭐ IMDb Rating: ${data.imdbRating}</div>
                <div class="movie-plot">${data.Plot}</div>
              </div>
            </div>
          `;
        } else {
          // Corrected: wrapped the HTML in quotes
          resultDiv.innerHTML = `<p>No results found for "${movieName}".</p>`;
        }
      })
      .catch(err => {
        console.error("Error:", err);
        loader.classList.add('hidden');
        resultDiv.innerHTML = "Something went wrong. Please try again.";
      });
  }
  