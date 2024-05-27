export { }

document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/';

    const user = localStorage.getItem('user');

    if(!user)
        await reroute();
    else {
        try {
            const user_json = JSON.parse(user);

            const response = await fetch(BASE_URL + `api/auth/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'login': 
                    user_json['login'],
                    'passp': 
                    user_json['passp'],

                    'paging': window.location.pathname
                })
            });
    
            if(!response.ok) throw new Error('Error retrieving data from API.');
            
            if([403, 404, 500].includes(response.status)) {
                throw new Error('Error retrieving access a data.');
            }
        } catch(error: any) {
            console.error('Error via checking authorization access:', error);

            await reroute();
        }
    }
});

async function reroute() {
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
            },
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
}

function INDEX() {
    return document.location.pathname === '/index.html';
}