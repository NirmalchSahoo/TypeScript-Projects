"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Function to fetch movie data from OMDB API
function fetchMovie(searchTerm) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = '51fb75f7';
        const response = yield fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`);
        const data = yield response.json();
        // Check if the response is successful
        if (data.Response === "True") {
            // Fetch detailed information for each movie
            const movies = yield Promise.all(data.Search.map((movie) => __awaiter(this, void 0, void 0, function* () {
                const movieDetails = yield fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                return yield movieDetails.json();
            })));
            return movies;
        }
        else {
            // Alert user if no movies are found
            alert("Movie not found!");
            return [];
        }
    });
}
// Function to show loader
function showLoader() {
    const loader = document.getElementById("loader");
    if (loader)
        loader.style.display = "block"; // Show loader
}
// Function to hide loader
function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader)
        loader.style.display = "none"; // Hide loader
}
// Function to display movies in a grid
function displayMovies(movies) {
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
function showMovieDetails(movie) {
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
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
}
// Function to handle search operation
function handleSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const searchInput = document.getElementById("search-input");
        const searchTerm = searchInput.value;
        // Validate the search input
        if (searchTerm.trim() === "") {
            alert("Please enter a search term.");
            return;
        }
        showLoader(); // Show loader before fetching movies
        try {
            // Fetch movies and display them
            const movies = yield fetchMovie(searchTerm);
            displayMovies(movies);
        }
        finally {
            hideLoader(); // Ensure loader is hidden after fetching is complete
        }
    });
}
// Event listener for search button click
const searchBtn = document.getElementById("search-btn");
searchBtn === null || searchBtn === void 0 ? void 0 : searchBtn.addEventListener("click", handleSearch);
// Event listener for Enter key press in search input
const searchInput = document.getElementById("search-input");
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default form submission if inside a form
        handleSearch(); // Trigger the search
    }
});
