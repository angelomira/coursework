document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/';

    const userq = localStorage.getItem('userq');

    if(!userq)
        window.location.href = '/pages/menu-users-array.html';

    try {
        const userq_json = JSON.parse(userq!);

        const response = await fetch(BASE_URL + 'funds/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    'id_user': userq_json.id
                })
        });

        const data = await response.json();

        console.log(data);
    } catch(error: unknown) {
        console.error(error);
    }
});