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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// API credentials (replace with your own)
const API_KEY = 'ed952d040a99429b967b83f99340b6e8';
const API_SECRET = 'f131f505039f4d5cbdaf0eb99ec5c50d';
const BASE_URL = 'https://platform.fatsecret.com/rest/server.api';
// Get OAuth token
function getOAuthToken() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('https://oauth.fatsecret.com/connect/token', null, {
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
        }
        catch (error) {
            console.error('Error fetching OAuth token', error);
            throw new Error('Failed to get token');
        }
    });
}
// Fetch recipes using FatSecret API
function fetchRecipes(ingredients) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield getOAuthToken();
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
            const response = yield axios_1.default.get(BASE_URL, config);
            return response.data.recipes.recipe;
        }
        catch (error) {
            console.error('Error fetching recipes', error);
            throw new Error('Failed to fetch recipes');
        }
    });
}
// Render recipes to the DOM
function renderRecipes(recipes) {
    const recipeContainer = document.getElementById('recipe-container');
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
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const searchInput = document.getElementById('search-input');
    const ingredients = searchInput.value;
    if (ingredients) {
        const recipes = yield fetchRecipes(ingredients);
        renderRecipes(recipes);
    }
    else {
        alert('Please enter ingredients');
    }
}));
