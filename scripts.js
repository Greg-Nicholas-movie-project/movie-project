let searchInput;
let baseImgUrl = "https://image.tmdb.org/t/p/w500"

const renderMovies = (movies) => {
    movies.forEach((movie) => {
        $('#movie-container').append(`
            <div class="movie">
                <img src=${baseImgUrl + movie.poster_path}>
                <div class="movie-info">
                    <h2>${movie.title}</h2>
                    <span>${movie.vote_average}</span>
                </div>
                <div class="synopsis">
                    <h5>Synopsis</h5>
                    <p>${movie.overview}</p>
                </div>
            </div>
        `)
    })
}

// Call to OMDB API to get search results 
async function getMovies() {
    const movieDbUrl = `http://api.themoviedb.org/3/search/movie?api_key=${MOVIE_DB_TOKEN}&query=${searchInput}`;
    try {
        const response = await fetch(movieDbUrl);
        const data = await response.json();
        renderMovies(data.results);
        document.getElementById('search').value = "";
    } catch (error) {
        console.log(error);
    }
}
getMovies();

// Call to glitch API to get favorite movies
async function getFavorites() {
    const  glitchUrl = "https://fantasy-seasoned-leopard.glitch.me/shows"
    try {
        const response = await fetch(glitchUrl);
        const data = await response.json();
        renderMovies(data);
    } catch (error) {
        console.log(error);
    }
}
// getFavorites();

// Event Listeners

// Grab the text value from the search input
$('#form').submit((e) => { 
    e.preventDefault();
    searchInput = $('#search').val();
    getMovies(searchInput);
});