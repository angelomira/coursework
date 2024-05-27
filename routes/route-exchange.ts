import express, { Request, Response } from 'express';

import Loggerin from '../addons/loggerin';

import API from '../api/currencies';
import LCU from '../addons/logic-unifier';
import { PrismaClient } from '@prisma/client';

import Currency from '../models/currency';

const app = express();
const api = new API();

const router = express.Router();

const prisma = new PrismaClient();

router.post('/api/exchange', async (req, res) => {
    try {
        const {
            user_id,
            currency_to,
            currency_from,
            origin_amount
        } = req.body;

        const user_funds = await prisma.fund.findMany({
            where: {
                id_user: user_id
            }
        });

        const fund_from = user_funds.find(f => f.curr_naming === currency_from);
        const fund_to = user_funds.find(f => f.curr_naming === currency_to);

        if(!fund_from || !fund_to)
            return res.status(404).json('Given funds don\'t exist');

        if(origin_amount >= 1000)
            return res.status(400).json('Volume of operation is bigger than allowed!');

        if(fund_from.curr_volume < origin_amount)
            return res.status(400).json('Volume of fund is lesser than requested amount!');

        const date = new Date().toLocaleDateString('ru-RU').replace(/\./g, '.'); // Adjust the date format if necessary

        const currencies = await api.currencies(date);
        const curr_to = currencies.find(curr => curr.symbcode === currency_to)!;
        const curr_from = currencies.find(curr => curr.symbcode === currency_from)!;

        const result = parse_currencies(curr_from, curr_to, Currency.prototype.RUBLE(), Number(origin_amount));
        
        await prisma.fund.update({
            where: {
                id: fund_from.id
            },
            data: {
                curr_volume: fund_from.curr_volume - origin_amount
            }
        });

        await prisma.fund.update({
            where: {
                id: fund_to.id
            },
            data: {
                curr_volume: fund_to.curr_volume + result
            }
        });

        const operb = await prisma.operabook.create({
            data: {
                id_user: user_id,
                amount: Number(origin_amount),
                status: 2,
                curr: `${curr_from.symbcode}:${curr_to.symbcode}`,
                curr_sum: result,
            }
        });

        await prisma.checkbook.create({
            data: {
                id_user: operb.id_user,
                id_operation: operb.id,
                is_dup: false,
                is_gen: false,
            }
        });

        return res.status(200).json('Success.');
    } catch(error: unknown) {
        console.error(error);

        return res.status(500).json('Internal server error.');
    }
});

function parse_currencies(
    curr1: Currency, 
    curr2: Currency, 
    RUB: Currency, 
    amount: number) {
    const amount_rub = amount * curr1['ratio'] / curr1['amount'];
    const amount_res = amount_rub * RUB['amount'] / RUB['ratio'];

    return amount_res * curr2['amount'] / curr2['ratio'];
}

export default router;