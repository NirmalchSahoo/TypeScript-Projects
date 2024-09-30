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
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const convertButton = document.getElementById('convertButton');
const reverseButton = document.getElementById('reverseButton');
const resultDisplay = document.getElementById('result');
const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=b5443b0afee145bd95f19b0582301b60';
let exchangeRates = {};
function fetchExchangeRates() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiUrl);
            const data = yield response.json();
            if (data && data.rates) {
                exchangeRates = data.rates;
                populateCurrencyOptions(Object.keys(exchangeRates));
            }
            else {
                console.error('Invalid API response:', data);
            }
        }
        catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    });
}
function populateCurrencyOptions(currencies) {
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';
    if (currencies.length === 0) {
        console.error('No currencies found');
        return;
    }
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = currency;
        fromCurrencySelect.appendChild(option);
        toCurrencySelect.appendChild(option.cloneNode(true));
    });
}
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    if (isNaN(amount) || fromCurrency === toCurrency) {
        resultDisplay.textContent = 'Please enter a valid amount and select different currencies.';
        return;
    }
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    if (fromRate && toRate) {
        const conversionRate = toRate / fromRate;
        const result = (amount * conversionRate).toFixed(2);
        resultDisplay.textContent = `Converted Amount: ${result} ${toCurrency}`;
    }
    else {
        resultDisplay.textContent = 'Currency not found.';
    }
}
// Add reverse functionality to switch "From" and "To" currencies
function reverseCurrencies() {
    const tempCurrency = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempCurrency;
}
convertButton.addEventListener('click', convertCurrency);
reverseButton.addEventListener('click', reverseCurrencies);
// Initialize
fetchExchangeRates();
