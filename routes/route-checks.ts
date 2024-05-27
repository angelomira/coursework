import express from 'express';
import Loggerin from '../addons/loggerin';
import API from '../api/currencies';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        Loggerin.info('/route-roles/ Prisma is successfully connected to the server, current context.');
    })
    .catch(error => {
        Loggerin.error(error);
    });

router.get('/api/checks/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const checkbooks = await prisma.checkbook.findMany({
            where: {
                id_user: BigInt(user_id),
            },
            include: {
                Operabook: true
            }
        });

        const serializedCheckbooks = checkbooks.map(checkbook => ({
            id: checkbook.id.toString(),
            id_operation: checkbook.id_operation.toString(),
            checkbook_date: checkbook.date,
            is_dup: checkbook.is_dup,
            is_gen: checkbook.is_gen,
            operabook_id: checkbook.Operabook?.id.toString() || null,
            id_user: checkbook.Operabook?.id_user.toString() || null,
            amount: checkbook.Operabook?.amount || null,
            status: checkbook.Operabook?.status || null,
            curr: checkbook.Operabook?.curr || null,
            curr_sum: checkbook.Operabook?.curr_sum || null,
            operabook_date: checkbook.Operabook?.date || null,
        }));

        // Send the serialized JSON response
        return res.status(200).json(serializedCheckbooks);
    } catch (error) {
        console.error('Error fetching checks:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
