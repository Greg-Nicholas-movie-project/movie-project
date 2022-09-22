let searchInput;
let baseImgUrl = "https://image.tmdb.org/t/p/w500";
const glitchUrl = "https://fantasy-seasoned-leopard.glitch.me/movies";
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${MOVIE_DB_TOKEN}&language=en-US&page=1`;

//--- Popular movies and search movie API calls and rendering ---//

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

// Event Listener to grab the text value from the search input
$('#form').submit((e) => { 
    e.preventDefault();
    searchInput = $('#search').val();
    const movieSearchUrl = `http://api.themoviedb.org/3/search/movie?api_key=${MOVIE_DB_TOKEN}&query=${searchInput}`;
    getMovies(movieSearchUrl, searchInput);
});

// Onload popular movies
getMovies(popularUrl);

//--- Get and post favorite movies, API calls and rendering ---//

// Call to glitch API to get favorite movies
async function getFavorites() {
    try {
        const response = await fetch(glitchUrl);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

// Post new movie object to gitch data base
const postMovie = (newMovieObj) => {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovieObj),
    };
    fetch(glitchUrl, options)
    .then(res => {
        console.log(res)
        getFavorites();
    })
    .catch(error => console.log(error));
}

// Event listener to capture users favorite movie, store in object and call postMovie function
$(document).click('.add-btn', function(e) {
    e.target.innerHTML = "Added movie to favorites!"
    const newMovieObj = {
        title: e.target.nextElementSibling.nextElementSibling.children[0].innerHTML,
        poster_path: e.target.nextElementSibling.currentSrc,
        vote_average: e.target.nextElementSibling.nextElementSibling.children[1].innerHTML
    }
    postMovie(newMovieObj);
})
