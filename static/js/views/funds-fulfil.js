"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const depositForm = document.getElementById('deposit-form');
    const paymentSimulation = document.getElementById('payment-simulation');
    const confirmPaymentButton = document.getElementById('confirm-payment');
    let fundId;
    let amount;
    const statusShown = document.getElementById('status-shown');
    depositForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const fundIdInput = depositForm.elements.namedItem('fund-id');
        const amountInput = depositForm.elements.namedItem('amount');
        fundId = fundIdInput.value.trim();
        amount = parseFloat(amountInput.value);
        if (!fundId || isNaN(amount)) {
            return;
        }
        try {
            // Simulate payment process
            paymentSimulation.style.display = 'block';
        }
        catch (error) {
            console.error(error);
            statusShown.style.color = 'red';
            statusShown.innerText = 'Ошибка при пополнении фонда, попробуйте заново или позже.';
        }
    }));
    confirmPaymentButton.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch('/funds/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: fundId, amount: amount }),
            });
            if (!response.ok) {
                throw new Error('Ошибка при выполнении запроса.');
            }
            const data = yield response.json();
            statusShown.style.color = 'green';
            statusShown.innerText = 'Фондовые хранилища успешно обновлены.';
        }
        catch (error) {
            console.error(error);
            statusShown.style.color = 'red';
            statusShown.innerText = 'Ошибка при пополнении фонда, попробуйте заново или позже.';
        }
        finally {
            // Hide payment simulation menu after payment is confirmed
            paymentSimulation.style.display = 'none';
        }
    }));
});
