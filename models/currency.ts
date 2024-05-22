export default class Currency {
    private _numb_code: string;
    private _symb_code: string;
    private _amount: number;
    private _volume: string;
    private _ratio: number;

    constructor(
        numb_code: string,
        symb_code: string,
        amount: number,
        volume: string,
        ratio: number
    ) {
        this._numb_code = numb_code;
        this._symb_code = symb_code;
        this._amount = amount;
        this._volume = volume;
        this._ratio = ratio;
    }

    public get numbcode(): string {
        return this._numb_code;
    }

    public get symbcode(): string {
        return this._symb_code;
    }

    public get amount(): number {
        return this._amount;
    }

    public get volume(): string {
        return this._volume;
    }

    public get ratio(): number {
        return this._ratio;
    }

    toJSON(): { 
        numb_code: string, 
        symb_code: string, 
        amount: number, 
        volume: string, 
        ratio: number 
    } {
        return {
            numb_code: this._numb_code,
            symb_code: this._symb_code,
            amount: this._amount,
            volume: this._volume,
            ratio: this._ratio,
        };
    }

    RUBLE() {
        return new Currency(
            '643',
            'RUB',
            1.0,
            'Российский рубль',
            1.0,
        );
    }
}