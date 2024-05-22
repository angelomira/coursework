export { }

document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = 'http://localhost:3000/';

    const SELECT_CURR1 = document.getElementById('select.curr1') as HTMLSelectElement;
    const SELECT_CURR2 = document.getElementById('select.curr2') as HTMLSelectElement;

    const INPUT_DATE = document.getElementById('input.date') as HTMLInputElement;

    INPUT_DATE.value = convert_datetime('inputbx', '');
    INPUT_DATE.max   = convert_datetime('inputbx', '');

    try {
        var datetime;

        if(!INPUT_DATE)
            datetime = convert_datetime('request', '');
        else
            datetime = convert_datetime('request', INPUT_DATE.value);

        const response = await fetch(BASE_URL + `api/currencies/${datetime}`, 
        {
            method: 
                'GET',
            mode: 
                'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Error retrieving data from API.');

        const currencies = await response.json();

        for(const curr of currencies) {
            const item = document.createElement('option');

            item.text
                = curr['symb_code'];
            item.value 
                = curr['symb_code'];
            SELECT_CURR1?.add(item);
        }

        for(const curr of currencies) {
            const item = document.createElement('option');

            item.text
                = curr['symb_code'];
            item.value 
                = curr['symb_code'];
            SELECT_CURR2?.add(item);
        }

        SELECT_CURR1.value = 'RUB';
        SELECT_CURR2.value = 'USD';

        __outerupdate(0);
    } catch (error: unknown) {
        console.error('Error via requesting data from API:', error);
    }

    const INPUT_CURR1 = document.getElementById('input.curr1') as HTMLInputElement;
    const INPUT_CURR2 = document.getElementById('input.curr2') as HTMLInputElement;

    INPUT_CURR1.addEventListener('input', (event) => __inputcurr1_inputevent(event));
    INPUT_CURR1.value = '0';
    INPUT_CURR2.addEventListener('input', (event) => __inputcurr2_inputevent(event));
    INPUT_CURR2.value = '0';

    SELECT_CURR1.addEventListener('change', (event) => __selectcurr1_inputevent(event));
    SELECT_CURR2.addEventListener('change', (event) => __selectcurr2_inputevent(event));

    document.getElementById('button.curr')!.addEventListener('click', () => {
        var s1_value = 
        SELECT_CURR1.value;
        
        SELECT_CURR1.value = SELECT_CURR2.value;
        SELECT_CURR2.value = s1_value;

        var s2_value = 
        INPUT_CURR1.value;

        INPUT_CURR1.value = INPUT_CURR2.value;
        INPUT_CURR2.value = s2_value;

        __outerupdate(0);
    });

    INPUT_DATE.addEventListener('change', (event: Event) => __innerupdate(1));
});

function __inputcurr1_inputevent(event: Event) {
    __innerupdate(1);

    event.preventDefault();
}

function __inputcurr2_inputevent(event: Event) {
    __innerupdate(2);

    event.preventDefault();
}

function __selectcurr1_inputevent(event: Event) {
    __innerupdate(1);
    __outerupdate(1);

    event.preventDefault();
}

function __selectcurr2_inputevent(event: Event) {
    __innerupdate(1);
    __outerupdate(1);

    event.preventDefault();
}

async function __innerupdate(reason: number) {
    const BASE_URL = 'http://localhost:3000/';

    const INPUT_CURR1 = document.getElementById('input.curr1') as HTMLInputElement;
    const INPUT_CURR2 = document.getElementById('input.curr2') as HTMLInputElement;

    const INPUT_DATE = document.getElementById('input.date') as HTMLInputElement;

    const SELECT_CURR1 = document.getElementById('select.curr1') as HTMLSelectElement;
    const SELECT_CURR2 = document.getElementById('select.curr2') as HTMLSelectElement;

    const datetime = convert_datetime('request', INPUT_DATE.value);

    try {
        const response = await fetch(BASE_URL + `api/currencies/${datetime}`, 
        {
            method: 
                'GET',
            mode: 
                'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Error retrieving data from API.');

        const currencies: any[] = await response.json();

        const curr1: any = currencies.find(curr => curr['symb_code'] == SELECT_CURR1.value);
        const curr2: any = currencies.find(curr => curr['symb_code'] == SELECT_CURR2.value);

        const RUB = currencies.find(curr => curr['symb_code'] == 'RUB');

        if(reason == 1) {
            INPUT_CURR2.value = `${parse_currencies(curr1, curr2, RUB, Number(INPUT_CURR1.value))}`;
        } else if(reason == 2) {
            INPUT_CURR1.value = `${parse_currencies(curr2, curr1, RUB, Number(INPUT_CURR2.value))}`;
        } else {
            throw new Error('Operation ID is out of context range: see the actions refs.');
        }
    } catch(error: any) {
        console.error('Error via requesting data from API:', error.message);
    }
}

async function __outerupdate(reason: number) {
    const BASE_URL = 'http://localhost:3000/';

    const SELECT_CURR1 = document.getElementById('select.curr1') as HTMLSelectElement;
    const SELECT_CURR2 = document.getElementById('select.curr2') as HTMLSelectElement;

    const PARA_CURR1 = document.getElementById('para.curr1') as HTMLParagraphElement;
    const PARA_CURR2 = document.getElementById('para.curr2') as HTMLParagraphElement;

    const INPUT_DATE = document.getElementById('input.date') as HTMLInputElement;

    PARA_CURR1.innerHTML = '...';
    PARA_CURR2.innerHTML = '...';

    const datetime = convert_datetime('request', INPUT_DATE.value);

    try {
        const response = await fetch(BASE_URL + `api/currencies/${datetime}`, 
        {
            method: 
                'GET',
            mode: 
                'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error('Error retrieving data from API.');

        const currencies: any[] = await response.json();

        const curr1: any = currencies.find(curr => curr['symb_code'] == SELECT_CURR1.value);
        const curr2: any = currencies.find(curr => curr['symb_code'] == SELECT_CURR2.value);

        if (curr1 && curr2) {
            const CURR1_LINES = [
                { label: 'Код (симв.):', value: curr1.symb_code },
                { label: 'Код (цифр.):', value: curr1.numb_code },
                { label: 'Название:', value: curr1.volume },
                { label: 'Количество при обмене:', value: curr1.amount },
                { label: 'Курс обмена:', value: curr1.ratio }
            ];
    
            const CURR2_LINES = [
                { label: 'Код (симв.):', value: curr2.symb_code },
                { label: 'Код (цифр.):', value: curr2.numb_code },
                { label: 'Название:', value: curr2.volume },
                { label: 'Количество при обмене:', value: curr2.amount },
                { label: 'Курс обмена:', value: curr2.ratio }
            ];
    
            PARA_CURR1.innerHTML = '';
    
            for (const { 
                label, 
                value } of CURR1_LINES) {
                const labelElement = document.createElement('p');

                labelElement.className = 'panel-label';
                labelElement.innerHTML = label;

                PARA_CURR1.appendChild(labelElement);
    
                const valueElement = document.createElement('p');

                valueElement.className = 'panel-signal';
                valueElement.innerHTML = value;

                PARA_CURR1.appendChild(valueElement);
            }
    
            PARA_CURR2.innerHTML = '';
    
            for (const { 
                label, 
                value } of CURR2_LINES) {
                const labelElement = document.createElement('p');

                labelElement.className = 'panel-label';
                labelElement.innerHTML = label;

                PARA_CURR2.appendChild(labelElement);
    
                const valueElement = document.createElement('p');
                valueElement.className = 'panel-signal';
                valueElement.innerHTML = value;

                PARA_CURR2.appendChild(valueElement);
            }
        }
    } catch(error: unknown) {
        console.error('Error via requesting data from API:', error);
    }
}

function parse_currencies(
    curr1: any, 
    curr2: any, 
    RUB: any, 
    amount: number) {
    const amount_rub = amount * curr1['ratio'] / curr1['amount'];
    const amount_res = amount_rub * RUB['amount'] / RUB['ratio'];

    return amount_res * curr2['amount'] / curr2['ratio'];
}

function convert_datetime(target: string, value: string | undefined) {
    var date;

    if(value == '')
        date = new Date().toLocaleDateString('ru-RU').split('.');
    else
        date = [
            value?.split('-')[0],
            value?.split('-')[2],
            value?.split('-')[1]
        ];

    switch(target) {
        case 'inputbx':
            return `${date[2]}-${date[1]}-${date[0]}`;
        case 'request':
            return `${date[1]}.${date[2]}.${date[0]}`;
        default:
            return new Date().toLocaleDateString('ru-RU');
    }
}