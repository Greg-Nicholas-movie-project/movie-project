
async function getMovies() {
    const  url = "https://fantasy-seasoned-leopard.glitch.me/movies"
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
getMovies();