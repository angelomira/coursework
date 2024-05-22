import { JSDOM } from 'jsdom';

import Currency from '../models/currency';

export default class API {
    async URI(date: string): Promise<any[]> {
        return await fetch(`https://cbr.ru/currency_base/daily/?UniDbQuery.Posted=True&UniDbQuery.To=${date}`)
                .then(async (HTML) => {
                    const DOM = new JSDOM(await HTML.text());

                    const document = DOM.window.document;

                    const tables = document.querySelector('.data')!;
                    const bodies = document.querySelector('tbody')!;

                    const data: object[] = [];

                    const rows = bodies.querySelectorAll('tr');

                    for(const row of rows) {
                        const items = row.querySelectorAll('td');

                        items.forEach(async (item, index) => {
                            const contents = item.textContent?.trim();

                            const row_data: any = {};

                            switch(index) {
                                case 0:
                                    row_data['Цифр. код'] = contents;
                                    break;
                                case 1:
                                    row_data['Букв. код'] = contents;
                                    break;
                                case 2:
                                    row_data['Единиц'] = contents;
                                    break;
                                case 3:
                                    row_data['Валюта'] = contents;
                                    break;
                                case 4:
                                    row_data['Курс'] = contents;
                            }

                            data.push(row_data);
                        });
                    }

                    return data;
                });
    }

    async currencies(date: string): Promise<Currency[]> {
        const data = await this.URI(date);

        const currs: Currency[] = [Currency.prototype.RUBLE()];

        for(let i = 0; i < data.length - 5; i += 5) {
            currs.push(new Currency(
                data[i]['Цифр. код'],
                data[i+1]['Букв. код'],
                parseFloat(data[i+2]['Единиц']
                    .replace(',', '.')),

                data[i+3]['Валюта'],
                
                parseFloat(data[i+4]['Курс']
                    .replace(',', '.'))
            ));
        }

        return currs;
    }

    async currency(code: string, date: string): Promise<undefined | Currency> {
        const currencies = await this.currencies(date);

        if(!currencies.find(curr => curr.symbcode === code))
            return currencies.find(curr => curr.numbcode === code);
        if(!currencies.find(curr => curr.numbcode === code))
            return currencies.find(curr => curr.symbcode === code);

        return undefined;
    }
} 
// мат. модель; встроенный ассистент (аналитика выгодной конвертации); статистические модели для предсказания;
// ... платежные шлюзы надо имитировать, а не делать полноценно (если упор на сам конвертер валют, то можно сделать)
// тупо страничку "УЧЕБНАЯ ИМИТАЦИЯ ОПЛАТЫ";