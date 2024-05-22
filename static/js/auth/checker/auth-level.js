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
    const user = localStorage.getItem('user');
    if (!user)
        yield reroute();
    else {
        try {
            const user_json = JSON.parse(user);
            const response = yield fetch(BASE_URL + `api/auth/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'login': user_json['login'],
                    'passp': user_json['passp'],
                    'paging': window.location.pathname
                })
            });
            if (!response.ok)
                throw new Error('Error retrieving data from API.');
            if ([403, 404, 500].includes(response.status)) {
                throw new Error('Error retrieving access a data.');
            }
        }
        catch (error) {
            console.error('Error via checking authorization access:', error);
            yield reroute();
        }
    }
}));
function reroute() {
    return __awaiter(this, void 0, void 0, function* () {
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
                },
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
    });
}
function INDEX() {
    return document.location.pathname === '/index.html';
}
