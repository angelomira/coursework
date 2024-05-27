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
const BASE_URL0 = 'http://localhost:3000/';
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    var user = localStorage.getItem('user');
    if (!user)
        yield __reroute();
    else {
        try {
            const user_json = JSON.parse(user);
            const response = yield fetch(BASE_URL0 + 'roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_role: user_json['id_role']
                })
            });
            if (!response.ok)
                throw new Error('Error retrieving data to API.');
            const data = yield response.json();
            const role = data;
            var ROLE_SELECT = document.getElementById('role');
            for (const assignee of role) {
                console.log(assignee);
                if (assignee.id < user_json['id_role']) {
                    var option = document.createElement('option');
                    option.value = assignee.id;
                    option.textContent = `${assignee.id} - ${assignee.naming}`;
                    ROLE_SELECT.appendChild(option);
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    const REG_FORM = document.getElementById('reg.form');
    REG_FORM.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const INPUT_LASTNAME = document.getElementById('lastname');
        const INPUT_FIRSTNAME = document.getElementById('firstname');
        const INPUT_MIDDLENAME = document.getElementById('middlename');
        const INPUT_EMAIL = document.getElementById('email');
        const INPUT_PHONE = document.getElementById('phone');
        const INPUT_PASSPORT = document.getElementById('passport');
        const INPUT_LOGIN = document.getElementById('login');
        const INPUT_PASSWORD = document.getElementById('password');
        const SELECT_ROLE = document.getElementById('role');
        const role = SELECT_ROLE.value;
        const response = yield fetch(BASE_URL0 + 'api/registry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'patronim': INPUT_MIDDLENAME.value,
                'forename': INPUT_FIRSTNAME.value,
                'cognomen': INPUT_LASTNAME.value,
                'id_role': role,
                'email': INPUT_EMAIL.value,
                'passp': INPUT_PASSPORT.value,
                'phone': INPUT_PHONE.value,
                'login': INPUT_LOGIN.value,
                'passw': INPUT_PASSWORD.value
            })
        });
        const statusDiv = document.getElementById('result');
        REG_FORM.reset();
        if (!response.ok) {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Провал.';
        }
        else {
            statusDiv.style.color = 'green';
            statusDiv.textContent = 'Успех.';
        }
    }));
}));
function __reroute() {
    return __awaiter(this, void 0, void 0, function* () {
        var user_authkey = localStorage.getItem('session');
        if (!user_authkey) {
            if (!INDEX())
                window.location.href = '/index.html';
            return;
        }
        try {
            const response = yield fetch(BASE_URL0 + `sessions/${user_authkey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok)
                throw new Error('Error retrieving data from API.');
            const data = yield response.json();
            if (data['res']) {
                if (!MAIN() &&
                    !USER() &&
                    !FUND() &&
                    !REG() &&
                    !ACC()) {
                    console.log('Is auth-session:', data);
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
function MAIN() {
    return document.location.pathname === '/pages/main.html';
}
function FUND() {
    return document.location.pathname === '/pages/menu-fund-create.html';
}
function USER() {
    return document.location.pathname === '/pages/menu-users-array.html';
}
function REG() {
    return document.location.pathname === '/pages/menu-users-registry.html';
}
function ACC() {
    return document.location.pathname === '/pages/account.html';
}
