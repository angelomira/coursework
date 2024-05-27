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
Object.defineProperty(exports, "__esModule", { value: true });
// Placeholder arrays for checks and funds
let _CHECKS = [];
let _FUNDS = []; // Define a proper interface for funds data
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve userq item from localStorage
    const userq = localStorage.getItem('userq');
    if (!userq) {
        console.error('No userq item found in localStorage.');
        return;
    }
    // Parse the JSON to get the user data
    const user = JSON.parse(userq);
    // Extract the id from the user data
    const userId = user.id;
    // Function to fetch and populate checks data
    function fetchAndPopulateChecksData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Send API request to get checks data
                const checksResponse = yield fetch(`http://localhost:3000/api/checks/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!checksResponse.ok) {
                    throw new Error(`API request failed with status ${checksResponse.status}`);
                }
                _CHECKS = yield checksResponse.json();
                // Populate the checks table with data
                populateDataTable(_CHECKS);
            }
            catch (error) {
                console.error('Failed to fetch checks data:', error);
            }
        });
    }
    // Function to fetch and populate funds data
    function fetchAndPopulateFundsData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Send API request to get funds data
                const fundsResponse = yield fetch('http://localhost:3000/funds/get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_user: userId }),
                });
                if (!fundsResponse.ok) {
                    throw new Error(`API request failed with status ${fundsResponse.status}`);
                }
                _FUNDS = yield fundsResponse.json();
                // Populate the funds table with data
                populateDataTable(_FUNDS);
            }
            catch (error) {
                console.error('Failed to fetch funds data:', error);
            }
        });
    }
    // Function to populate the data table with checks or funds data
    function populateDataTable(data) {
        const dataTableBody = document.querySelector('#data-table tbody');
        const dataTableHeader = document.querySelector('#data-table thead tr');
        if (!dataTableBody || !dataTableHeader) {
            console.error('Data table body or header not found.');
            return;
        }
        // Clear existing rows and headers
        dataTableBody.innerHTML = '';
        dataTableHeader.innerHTML = '';
        // If there's no data, return
        if (data.length === 0) {
            console.warn('No data to populate the table.');
            return;
        }
        // Create table headers based on the first data object
        const firstDataItem = data[0];
        for (const prop in firstDataItem) {
            const th = document.createElement('th');
            switch (prop) {
                case 'id':
                    th.textContent = 'ID:';
                    break;
                case 'id_operation':
                    th.textContent = 'ID транзакции:';
                    break;
                case 'checkbook_date':
                    th.textContent = 'Дата чека:';
                    break;
                case 'is_dup':
                    th.textContent = 'Склонирован:';
                    break;
                case 'is_gen':
                    th.textContent = 'Сгенерирован:';
                    break;
                case 'operabook_id':
                    continue;
                case 'id_user':
                    th.textContent = 'ID пользователя:';
                    break;
                case 'amount':
                    th.textContent = 'Объём:';
                    break;
                case 'status':
                    th.textContent = 'Статус:';
                    break;
                case 'curr':
                    th.textContent = 'Валюта:';
                    break;
                case 'curr_sum':
                    th.textContent = 'Объём:';
                    break;
                case 'operabook_date':
                    th.textContent = 'Дата транзакции:';
                    break;
                case 'curr_naming':
                    th.textContent = 'Код валюты:';
                    break;
                case 'curr_volume':
                    th.textContent = 'Объём валюты:';
                    break;
            }
            dataTableHeader.appendChild(th);
        }
        // Add a header for the download button
        const th = document.createElement('th');
        th.textContent = 'Реквизиты';
        dataTableHeader.appendChild(th);
        // Populate the table with data
        data.forEach((item) => {
            const row = document.createElement('tr');
            // Add columns for each data property
            for (const prop in item) {
                const cell = document.createElement('td');
                if (prop === 'operabook_id')
                    continue;
                else {
                    if (item[prop] === null || item[prop] === undefined)
                        cell.textContent = 'Пусто';
                    else if (item[prop] === true || item[prop] === false)
                        cell.textContent = item[prop] ? 'Да' : 'Нет';
                    else
                        cell.textContent = String(item[prop]);
                }
                row.appendChild(cell);
            }
            // Add the download button
            const downloadCell = document.createElement('td');
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '...';
            downloadButton.style.height = '100%';
            downloadButton.addEventListener('click', () => {
                downloadItemAsCsv(item);
            });
            downloadCell.appendChild(downloadButton);
            row.appendChild(downloadCell);
            dataTableBody.appendChild(row);
        });
    }
    // Fetch and populate checks data when the DOM content is loaded
    yield fetchAndPopulateChecksData();
    // Event listener for table mode change
    const tableModeSelect = document.getElementById('table-mode');
    tableModeSelect.addEventListener('change', () => __awaiter(void 0, void 0, void 0, function* () {
        const selectedMode = tableModeSelect.value;
        if (selectedMode === 'checks') {
            yield fetchAndPopulateChecksData();
        }
        else if (selectedMode === 'funds') {
            yield fetchAndPopulateFundsData();
        }
    }));
    // Event listener for download button
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn === null || downloadBtn === void 0 ? void 0 : downloadBtn.addEventListener('click', () => {
        const dataToDownload = tableModeSelect.value === 'checks' ? _CHECKS : _FUNDS;
        downloadDataAsCsv(dataToDownload);
    });
}));
// Function to download data as CSV file
function downloadDataAsCsv(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
// Function to download a single item as CSV file
function downloadItemAsCsv(item) {
    const headers = Object.keys(item);
    const csvRows = [
        headers.join(','),
        headers.map(header => `"${('' + item[header]).replace(/"/g, '\\"')}"`).join(',')
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `item_${item.id}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
