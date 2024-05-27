document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/';
    const user_id = localStorage.getItem('userq'); // Get user ID from localStorage

    // Fetch currencies
    const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '.'); // Adjust the date format if necessary
    try {
        const response = await fetch(`${BASE_URL}api/currencies/${date}`);
        if (!response.ok) throw new Error(`Error retrieving currencies from API: ${await response.json()}::${await response.status}`);

        const currencies = await response.json();
        populateCurrencySelectBox(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error);
    }

    function populateCurrencySelectBox(currencies: any) {
        const fromCurrencySelect = document.getElementById('from-currency') as HTMLSelectElement;
        const toCurrencySelect = document.getElementById('to-currency') as HTMLSelectElement;

        currencies.forEach((currency: any) => {
            const option1 = document.createElement('option');
            option1.value = currency.symb_code;
            option1.textContent = `${currency.symb_code} - ${currency.volume}`;
            fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency.symb_code;
            option2.textContent = `${currency.symb_code} - ${currency.volume}`;
            toCurrencySelect.appendChild(option2);
        });
    }

    // Handle form submission
    document.getElementById('exchange-form')!.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get values from form fields
        const fromCurrency = (document.getElementById('from-currency') as HTMLSelectElement).value;
        const toCurrency = (document.getElementById('to-currency') as HTMLSelectElement).value;
        const amount = (document.getElementById('amount') as HTMLInputElement).value;
        const user_id = JSON.parse(localStorage.getItem('userq')!)['id'];

        // Make the exchange request
        try {
            const response = await fetch(`${BASE_URL}api/exchange`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: Number(user_id),
                    currency_to: toCurrency,
                    currency_from: fromCurrency,
                    origin_amount: Number(amount)
                }),
            });

            if (!response.ok) throw new Error(`Error retrieving currencies from API: ${await response.json()}::${await response.status}`);
            
            document.getElementById('exchange-status')!.textContent = 'Успех!';
        } catch (error) {
            console.error('Error exchanging currencies:', error);
            document.getElementById('exchange-status')!.textContent = `Ошибка при обмене: ${error}`;
        }
    });
});
