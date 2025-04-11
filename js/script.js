function searchMovie() {
    const movieName = document.getElementById('movieInput').value;
  
    fetch(https://movie-database-imdb-alternative.p.rapidapi.com/?s=${movieName}&r=json&page=1, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '59f758066dmshfec404f6bc92e9fp11273djsn2848b5bcaa3b',
        'X-RapidAPI-Host': 'movie-database-imdb-alternative.p.rapidapi.com'
      }
    })
    .then(response => response.json())
    .then(data => {
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = '';

      if (data.Search) {
        data.Search.forEach(movie => {
          resultDiv.innerHTML += `
            <div style="margin-bottom: 20px;">
              <img src="${movie.Poster}" alt="${movie.Title}" width="200" /><br>
              <strong>${movie.Title} (${movie.Year})</strong>
            </div>
          `;
        });
      } else {
        resultDiv.innerHTML = "No results found.";
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("result").innerText = "Error fetching movie data.";
    });
}