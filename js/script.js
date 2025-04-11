function searchMovie() {
    const movieName = document.getElementById('movieInput').value;
  
    fetch(https://movie-database-imdb-alternative.p.rapidapi.com/?s=${movieName}&r=json&page=1, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '59f758066dmshfec404f6bc92e9fp11273djsn2848b5bcaa3b',
        'X-RapidAPI-Host': 'movie-database-imdb-alternative.p.rapidapi.com'
      }