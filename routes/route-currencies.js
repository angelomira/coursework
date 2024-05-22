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
const loggerin_1 = __importDefault(require("../addons/loggerin"));
const currencies_1 = __importDefault(require("../api/currencies"));
const app = (0, express_1.default)();
const api = new currencies_1.default();
const router = express_1.default.Router();
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
router.get('/api/currencies/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught GET currencies info API request at', req.params.date);
    try {
        const date = req.params.date;
        if (!date) {
            return res.status(400).json({
                error: 'Currency date is missing in the request header.'
            }).send();
        }
        const currencies = yield api.currencies(date);
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
    }
    catch (error) {
        loggerin_1.default.error('Error fetching currencies: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
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
router.get('/api/currencies/:date/:curr', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught GET currency info API request about:', req.params.curr, 'at', req.params.date);
    try {
        const code = req.params.curr;
        const date = req.params.date;
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
        const currency = yield api.currency(code, date);
        if (!currency) {
            return res.status(404).json({
                error: 'Currency data not found.'
            }).send();
        }
        res.send(currency);
    }
    catch (error) {
        loggerin_1.default.error('Error fetching currency: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
exports.default = router;
