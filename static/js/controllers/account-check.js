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
    const BASE_URL = 'http://localhost:3000/';
    var user_authkey = localStorage.getItem('session');
    if (!user_authkey) {
        if (!INDEX())
            window.location.href = '/index.html';
        return;
    }
    try {
        const response = yield fetch(BASE_URL + `sessions/${user_authkey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok)
            throw new Error('Error retrieving data from API.');
        const data = yield response.json();
        if (data['res']) {
            if (INDEX()) {
                window.location.href = '/pages/main.html';
            }
        }
        else if (!INDEX())
            window.location.href = '/index.html';
    }
    catch (error) {
        console.error(error);
        if (!INDEX())
            window.location.href = '/index.html';
    }
}));
function INDEX() {
    return document.location.pathname === '/index.html';
}
