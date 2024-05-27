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
const express_1 = __importDefault(require("express"));
const currencies_1 = __importDefault(require("../api/currencies"));
const client_1 = require("@prisma/client");
const currency_1 = __importDefault(require("../models/currency"));
const app = (0, express_1.default)();
const api = new currencies_1.default();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/api/exchange', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, currency_to, currency_from, origin_amount } = req.body;
        const user_funds = yield prisma.fund.findMany({
            where: {
                id_user: user_id
            }
        });
        const fund_from = user_funds.find(f => f.curr_naming === currency_from);
        const fund_to = user_funds.find(f => f.curr_naming === currency_to);
        if (!fund_from || !fund_to)
            return res.status(404).json('Given funds don\'t exist');
        if (origin_amount >= 1000)
            return res.status(400).json('Volume of operation is bigger than allowed!');
        if (fund_from.curr_volume < origin_amount)
            return res.status(400).json('Volume of fund is lesser than requested amount!');
        const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '.'); // Adjust the date format if necessary
        const currencies = yield api.currencies(date);
        const curr_to = currencies.find(curr => curr.symbcode === currency_to);
        const curr_from = currencies.find(curr => curr.symbcode === currency_from);
        const result = parse_currencies(curr_from, curr_to, currency_1.default.prototype.RUBLE(), Number(origin_amount));
        yield prisma.fund.update({
            where: {
                id: fund_from.id
            },
            data: {
                curr_volume: fund_from.curr_volume - origin_amount
            }
        });
        yield prisma.fund.update({
            where: {
                id: fund_to.id
            },
            data: {
                curr_volume: fund_to.curr_volume + result
            }
        });
        const operb = yield prisma.operabook.create({
            data: {
                id_user: user_id,
                amount: Number(origin_amount),
                status: 2,
                curr: `${curr_from.symbcode}:${curr_to.symbcode}`,
                curr_sum: result,
            }
        });
        yield prisma.checkbook.create({
            data: {
                id_user: operb.id_user,
                id_operation: operb.id,
                is_dup: false,
                is_gen: false,
            }
        });
        return res.status(200).json('Success.');
    }
    catch (error) {
        console.error(error);
        return res.status(500).json('Internal server error.');
    }
}));
function parse_currencies(curr1, curr2, RUB, amount) {
    const amount_rub = amount * curr1['ratio'] / curr1['amount'];
    const amount_res = amount_rub * RUB['amount'] / RUB['ratio'];
    return amount_res * curr2['amount'] / curr2['ratio'];
}
exports.default = router;
