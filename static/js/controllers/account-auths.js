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
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000/';
    const LOGIN_FORM = document.getElementById('form.auth');
    if (LOGIN_FORM)
        LOGIN_FORM.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
            /** Prevent acting as default event. */
            event.preventDefault();
            const INPUT_LOGIN = document.getElementById('auth.login');
            const INPUT_PASSW = document.getElementById('auth.passw');
            try {
                const response = yield fetch(BASE_URL + `api/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'login': INPUT_LOGIN.value,
                        'passw': INPUT_PASSW.value
                    }),
                });
                if (!response.ok)
                    throw new Error('Error retrieving data to API.');
                const user = yield response.json();
                if (!localStorage.getItem('session'))
                    localStorage.setItem('session', user['session']);
                else
                    localStorage.setItem('session', user['session']);
                if (!localStorage.getItem('user'))
                    localStorage.setItem('user', JSON.stringify(user));
                else
                    localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/pages/main.html';
            }
            catch (error) {
                console.error('Error via requesting data from API:', error);
                const ERROR_PARAGRAPH = document.getElementById('auth.error');
                ERROR_PARAGRAPH.textContent = 'Неправильный логин или пароль.';
                ERROR_PARAGRAPH.style.color = 'red';
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    ERROR_PARAGRAPH.textContent = '';
                    ERROR_PARAGRAPH.style.color = 'white';
                }), 15000);
            }
        }));
    const DEAUTH_BUTTON = document.getElementById('deauth');
    if (DEAUTH_BUTTON)
        DEAUTH_BUTTON.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch(BASE_URL + `sessions/deauth/${localStorage.getItem('session')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok)
                    throw new Error('Error retrieving data to API.');
                if (!localStorage.getItem('auth'))
                    console.error('Tried to deauth already deauthed user.');
                else
                    localStorage.removeItem('auth');
                if (!localStorage.getItem('session'))
                    console.error('Tried to deauth already deauthed user.');
                else
                    localStorage.removeItem('session');
                window.location.href = '/index.html';
            }
            catch (error) {
                console.error('Error via deauth procedure:', error);
            }
        }));
});
