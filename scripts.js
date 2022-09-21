let searchInput;
let baseImgUrl = "https://image.tmdb.org/t/p/w500"
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${MOVIE_DB_TOKEN}&language=en-US&page=1`

const renderMovies = (movies) => {
    $('#movie-container').empty();
    movies.forEach((movie) => {
        $('#movie-container').append(`
            <div class="movie">
                <p class="add-btn">Add to Favorites</p>
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
async function getMovies(url, searchInput) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderMovies(data.results);
        document.getElementById('search').value = "";
    } catch (error) {
        console.log(error);
    }
}

// Call to glitch API to get favorite movies
async function getFavorites() {
    const  glitchUrl = "https://fantasy-seasoned-leopard.glitch.me/movies"
    try {
        const response = await fetch(glitchUrl);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
getFavorites();

// Event Listeners

// Grab the text value from the search input
$('#form').submit((e) => { 
    e.preventDefault();
    searchInput = $('#search').val();
    const movieSearchUrl = `http://api.themoviedb.org/3/search/movie?api_key=${MOVIE_DB_TOKEN}&query=${searchInput}`;
    getMovies(movieSearchUrl, searchInput);
});

// Capture users pick to add to favorites
$(document).click('.add-btn', function(e) {
    let img = e.target.nextElementSibling.currentSrc;
    let title = e.target.nextElementSibling.nextElementSibling.children[0].innerHTML;
    let rating = e.target.nextElementSibling.nextElementSibling.children[1].innerHTML;
    console.log(title, rating, img);
})

// Onload popular movies
getMovies(popularUrl);
