export { }

document.addEventListener('DOMContentLoaded', async () => {
    // Retrieve userq item from localStorage
    const userq = localStorage.getItem('userq');
    if (!userq) {
        console.error('No userq item found in localStorage.');
        return;
    }

    // Parse the JSON to get the id field
    let userId: string;
    try {
        const user = JSON.parse(userq);
        userId = user.id;
    } catch (error) {
        console.error('Failed to parse userq from localStorage:', error);
        return;
    }

    // Send API request to get user data
    try {
        const userResponse = await fetch('http://localhost:3000/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId }),
        });

        if (!userResponse.ok) {
            throw new Error(`API request failed with status ${userResponse.status}`);
        }

        const userData = await userResponse.json();

        // Send API request to get role data
        const roleResponse = await fetch('http://localhost:3000/role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_role: userData.id_role }),
        });

        if (!roleResponse.ok) {
            throw new Error(`Role API request failed with status ${roleResponse.status}`);
        }

        const roleData = await roleResponse.json();

        // Fill in the user data in the HTML
        const userFields = [
            { label: 'ID:', value: userData.id },
            { label: 'Имя:', value: userData.name_forename },
            { label: 'Фамилия:', value: userData.name_cognomen },
            { label: 'Отчество:', value: userData.name_patronim },
            { label: 'Email:', value: userData.email },
            { label: 'Телефон:', value: userData.phone },
            { label: 'ID роли:', value: userData.id_role },
            { label: 'Паспорт:', value: userData.passp },
            { label: 'Логин:', value: userData.login },
        ];

        const roleFields = [
            { label: 'ID роли:', value: roleData.id },
            { label: 'Доступ:', value: roleData.access },
            { label: 'Наименование:', value: roleData.naming },
        ];

        const accountInfoElement = document.getElementById('account.info')!;
        const accountInfoHeaders = document.createElement('h3');
        if (accountInfoElement) {
            accountInfoHeaders.textContent = 'Аккаунт:';
            accountInfoHeaders.classList.add('account-header');
            accountInfoElement.appendChild(accountInfoHeaders);
            userFields.forEach(({ label, value }) => {
                const labelElement = document.createElement('p');
                labelElement.className = 'panel-label';
                labelElement.innerHTML = label;

                const valueElement = document.createElement('p');
                valueElement.className = 'panel-signal';
                valueElement.innerHTML = value;

                accountInfoElement.appendChild(labelElement);
                accountInfoElement.appendChild(valueElement);
            });
        } else {
            console.error('account.info element not found in the document.');
        }

        const roleInfoElement = document.createElement('div');
        const roleInfoHeaders = document.createElement('h3');
        roleInfoHeaders.textContent = 'Роль:';
        roleInfoHeaders.classList.add('account-header');
        roleInfoElement.appendChild(roleInfoHeaders);
        roleInfoElement.classList.add('card');
        roleFields.forEach(({ label, value }) => {
            const labelElement = document.createElement('p');
            labelElement.className = 'panel-label';
            labelElement.innerHTML = label;

            const valueElement = document.createElement('p');
            valueElement.className = 'panel-signal';
            valueElement.innerHTML = value;

            roleInfoElement.appendChild(labelElement);
            roleInfoElement.appendChild(valueElement);
        });

        if (accountInfoElement) {
            accountInfoElement.appendChild(roleInfoElement);
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }

    const FUND_CREATE = document.getElementById('fund.create') as HTMLButtonElement;
    const FUND_FULFIL = document.getElementById('fund.fulfil') as HTMLButtonElement;
    const FUND_EXCHANGE = document.getElementById('fund.exchange') as HTMLButtonElement;

    FUND_CREATE?.addEventListener('click', async (event) => {
        localStorage.setItem('credentials-reroute', '/pages/funds/create.html');

        window.location.href = '/pages/forms/credentials.html';
    });

    FUND_FULFIL?.addEventListener('click', async (event) => {
        localStorage.setItem('credentials-reroute', '/pages/funds/fulfil.html');

        window.location.href = '/pages/forms/credentials.html';
    });

    FUND_EXCHANGE?.addEventListener('click', async (event) => {
        localStorage.setItem('credentials-reroute', '/pages/funds/exchange.html');

        window.location.href = '/pages/forms/credentials.html';
    });
});
