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
    if (localStorage.getItem('userq') !== null) {
        window.location.href = localStorage.getItem('credentials-reroute');
        return;
    }
    const CREDENTIALS_FORM = document.getElementById('credentials.form');
    const CREDENTIALS_INPT = document.getElementById('credentials.inpt');
    CREDENTIALS_FORM.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        try {
            const response = yield fetch(BASE_URL + 'api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'id': CREDENTIALS_INPT.value
                })
            });
            if (!response.ok)
                throw new Error('There is problems within getting credentials about data.');
            const user = yield response.json();
            localStorage.setItem('userq', JSON.stringify(user));
            window.location.href = localStorage.getItem('credentials-reroute');
        }
        catch (error) {
            console.error(error);
            const ERROR_PARAGRAPH = document.getElementById('auth.error');
            ERROR_PARAGRAPH.textContent = 'Неправильные данные пользователя или другая ошибка.';
            ERROR_PARAGRAPH.style.color = 'red';
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                ERROR_PARAGRAPH.textContent = '';
                ERROR_PARAGRAPH.style.color = 'white';
            }), 15000);
        }
    }));
}));
