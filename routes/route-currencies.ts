import express, { Request, Response } from 'express';

import Loggerin from '../addons/loggerin';

import API from '../api/currencies';
import LCU from '../addons/logic-unifier';

const app = express();
const api = new API();

const router = express.Router();

/**
* Retrieves currency information for a specific date.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the request for currency information.
* @swagger
* /api/currencies/{date}:
*   get:
*     summary: Retrieve currency information for a specific date.
*     description: Retrieve currency information for a specific date based on provided date parameter.
*     parameters:
*       - in: path
*         name: date
*         schema:
*           type: string
*         required: true
*         description: Date in YYYY-MM-DD format.
*     responses:
*       200:
*         description: Successfully retrieved currency information.
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   // Define properties here based on the structure of currency data.
*       400:
*         description: Bad request.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       500:
*         description: Internal server error.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*/
router.get('/api/currencies/:date', async (req: Request, res: Response) => {
    Loggerin.info('Caught GET currencies info API request at', req.params.date);

    try {
        const date: string = req.params.date;

        if (!date) {
            return res.status(400).json({
                error: 'Currency date is missing in the request header.'
            }).send();
        }

        const currencies = await api.currencies(date);

        if (currencies.length == 0) {
            return res.status(400).json({
                error: 'Currencies data not found.'
            }).send();
        }

        const data = currencies.map(curr => curr.toJSON());

        if (data.length == 0) {
            return res.status(400).json({
                error: 'Currencies data not found.'
            }).send();
        }

        res.send(data);
    } catch (error) {
        Loggerin.error('Error fetching currencies: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

/**
* Retrieves information about a specific currency for a given date.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the request for currency information.
* @swagger
* /api/currencies/{date}/{curr}:
*   get:
*     summary: Retrieve information about a specific currency for a given date.
*     description: Retrieve information about a specific currency for a given date based on provided currency code and date parameters.
*     parameters:
*       - in: path
*         name: date
*         schema:
*           type: string
*         required: true
*         description: Date in YYYY-MM-DD format.
*       - in: path
*         name: curr
*         schema:
*           type: string
*         required: true
*         description: Currency code.
*     responses:
*       200:
*         description: Successfully retrieved currency information.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 // Define properties here based on the structure of currency data.
*       400:
*         description: Bad request.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       404:
*         description: Currency data not found.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       500:
*         description: Internal server error.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*/
router.get('/api/currencies/:date/:curr', async (req: Request, res: Response) => {
    Loggerin.info('Caught GET currency info API request about:', req.params.curr, 'at', req.params.date);

    try {
        const code: string = req.params.curr;
        const date: string = req.params.date;

        if (!code) {
            return res.status(400).json({
                error: 'Currency code is missing in the request header.'
            }).send();
        }

        if (!date) {
            return res.status(400).json({
                error: 'Currency date is missing in the request header.'
            }).send();
        }

        const currency = await api.currency(code, date);

        if (!currency) {
            return res.status(404).json({
                error: 'Currency data not found.'
            }).send();
        }

        res.send(currency);
    } catch (error) {
        Loggerin.error('Error fetching currency: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

export default router;