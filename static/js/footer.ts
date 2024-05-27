export { }

document.addEventListener('DOMContentLoaded', () => {
    const TIMER_PARAGRAPH = document.getElementById('timer') as HTMLParagraphElement;

    TIMER_PARAGRAPH.textContent = new Date().toUTCString();

    setInterval(() => {
        TIMER_PARAGRAPH.textContent = new Date().toUTCString();
    }, 1000);
})