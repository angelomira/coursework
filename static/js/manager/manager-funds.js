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
    const userq = localStorage.getItem('userq');
    if (!userq)
        window.location.href = '/pages/menu-users-array.html';
    try {
        const userq_json = JSON.parse(userq);
        const response = yield fetch(BASE_URL + 'funds/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'id_user': userq_json.id
            })
        });
        const data = yield response.json();
        console.log(data);
    }
    catch (error) {
        console.error(error);
    }
}));
