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
const sessionizer_1 = __importDefault(require("../addons/sessionizer"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const api = new currencies_1.default();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
prisma.$connect()
    .then(() => {
    loggerin_1.default.info('/route-auth-sess/ Prisma is successfully connected to the server, current context.');
})
    .catch(error => {
    loggerin_1.default.error(error);
});
/**
* Retrieves session information based on session ID.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the request for session information.
* @swagger
* /sessions/{sess}:
*   get:
*     summary: Retrieve session information.
*     description: Retrieve session information based on session ID.
*     parameters:
*       - in: path
*         name: sess
*         schema:
*           type: string
*         required: true
*         description: Session ID.
*     responses:
*       200:
*         description: Successfully retrieved session information.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 res:
*                   type: boolean
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
router.get('/sessions/:sess', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught GET sessions info API request for:', req.params.sess);
    try {
        const sess = req.params.sess;
        if (!sess) {
            return res.status(400).json({
                error: 'Session data is missing in the request header.'
            });
        }
        if ((0, sessionizer_1.default)(sess, 'read')) {
            return res.status(200).json({
                res: true
            });
        }
        else {
            return res.status(200).json({
                res: false
            });
        }
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing sessions: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
}));
/**
* Deauthorizes a session.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the deauthorization process.
* @swagger
* /sessions/deauth/{sess}:
*   get:
*     summary: Deauthorize session.
*     description: Deauthorize a session based on session ID.
*     parameters:
*       - in: path
*         name: sess
*         schema:
*           type: string
*         required: true
*         description: Session ID.
*     responses:
*       200:
*         description: Successfully deauthorized session.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 res:
*                   type: boolean
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
router.get('/sessions/deauth/:sess', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught GET sessions info API request for:', req.params.sess);
    try {
        const sess = req.params.sess;
        if (!sess) {
            return res.status(400).json({
                error: 'Session data is missing in the request header.'
            });
        }
        if ((0, sessionizer_1.default)(sess, 'slice')) {
            return res.status(200).json({
                res: true
            });
        }
        else {
            return res.status(200).json({
                res: false
            });
        }
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing sessions: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
}));
exports.default = router;
