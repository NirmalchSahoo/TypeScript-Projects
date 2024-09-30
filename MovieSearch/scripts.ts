// Interface for movie data structure
interface Movie {
    Title: string;
    Poster: string;
    Plot: string;
    imdbRating: string;
    Actors: string;
    Genre: string;
    Year: string;
    Runtime: string;
    Director: string;
    Writer: string;
}

// Function to fetch movie data from OMDB API
async function fetchMovie(searchTerm: string): Promise<Movie[]> {
    const apiKey = '51fb75f7'; 
    const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`);
    const data = await response.json();

    // Check if the response is successful
    if (data.Response === "True") {
        // Fetch detailed information for each movie
        const movies: Movie[] = await Promise.all(
            data.Search.map(async (movie: any) => {
                const movieDetails = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                return await movieDetails.json();
            })
        );
        return movies;
    } else {
        // Alert user if no movies are found
        alert("Movie not found!");
        return [];
    }
}

// Function to show loader
function showLoader(): void {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "block"; // Show loader
}

// Function to hide loader
function hideLoader(): void {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none"; // Hide loader
}

// Function to display movies in a grid
function displayMovies(movies: Movie[]): void {
    const movieContainer = document.getElementById("movie-container");
    if (movieContainer) {
        movieContainer.innerHTML = ""; // Clear previous results

        // Loop through the list of movies and create movie cards
        movies.forEach(movie => {
            const movieCard = document.createElement("div");
            movieCard.classList.add("movie-card");

            movieCard.innerHTML = `
                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200'}" alt="${movie.Title}" class="movie-poster">
                <div class="movie-details">
                    <h2 class="movie-title">${movie.Title}</h2>
                    <p class="movie-plot">${movie.Plot}</p>
                    <p class="movie-rating">IMDb Rating: ${movie.imdbRating}</p>
                </div>
            `;

            // Add a click event to each movie card to show details in a modal
            movieCard.addEventListener("click", () => showMovieDetails(movie));

            movieContainer.appendChild(movieCard);
        });
    }
}

// Function to show detailed movie information in a modal
function showMovieDetails(movie: Movie): void {
    const modal = document.getElementById("movie-modal");
    const modalDetails = document.getElementById("modal-details");

    if (modal && modalDetails) {
        // Populate modal with movie details
        modalDetails.innerHTML = `
            <h2>${movie.Title}</h2>
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200'}" alt="${movie.Title}" style="width: 100%; max-width: 300px;">
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
            <p><strong>Cast:</strong> ${movie.Actors}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Writer:</strong> ${movie.Writer}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
        `;

        // Show the modal
        modal.style.display = "flex";

        // Close the modal when the close button is clicked
        const closeBtn = document.querySelector(".close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        // Close the modal if clicked outside of the modal content
        window.addEventListener("click", (e: MouseEvent) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
}

// Function to handle search operation
async function handleSearch(): Promise<void> {
    const searchInput = document.getElementById("search-input") as HTMLInputElement;
    const searchTerm = searchInput.value;

    // Validate the search input
    if (searchTerm.trim() === "") {
        alert("Please enter a search term.");
        return;
    }

    showLoader(); // Show loader before fetching movies

    try {
        // Fetch movies and display them
        const movies = await fetchMovie(searchTerm);
        displayMovies(movies);
    } finally {
        hideLoader(); // Ensure loader is hidden after fetching is complete
    }
}

// Event listener for search button click
const searchBtn = document.getElementById("search-btn");
searchBtn?.addEventListener("click", handleSearch);

// Event listener for Enter key press in search input
const searchInput = document.getElementById("search-input") as HTMLInputElement;
searchInput?.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission if inside a form
        handleSearch(); // Trigger the search
    }
});
