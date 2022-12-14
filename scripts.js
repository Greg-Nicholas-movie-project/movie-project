let searchInput;
let movieId;
let newTitle = document.querySelector('#newTitle');
let newRating = document.querySelector('#newRating');
const loaderEl = document.querySelector('.loader');
const baseImgUrl = "https://image.tmdb.org/t/p/w500";
const glitchUrl = "https://fantasy-seasoned-leopard.glitch.me/movies";
const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${MOVIE_DB_TOKEN}&language=en-US&page=1&include_adult=false`;

// Function to hide loader
const showContent = () => {
    loaderEl.classList.add('hidden');
}

//--- Popular movies and search movie API calls and rendering ---//
const renderMovies = (movies) => {
    $('#movie-container').empty();
    movies.forEach((movie) => {
        $('#movie-container').append(`
            <div class="movie">
                <p class="add-btn">Add to Favorites</p>
                <img src=${baseImgUrl + movie.poster_path}>
                <div class="movie-info">
                    <h5>${movie.title}</h5>
                    <span>${movie.vote_average}</span>
                </div>
                <div class="synopsis">
                    <h5>Synopsis</h5>
                    <p>${movie.overview}</p>
                </div>
            </div>
        `);
    });
    showContent();
}

// Call to OMDB API to get search results 
async function getMovies(url, searchInput) {
    // Show loader
    loaderEl.classList.remove('hidden');
    try {
        const response = await fetch(url);
        const data = await response.json();
        setTimeout(() => {
            renderMovies(data.results);
        }, 800);
        document.getElementById('search').value = "";
    } catch (error) {
        console.log(error);
    }
}

// Event Listener to grab the text value from the search input
$('#form').submit((e) => { 
    e.preventDefault();
    searchInput = $('#search').val();
    const movieSearchUrl = `http://api.themoviedb.org/3/search/movie?api_key=${MOVIE_DB_TOKEN}&query=${searchInput}&include_adult=false`;
    getMovies(movieSearchUrl, searchInput);
});

// Onload render popular movies
getMovies(popularUrl);

//--- Get and post favorite movies, API calls and rendering ---//

const renderFavorites = (movies) => {
    $('#favorites-container').empty();
    movies.forEach((movie) => {
        $('#favorites-container').append(`
            <div class="movie">
                <div class="d-flex justify-content-between">
                    <p class="delete-btn" id="${movie.id}">Delete</p>
                    <p class="edit-btn" data-bs-toggle="modal" data-bs-target="#editModal">Edit</p>
                </div>
                <img src=${movie.poster_path}>
                <div class="movie-info">
                    <h5>${movie.title}</h5>
                    <span>${movie.vote_average}</span>
                </div>
            </div>
        `);
    });
};

// Call to glitch API to get favorite movies
async function getFavorites() {
    try {
        const response = await fetch(glitchUrl);
        const data = await response.json();
        renderFavorites(data);
    } catch (error) {
        console.log(error);
    }
}

// Onload render favorite movies
getFavorites();

// Post new movie object to glitch database
async function postMovie(newMovieObj) {
    // Conditional to check for duplicate movies in glitch DB
    try {
        const res = await fetch(glitchUrl);
        const data = await res.json();
        const checkDuplicate = data.some((item) => item.title === newMovieObj.title);
        // Will add to favorites if not in database
        if (!checkDuplicate) {
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMovieObj),
            };
            try {
                const res = await fetch(glitchUrl, options);
                getFavorites();
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(`${newMovieObj.title} is already in Favorites List`);
        }
    } catch (error) {
        console.log(error);
    }
}

// Event listener to capture users favorite movie, store in object and call postMovie function
$(document).on('click', '.add-btn', function() {
    $(this).html('Added To Favorites')
    const newMovieObj = {
        title: $(this).siblings()[1].children[0].innerHTML,
        poster_path: $(this).siblings()[0].src,
        vote_average: $(this).siblings()[1].children[1].innerHTML
    }
    postMovie(newMovieObj);
})

//--- Delete and render updated movies ---//

// Delete movie object from glitch database
async function deleteMovie(movieId) {
    const options = {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'}
    };
    try {
        const res = await fetch(`${glitchUrl}/${movieId}`, options);
        getFavorites();
    } catch (error) {
        console.log(error);
    };
}

// Event listener to delete movie from favorites
$(document).on('click', '.delete-btn', function() {
    const movieId = $(this)[0].id;
    deleteMovie(movieId);
});

//--- Edit movies ---//

// Edit movie with API call to glitch db
async function EditMovie(movieId, newTitle, newRating) {
    const edits  = {
        title: newTitle,
        vote_average: newRating
    };
    const options = {
        method: "PATCH",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(edits)
    };
    try {
        const res = await fetch(`${glitchUrl}/${movieId}`, options);
        getFavorites();
    } catch (error) {
        console.log(error);
    };
}

// Event listener to edit movie from favorites
$(document).on('click', '.edit-btn', function() {
    movieId = $(this)[0].previousElementSibling.id;
    $('#edit-form').submit(function (e) { 
        e.preventDefault();
        EditMovie(movieId, newTitle.value, newRating.value);
        newTitle.value = '';
        newRating.value = '';
    });
});
