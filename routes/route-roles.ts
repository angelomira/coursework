import express, { Request, Response } from 'express';

import Loggerin from '../addons/loggerin';

import API from '../api/currencies';
import LCU from '../addons/logic-unifier';

import { Prisma, PrismaClient } from '@prisma/client';

import CryptoJS from 'crypto-js';

const app = express();
const api = new API();

const router = express.Router();

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        Loggerin.info('/route-roles/ Prisma is successfully connected to the server, current context.');
    })
    .catch(error => {
        Loggerin.error(error);
    });

/**
* Retrieves roles list based on the provided role ID.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the request for roles list.
* @swagger
* /roles:
*   post:
*     summary: Retrieve roles list based on role ID.
*     description: Retrieve roles list based on the provided role ID, returning roles with access level less than or equal to the provided role.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id_role:
*                 type: string
*     responses:
*       200:
*         description: Successfully retrieved roles list.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 roles:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: string
*                       naming:
*                         type: string
*                       access:
*                         type: string
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
router.post('/roles', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST request about roles list, given id:', `${req.body.roleid}.`);

    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }

        const { id_role } = req.body;

        const role = await prisma.role.findFirst({
            where: {
                id:
                    BigInt(id_role)
            }
        });
        
        if(!role) throw new ReferenceError('There is no user-role with such provided data.');

        const roles = await prisma.role.findMany({
            where: {
                access: {
                    lte: role.access
                }
            },
            select: {
                id: true,
                naming: true,
                access: true
            }
        });
        
        const roles_json = roles.map(role => ({
            ...role,
                 id: 
            role.id.toString(),
                 access: 
            role.access.toString()
        }));
        
        return res.status(200).json(roles_json).send();
    } catch(error) {
        Loggerin.error('Error fetcing POST of role list: ', error);
        
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

router.post('/role', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST request about roles list, given id:', `${req.body.roleid}.`);

    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }

        const { id_role } = req.body;

        const role = await prisma.role.findFirst({
            where: {
                id:
                    BigInt(id_role)
            }
        });
        
        if(!role) throw new ReferenceError('There is no user-role with such provided data.');
        
        const roles_json = {
                 id: 
            role.id.toString(),
                 access: 
            role.access.toString(),
                 naming:
            role.naming
        };
        
        return res.status(200).json(roles_json).send();
    } catch(error) {
        Loggerin.error('Error fetcing POST of role list: ', error);
        
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

export default router;