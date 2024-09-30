const amountInput = document.getElementById('amount') as HTMLInputElement;
const fromCurrencySelect = document.getElementById('fromCurrency') as HTMLSelectElement;
const toCurrencySelect = document.getElementById('toCurrency') as HTMLSelectElement;
const convertButton = document.getElementById('convertButton') as HTMLButtonElement;
const reverseButton = document.getElementById('reverseButton') as HTMLButtonElement;
const resultDisplay = document.getElementById('result') as HTMLHeadingElement;

const apiUrl = 'https://openexchangerates.org/api/latest.json?app_id=b5443b0afee145bd95f19b0582301b60'; 
interface ExchangeRatesResponse {
    disclaimer: string;
    license: string;
    timestamp: number;
    base: string;
    rates: {
        [key: string]: number;
    };
}

let exchangeRates: { [key: string]: number } = {};

async function fetchExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const data: ExchangeRatesResponse = await response.json();

        if (data && data.rates) {
            exchangeRates = data.rates;
            populateCurrencyOptions(Object.keys(exchangeRates));
        } else {
            console.error('Invalid API response:', data);
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

function populateCurrencyOptions(currencies: string[]) {
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
    } else {
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
