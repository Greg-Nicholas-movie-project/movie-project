// Testing api search
let searchInput = "batman"

// Call to Tv Maze API to get search results 
async function getTvMaze() {
    const  url = `https://api.tvmaze.com/search/shows?q=${searchInput}`
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
getTvMaze();

// Call to glitch API to get favorite shows
async function getFavorites() {
    const  glitchUrl = "https://fantasy-seasoned-leopard.glitch.me/shows"
    try {
        const response = await fetch(glitchUrl);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
getFavorites();