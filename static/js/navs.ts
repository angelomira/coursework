export { }

document.addEventListener('DOMContentLoaded', () => {
    const MENU_BUTTON = document.getElementById('menu') as HTMLButtonElement;

    if (MENU_BUTTON) {
        MENU_BUTTON.addEventListener('click', async () => {
            var dropdown = document.getElementById('dropdown') as HTMLDivElement;

            if (dropdown.style.display === 'block')
                dropdown.style.display = 'none';
            else
                dropdown.style.display = 'block';
        });
    }
});