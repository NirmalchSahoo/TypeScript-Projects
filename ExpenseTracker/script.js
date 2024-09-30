"use strict";
// script.ts
// Get references to the DOM elements
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const list = document.getElementById('list');
const chartCanvas = document.getElementById('chart');
// Array to store all expenses
let expenses = [];
// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Get the values from the form inputs
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    // Validate input values and check that category is not the default empty string
    if (description && !isNaN(amount) && category) {
        // Create a new expense object
        const expense = { description, amount, category };
        expenses.push(expense); // Add the new expense to the list
        renderExpenses(); // Update the expense list display
        drawChart(); // Redraw the chart to include the new expense
        form.reset(); // Reset the form fields
        // Reset the category select to default "Select"
        categorySelect.selectedIndex = 0;
    }
});
// Function to render the list of expenses
function renderExpenses() {
    list.innerHTML = ''; // Clear existing list items
    expenses.forEach(expense => {
        // Create a new list item for each expense
        const li = document.createElement('li');
        li.textContent = `${expense.description} - ₹${expense.amount.toFixed(2)} (${expense.category})`;
        list.appendChild(li); // Append the new list item to the list
    });
}
// Function to draw the pie chart
function drawChart() {
    const ctx = chartCanvas.getContext('2d');
    if (!ctx)
        return; // Exit if the canvas context is not available
    // Define the categories
    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment'];
    // Calculate the total amount for each category
    const categoryTotals = categories.reduce((totals, category) => {
        // Calculate the total amount for each category
        totals[category] = expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0);
        return totals;
    }, {});
    // Calculate the total amount of all expenses
    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    // Start drawing the pie chart
    let startAngle = 0;
    categories.forEach((category) => {
        // Calculate the angle for each slice of the pie chart
        const amount = categoryTotals[category];
        const sliceAngle = (amount / total) * 2 * Math.PI;
        // Draw each slice of the pie chart
        ctx.beginPath();
        ctx.arc(200, 200, 200, startAngle, startAngle + sliceAngle); // Draw the arc
        ctx.lineTo(200, 200); // Draw a line to the center
        ctx.fillStyle = getCategoryColor(category); // Set the color for the slice
        ctx.fill(); // Fill the slice with color
        startAngle += sliceAngle; // Update the starting angle for the next slice
    });
}
// Function to get the color for a given category
function getCategoryColor(category) {
    // Define colors for each category
    const colors = {
        'Food': '#ff9999',
        'Transport': '#66b3ff',
        'Utilities': '#99ff99',
        'Entertainment': '#ffcc99',
    };
    return colors[category]; // Return the color for the given category
}
