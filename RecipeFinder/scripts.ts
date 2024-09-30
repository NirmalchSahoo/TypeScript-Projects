import axios from 'axios';

// API credentials (replace with your own)
const API_KEY = 'ed952d040a99429b967b83f99340b6e8';
const API_SECRET = 'f131f505039f4d5cbdaf0eb99ec5c50d';
const BASE_URL = 'https://platform.fatsecret.com/rest/server.api';

// Get OAuth token
async function getOAuthToken(): Promise<string> {
    try {
        const response = await axios.post('https://oauth.fatsecret.com/connect/token', null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                grant_type: 'client_credentials',
                client_id: API_KEY,
                client_secret: API_SECRET,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching OAuth token', error);
        throw new Error('Failed to get token');
    }
}

// Fetch recipes using FatSecret API
async function fetchRecipes(ingredients: string): Promise<any> {
    const token = await getOAuthToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            method: 'recipes.search',
            search_expression: ingredients,
            format: 'json',
        },
    };

    try {
        const response = await axios.get(BASE_URL, config);
        return response.data.recipes.recipe;
    } catch (error) {
        console.error('Error fetching recipes', error);
        throw new Error('Failed to fetch recipes');
    }
}

// Render recipes to the DOM
function renderRecipes(recipes: any[]): void {
    const recipeContainer = document.getElementById('recipe-container') as HTMLElement;
    recipeContainer.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.recipe_name}</h3>
            <p><strong>Calories:</strong> ${recipe.recipe_calories}</p>
            <img src="${recipe.recipe_image}" alt="${recipe.recipe_name}">
        `;
        recipeContainer.appendChild(recipeCard);
    });
}

// Event listener for search button
const searchButton = document.getElementById('search-button') as HTMLButtonElement;
searchButton.addEventListener('click', async () => {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const ingredients = searchInput.value;

    if (ingredients) {
        const recipes = await fetchRecipes(ingredients);
        renderRecipes(recipes);
    } else {
        alert('Please enter ingredients');
    }
});


export{}