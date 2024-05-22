"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Currency {
    constructor(numb_code, symb_code, amount, volume, ratio) {
        this._numb_code = numb_code;
        this._symb_code = symb_code;
        this._amount = amount;
        this._volume = volume;
        this._ratio = ratio;
    }
    get numbcode() {
        return this._numb_code;
    }
    get symbcode() {
        return this._symb_code;
    }
    get amount() {
        return this._amount;
    }
    get volume() {
        return this._volume;
    }
    get ratio() {
        return this._ratio;
    }
    toJSON() {
        return {
            numb_code: this._numb_code,
            symb_code: this._symb_code,
            amount: this._amount,
            volume: this._volume,
            ratio: this._ratio,
        };
    }
    RUBLE() {
        return new Currency('643', 'RUB', 1.0, 'Российский рубль', 1.0);
    }
}
exports.default = Currency;
