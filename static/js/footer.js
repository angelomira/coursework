"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
document.addEventListener('DOMContentLoaded', () => {
    const TIMER_PARAGRAPH = document.getElementById('timer');
    TIMER_PARAGRAPH.textContent = new Date().toUTCString();
    setInterval(() => {
        TIMER_PARAGRAPH.textContent = new Date().toUTCString();
    }, 1000);
});
