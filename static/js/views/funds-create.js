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
Object.defineProperty(exports, "__esModule", { value: true });
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch user data from localStorage or wherever it's stored
    let user = getUserData(); // This function should retrieve the user data
    const BASE_URL = 'http://localhost:3000/';
    // Fetch currencies
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '.'); // Adjust the date format if necessary
    try {
        const response = yield fetch(`${BASE_URL}api/currencies/${date}`);
        if (!response.ok)
            throw new Error('Error retrieving currencies from API.');
        const currencies = yield response.json();
        populateCurrencySelectBox(currencies);
    }
    catch (error) {
        console.error('Error fetching currencies:', error);
    }
    const form = document.getElementById('fundCreateForm');
    const statusShown = document.getElementById('status-shown');
    const confirmationMenu = document.getElementById('payment-simulation');
    form.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        confirmationMenu.style.display = 'block';
    }));
    const confirmCreateFundButton = document.getElementById('confirm-create-fund');
    confirmCreateFundButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const curr_naming = document.getElementById('curr_naming').value;
        const curr_volume = parseFloat(document.getElementById('curr_volume').value);
        const data = {
            id_user: user.id,
            curr_naming: curr_naming,
            curr_volume: curr_volume,
        };
        try {
            const response = yield fetch(BASE_URL + 'funds/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const result = yield response.json();
                console.log('Fund created successfully:', result);
                statusShown.style.color = 'green';
                statusShown.innerText = 'Фонд успешно создан';
            }
            else {
                const error = yield response.json();
                console.error('Error creating fund:', error);
                statusShown.style.color = 'red';
                statusShown.innerText = 'Ошибка при создании фонда, попробуйте заново или позже.';
            }
            setTimeout(() => {
                statusShown.style.color = 'white';
                statusShown.textContent = '';
            }, 15000);
        }
        catch (error) {
            console.error('Fetch error:', error);
            alert('Ошибка при отправке запроса.');
        }
        confirmationMenu.style.display = 'none';
    }));
    function populateCurrencySelectBox(currencies) {
        const selectBox = document.getElementById('curr_naming');
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.symb_code;
            option.text = `${currency.symb_code} - ${currency.volume}`;
            selectBox.appendChild(option);
        });
    }
    function getUserData() {
        // Implement logic to retrieve user data from localStorage or wherever it's stored
        return JSON.parse(localStorage.getItem('user') || '{}');
    }
}));
