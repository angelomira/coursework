document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/';

    if(localStorage.getItem('userq') !== null) {
        window.location.href = localStorage.getItem('credentials-reroute')!;

        return;
    }

    const CREDENTIALS_FORM = document.getElementById('credentials.form') as HTMLFormElement;
    const CREDENTIALS_INPT = document.getElementById('credentials.inpt') as HTMLInputElement;

    CREDENTIALS_FORM.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(BASE_URL + 'api/user', {
                method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'id': CREDENTIALS_INPT.value
                    })
            });

            if(!response.ok)
                throw new Error('There is problems within getting credentials about data.');

            const user = await response.json();

            localStorage.setItem('userq', JSON.stringify(user));

            window.location.href = localStorage.getItem('credentials-reroute')!;
        } catch(error: unknown) {
            console.error(error);

            const ERROR_PARAGRAPH = document.getElementById('auth.error') as HTMLLabelElement;

            ERROR_PARAGRAPH.textContent = 'Неправильные данные пользователя или другая ошибка.';
            ERROR_PARAGRAPH.style.color = 'red';

            setTimeout(async () => {
                ERROR_PARAGRAPH.textContent = '';
                ERROR_PARAGRAPH.style.color = 'white';
            }, 15000);
        }
    })
})