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
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const BASE_URL = 'http://localhost:3000/';
    const user_id = localStorage.getItem('userq'); // Get user ID from localStorage
    // Fetch currencies
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '.'); // Adjust the date format if necessary
    try {
        const response = yield fetch(`${BASE_URL}api/currencies/${date}`);
        if (!response.ok)
            throw new Error(`Error retrieving currencies from API: ${yield response.json()}::${yield response.status}`);
        const currencies = yield response.json();
        populateCurrencySelectBox(currencies);
    }
    catch (error) {
        console.error('Error fetching currencies:', error);
    }
    function populateCurrencySelectBox(currencies) {
        const fromCurrencySelect = document.getElementById('from-currency');
        const toCurrencySelect = document.getElementById('to-currency');
        currencies.forEach((currency) => {
            const option1 = document.createElement('option');
            option1.value = currency.symb_code;
            option1.textContent = `${currency.symb_code} - ${currency.volume}`;
            fromCurrencySelect.appendChild(option1);
            const option2 = document.createElement('option');
            option2.value = currency.symb_code;
            option2.textContent = `${currency.symb_code} - ${currency.volume}`;
            toCurrencySelect.appendChild(option2);
        });
    }
    // Handle form submission
    document.getElementById('exchange-form').addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        // Get values from form fields
        const fromCurrency = document.getElementById('from-currency').value;
        const toCurrency = document.getElementById('to-currency').value;
        const amount = document.getElementById('amount').value;
        const user_id = JSON.parse(localStorage.getItem('userq'))['id'];
        // Make the exchange request
        try {
            const response = yield fetch(`${BASE_URL}api/exchange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: Number(user_id),
                    currency_to: toCurrency,
                    currency_from: fromCurrency,
                    origin_amount: Number(amount)
                }),
            });
            if (!response.ok)
                throw new Error(`Error retrieving currencies from API: ${yield response.json()}::${yield response.status}`);
            const result = yield response.json();
            document.getElementById('exchange-status').textContent = 'Exchange successful';
        }
        catch (error) {
            console.error('Error exchanging currencies:', error);
            document.getElementById('exchange-status').textContent = `Exchange failed: ${error}`;
        }
    }));
}));
