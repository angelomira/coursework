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
    const MENU_BUTTON = document.getElementById('menu');
    if (MENU_BUTTON) {
        MENU_BUTTON.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            var dropdown = document.getElementById('dropdown');
            if (dropdown.style.display === 'block')
                dropdown.style.display = 'none';
            else
                dropdown.style.display = 'block';
        }));
    }
});
