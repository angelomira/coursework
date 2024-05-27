export { }

document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'http://localhost:3000/';

    const LOGIN_FORM = document.getElementById('form.auth') as HTMLFormElement;

    if (LOGIN_FORM)
        LOGIN_FORM.addEventListener('submit', async (event) => {
            /** Prevent acting as default event. */
            event.preventDefault();

            const INPUT_LOGIN = document.getElementById('auth.login') as HTMLInputElement;
            const INPUT_PASSW = document.getElementById('auth.passw') as HTMLInputElement;

            try {
                const response = await fetch(BASE_URL + `api/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            'login':
                                INPUT_LOGIN.value,
                            'passw':
                                INPUT_PASSW.value
                        }
                    ),
                });

                if (!response.ok) throw new Error('Error retrieving data to API.');

                const user = await response.json();

                if(!localStorage.getItem('session'))
                    localStorage.setItem('session', user['session']);
                else
                    localStorage.setItem('session', user['session']);

                if(!localStorage.getItem('user'))
                    localStorage.setItem('user', JSON.stringify(user));
                else
                    localStorage.setItem('user', JSON.stringify(user));

                window.location.href = '/pages/main.html';
            } catch (error: unknown) {
                console.error('Error via requesting data from API:', error);

                const ERROR_PARAGRAPH = document.getElementById('auth.error') as HTMLLabelElement;

                ERROR_PARAGRAPH.textContent = 'Неправильный логин или пароль.';
                ERROR_PARAGRAPH.style.color = 'red';

                setTimeout(async () => {
                    ERROR_PARAGRAPH.textContent = '';
                    ERROR_PARAGRAPH.style.color = 'white';
                }, 15000);
            }
        });

    const DEAUTH_BUTTON = document.getElementById('deauth') as HTMLButtonElement;

    if (DEAUTH_BUTTON)
        DEAUTH_BUTTON.addEventListener('click', async () => {
            try {
                const response = await fetch(BASE_URL + `sessions/deauth/${localStorage.getItem('session')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Error retrieving data to API.');

                if (!localStorage.getItem('auth'))
                    console.error('Tried to deauth already deauthed user.')
                else
                    localStorage.removeItem('auth');

                if (!localStorage.getItem('session'))
                    console.error('Tried to deauth already deauthed user.')
                else
                    localStorage.removeItem('session');

                window.location.href = '/index.html';
            } catch (error: any) {
                console.error('Error via deauth procedure:', error);
            }
        });
})