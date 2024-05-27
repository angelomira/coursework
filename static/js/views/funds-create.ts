// fundCreate.ts
export {};

interface User {
    id: string;
    name_forename: string;
    name_cognomen: string;
    name_patronim: string;
    email: string;
    phone: string;
    id_role: string;
    passp: string;
    login: string;
}

interface Currency {
    numb_code: string;
    symb_code: string;
    amount: number;
    volume: string;
    ratio: number;
}

interface FundData {
    id_user: string;
    curr_naming: string;
    curr_volume: number;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch user data from localStorage or wherever it's stored
    let user = getUserData(); // This function should retrieve the user data

    const BASE_URL = 'http://localhost:3000/';

    // Fetch currencies
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '.'); // Adjust the date format if necessary
    try {
        const response = await fetch(`${BASE_URL}api/currencies/${date}`);
        if (!response.ok) throw new Error('Error retrieving currencies from API.');

        const currencies: Currency[] = await response.json();
        populateCurrencySelectBox(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error);
    }

    const form = document.getElementById('fundCreateForm') as HTMLFormElement;

    const statusShown = document.getElementById('status-shown') as HTMLParagraphElement;

    const confirmationMenu = document.getElementById('payment-simulation') as HTMLDivElement;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        confirmationMenu.style.display = 'block';
    })

    const confirmCreateFundButton = document.getElementById('confirm-create-fund') as HTMLButtonElement;

    confirmCreateFundButton.addEventListener('click', async () => {
        const curr_naming = (document.getElementById('curr_naming') as HTMLSelectElement).value;
        const curr_volume = parseFloat((document.getElementById('curr_volume') as HTMLInputElement).value);

        const data: FundData = {
            id_user: user.id,
            curr_naming: curr_naming,
            curr_volume: curr_volume,
        };

        try {
            const response = await fetch(BASE_URL + 'funds/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Fund created successfully:', result);

                statusShown.style.color = 'green';
                statusShown.innerText = 'Фонд успешно создан';
            } else {
                const error = await response.json();
                console.error('Error creating fund:', error);

                statusShown.style.color = 'red';
                statusShown.innerText = 'Ошибка при создании фонда, попробуйте заново или позже.';
            }

            setTimeout(() => {
                statusShown.style.color = 'white';
                statusShown.textContent = '';
            }, 15000);
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Ошибка при отправке запроса.');
        }

        confirmationMenu.style.display = 'none';
    });

    function populateCurrencySelectBox(currencies: Currency[]) {
        const selectBox = document.getElementById('curr_naming') as HTMLSelectElement;
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency.symb_code;
            option.text = `${currency.symb_code} - ${currency.volume}`;
            selectBox.appendChild(option);
        });
    }

    function getUserData() {
        // Implement logic to retrieve user data from localStorage or wherever it's stored
        return JSON.parse(localStorage.getItem('user') || '{}');
    }
});
