export { }

document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/';

    var user_authkey = localStorage.getItem('session');

    if(!user_authkey) {
        if(!INDEX())
            window.location.href = '/index.html';

        return;
    }

    try {
        const response = await fetch(BASE_URL + `sessions/${user_authkey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(!response.ok) throw new Error('Error retrieving data from API.');

        const data = await response.json();

        if(data['res']) {
            if(INDEX()) {
                window.location.href = '/pages/main.html';
            }
        } else
            if(!INDEX())
                window.location.href = '/index.html';
    } catch (error:  unknown) {
        console.error(error);

        if (!INDEX())
            window.location.href = '/index.html';
    }
});

function INDEX() {
    return document.location.pathname === '/index.html' || document.location.pathname === '/';
}