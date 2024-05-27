document.addEventListener('DOMContentLoaded', () => {
    const depositForm = document.getElementById('deposit-form') as HTMLFormElement;
    const paymentSimulation = document.getElementById('payment-simulation') as HTMLDivElement;
    const confirmPaymentButton = document.getElementById('confirm-payment') as HTMLButtonElement;

    let fundId: string;
    let amount: number;

    const statusShown = document.getElementById('status-shown') as HTMLParagraphElement;

    depositForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fundIdInput = depositForm.elements.namedItem('fund-id') as HTMLInputElement;
        const amountInput = depositForm.elements.namedItem('amount') as HTMLInputElement;

        fundId = fundIdInput.value.trim();
        amount = parseFloat(amountInput.value);

        if (!fundId || isNaN(amount)) {
            return;
        }

        try {
            // Simulate payment process
            paymentSimulation.style.display = 'block';
        } catch (error) {
            console.error(error);
            statusShown.style.color = 'red';
            statusShown.innerText = 'Ошибка при пополнении фонда, попробуйте заново или позже.';
        }
    });

    confirmPaymentButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/funds/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: fundId, amount: amount }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при выполнении запроса.');
            }

            const data = await response.json();

            statusShown.style.color = 'green';
            statusShown.innerText = 'Фондовые хранилища успешно обновлены.';
        } catch (error) {
            console.error(error);
            statusShown.style.color = 'red';
            statusShown.innerText = 'Ошибка при пополнении фонда, попробуйте заново или позже.';
        } finally {
            // Hide payment simulation menu after payment is confirmed
            paymentSimulation.style.display = 'none';
        }
    });
});
