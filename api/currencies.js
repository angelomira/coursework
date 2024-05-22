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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const currency_1 = __importDefault(require("../models/currency"));
class API {
    URI(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch(`https://cbr.ru/currency_base/daily/?UniDbQuery.Posted=True&UniDbQuery.To=${date}`)
                .then((HTML) => __awaiter(this, void 0, void 0, function* () {
                const DOM = new jsdom_1.JSDOM(yield HTML.text());
                const document = DOM.window.document;
                const tables = document.querySelector('.data');
                const bodies = document.querySelector('tbody');
                const data = [];
                const rows = bodies.querySelectorAll('tr');
                for (const row of rows) {
                    const items = row.querySelectorAll('td');
                    items.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const contents = (_a = item.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                        const row_data = {};
                        switch (index) {
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
                    }));
                }
                return data;
            }));
        });
    }
    currencies(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.URI(date);
            const currs = [currency_1.default.prototype.RUBLE()];
            for (let i = 0; i < data.length - 5; i += 5) {
                currs.push(new currency_1.default(data[i]['Цифр. код'], data[i + 1]['Букв. код'], parseFloat(data[i + 2]['Единиц']
                    .replace(',', '.')), data[i + 3]['Валюта'], parseFloat(data[i + 4]['Курс']
                    .replace(',', '.'))));
            }
            return currs;
        });
    }
    currency(code, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const currencies = yield this.currencies(date);
            if (!currencies.find(curr => curr.symbcode === code))
                return currencies.find(curr => curr.numbcode === code);
            if (!currencies.find(curr => curr.numbcode === code))
                return currencies.find(curr => curr.symbcode === code);
            return undefined;
        });
    }
}
exports.default = API;
// мат. модель; встроенный ассистент (аналитика выгодной конвертации); статистические модели для предсказания;
// ... платежные шлюзы надо имитировать, а не делать полноценно (если упор на сам конвертер валют, то можно сделать)
// тупо страничку "УЧЕБНАЯ ИМИТАЦИЯ ОПЛАТЫ";
