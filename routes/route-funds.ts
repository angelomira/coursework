import express, { Request, Response } from 'express';

import Loggerin from '../addons/loggerin';

import API from '../api/currencies';
import LCU from '../addons/logic-unifier';

import routes_map from '../server-context';
import sessionize from '../addons/sessionizer';

import { Prisma, PrismaClient } from '@prisma/client';

import CryptoJS from 'crypto-js';

const app = express();
const api = new API();

const router = express.Router();

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        Loggerin.info('/route-funds/ Prisma is successfully connected to the server, current context.');
    })
    .catch(error => {
        Loggerin.error(error);
    });

router.post('/funds/create', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST request about creating fund for user:', req.body.id_user);

    try {
        const {
            id_user,
            curr_naming,
            curr_volume
        } = req.body;

        const find_fund = await prisma.fund.findFirst({
            where: {
                id_user: id_user,
                curr_naming: curr_naming,
            }
        });

        if(find_fund !== null) {
            return res.status(404).json('Fund already exists.');
        }

        const fund = await prisma.fund.create({
            data: {
                id_user: id_user,
                curr_naming: curr_naming,
                curr_volume: curr_volume
            }
        });
        
        await prisma.interaction.create({
            data: {
                id_user: id_user,
                id_type: 2
            }
        });

        return res.status(200).json('Success');
    } catch(error: unknown) {
        console.error(error);

        res.status(500).json(error).send();
    }
});

router.post('/funds/deposit', async (req, res) => {
    try {
        const { id, amount } = req.body;

        // Check if the fund exists (you may need to modify this)
        const fund = await prisma.fund.findUnique({
            where: {
                id: id,
            },
        });

        if (!fund) {
            return res.status(404).json({ error: 'Fund not found.' });
        }

        // Update the fund's current volume
        const updatedFund = await prisma.fund.update({
            where: {
                id: id,
            },
            data: {
                curr_volume: {
                    // Increment the current volume by the deposited amount
                    increment: amount,
                },
            },
        });

        // Create an operation for the fund deposit
        const operation = await prisma.operabook.create({
            data: {
                id_user: fund.id_user, // Assuming the fund has a user associated with it
                amount: amount,
                status: 0, // You may need to define the status values
                curr: fund.curr_naming, // Assuming the currency is stored in fund.curr_naming
                curr_sum: updatedFund.curr_volume, // Current total volume of the fund
            },
        });

        // Create a checkbook entry for the operation
        await prisma.checkbook.create({
            data: {
                id_operation: operation.id,
                is_dup: false, // You may need to define these values
                is_gen: false,
                id_user: fund.id_user
            },
        });

        // Create an interaction entry (assuming it's related to the fund)
        await prisma.interaction.create({
            data: {
                id_user: fund.id_user,
                id_type: 2, // Assuming the interaction type for fund deposit
            },
        });

        return res.status(200).json({ message: 'Fund deposited successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/funds/get', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST request about getting funds for user:', req.body.id_user);

    try {
        const { id_user } = req.body;

        const funds = await prisma.fund.findMany({
            where: {
                id_user: id_user
            }
        });

        const funds_serialized = funds.map(fund => ({
            id: fund.id.toString(),
            id_user: fund.id_user.toString(),
            curr_naming: fund.curr_naming,
            curr_volume: fund.curr_volume
        }));

        res.status(200).json(funds_serialized).send();
    } catch(error: unknown) {
        console.error(error);
    }
});

export default router;