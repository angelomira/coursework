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
        Loggerin.info('/route-auth-sess/ Prisma is successfully connected to the server, current context.');
    })
    .catch(error => {
        Loggerin.error(error);
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
router.get('/sessions/:sess', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught GET sessions info API request for:', req.params.sess);

    try {
        const sess: string = req.params.sess;

        if (!sess) {
            return res.status(400).json({
                error: 'Session data is missing in the request header.'
            });
        }

        if(sessionize(sess, 'read')) {
            return res.status(200).json({
                res: true
            });
        } else {
            return res.status(200).json({
                res: false
            });
        }
    } catch (error) {
        Loggerin.error('Error fetcing sessions: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
});

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
router.get('/sessions/deauth/:sess', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught GET sessions info API request for:', req.params.sess);

    try {
        const sess: string = req.params.sess;

        if (!sess) {
            return res.status(400).json({
                error: 'Session data is missing in the request header.'
            });
        }

        if(sessionize(sess, 'slice')) {
            return res.status(200).json({
                res: true
            });
        } else {
            return res.status(200).json({
                res: false
            });
        }
    } catch (error) {
        Loggerin.error('Error fetcing sessions: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
});

export default router;