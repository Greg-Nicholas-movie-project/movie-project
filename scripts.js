let searchInput;

const renderMovies = (movies) => {
    console.log(movies);
}

// Call to OMDB API to get search results 
async function getMovies() {
    const omDbUrl = `http://www.omdbapi.com/?s=${searchInput}&apikey=${OMDB_TOKEN}`;
    try {
        const response = await fetch(omDbUrl);
        const data = await response.json();
        renderMovies(data);
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
getFavorites();

// Event Listeners

// Grab the text value from the search input
$('#form').submit((e) => { 
    e.preventDefault();
    searchInput = $('#search').val();
    getMovies(searchInput);
});