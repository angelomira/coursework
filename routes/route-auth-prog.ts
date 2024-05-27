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
        Loggerin.info('/route-auth-prog/ Prisma is successfully connected to the server, current context.');
    })
    .catch(error => {
        Loggerin.error(error);
    });


/**
* Registers a new user.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the registration process.
* @swagger
* /api/registry/:
*   post:
*     summary: Register a new user.
*     description: Register a new user with the provided information.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               forename:
*                 type: string
*               cognomen:
*                 type: string
*               patronim:
*                 type: string
*               id_role:
*                 type: integer
*               email:
*                 type: string
*               phone:
*                 type: string
*               passp:
*                 type: string
*               login:
*                 type: string
*               passw:
*                 type: string
*     responses:
*       200:
*         description: Successfully registered user.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
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
router.post('/api/registry/', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST registry API request.');

    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }

        const {
            forename,
            cognomen,
            patronim,
            id_role,
            email,
            phone,
            passp,
            login,
            passw,
        } = req.body;

        console.log(forename,
            cognomen,
            patronim,
            id_role,
            email,
            phone,
            passp,
            login,
            passw);

        const _hash = CryptoJS.MD5(`${passw}`).toString();

        const user = await prisma.user.findFirst({
            where: {
                passp: passp,
                login: login
            }});

        if(user !== null || user !== undefined) {
            await prisma.user.update({
                where: {
                    id: user!.id
                },
                data: {
                    id_role:
                    id_role,
                    name_forename:
                        forename,
                    name_cognomen:
                        cognomen,
                    name_patronim:
                        patronim,
                    email:
                    email,
                    phone:
                    phone,
                    passp:
                    passp,
                    login:
                    login,
                    passw:
                    _hash
                }
            })
        }

        await prisma.user.create({
            data: {
                id_role:
                id_role,
                name_forename:
                     forename,
                name_cognomen:
                     cognomen,
                name_patronim:
                     patronim,
                email:
                email,
                phone:
                phone,
                passp:
                passp,
                login:
                login,
                passw:
                _hash
            }
        });

        Loggerin.info('Successfully registered new user.');

        res.status(200).json({
            message: 'Successfully registered user.'
        }).send();
    } catch (error) {
        Loggerin.error('Error fetcing POST of user registry: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

/**
* Handles user authentication.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the authentication process.
* @swagger
* /api/auth/:
*   post:
*     summary: Authenticate user.
*     description: Authenticate user with provided credentials.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               login:
*                 type: string
*               passw:
*                 type: string
*     responses:
*       200:
*         description: Successful authentication.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 user:
*                   type: object
*                   properties:
*                     id:
*                       type: string
*                     name_forename:
*                       type: string
*                     name_cognomen:
*                       type: string
*                     name_patronim:
*                       type: string
*                     email:
*                       type: string
*                     phone:
*                       type: string
*                     id_role:
*                       type: string
*                     passp:
*                       type: string
*                     login:
*                       type: string
*                     session:
*                       type: string
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
router.post('/api/auth/', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST authorization API request.');

    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }

        let _session = CryptoJS.MD5(new Date().toUTCString()).toString();

        const { login, passw } = req.body;

        const _hash = CryptoJS.MD5(passw).toString();

        const user = await prisma.user.findFirst({ 
            where: { 
                login: 
                login, 
                passw: 
                _hash 
            }});

        if(!user) throw new ReferenceError('There is no user with such provided data.');

        var user_parser = {
                 id: 
            user.id.toString(),
                 name_forename: 
            user.name_forename,
                 name_cognomen: 
            user.name_cognomen,
                 name_patronim: 
            user.name_patronim,
                 email: 
            user.email,
                 phone: 
            user.phone,
                 id_role: 
            user.id_role.toString(),
                 passp: 
            user.passp,
                 login: 
            user.login,
            'session':
            _session,
        };

        sessionize(_session, 'write');

        await prisma.interaction.create({
            data: {
                id_user: user.id,
                id_type: 0
            }
        });

        return res.status(200).json(user_parser).send();
    } catch(error) {
        Loggerin.error('Error fetcing POST of user auth: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

/**
* Retrieves information about the authenticated user.
* @param {import('express').Request} req - The request object.
* @param {import('express').Response} res - The response object.
* @returns {Promise<void>} A Promise representing the completion of the request for user information.
* @swagger
* /api/auth/me:
*   post:
*     summary: Retrieve information about the authenticated user.
*     description: Retrieve information about the authenticated user based on provided credentials.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               login:
*                 type: string
*               passp:
*                 type: string
*               paging:
*                 type: string
*     responses:
*       200:
*         description: Successfully retrieved user information.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       400:
*         description: Bad request.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       403:
*         description: Access denied.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*       404:
*         description: Page not found in routes map.
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
router.post('/api/auth/me', async (
    req: Request,
    res: Response
) => {
    Loggerin.info('Caught POST authorization API request: information about yourself.');

    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }

        const { login, passp, paging } = req.body;

        const user = await prisma.user.findFirst({ 
            where: { 
                login: 
                login, 
                passp: 
                passp 
            }});

        if(!user) throw new ReferenceError('There is no user with such provided data.');

        const role = await prisma.role.findFirst({
            where: {
                id:
                    user.id_role
            }
        });

        if(!role) throw new ReferenceError('There is no user-role with such provided data.');
        
        const access_check = routes_map.find(route => route['paging'] === paging);

        if(!access_check) {
            return res.status(404).json({
                error: 'Page not found in routes map.'
            });
        }

        if(role.access >= access_check['access']) {
            return res.status(200).json({
                message: 'Success'
            }).send();
        } else {
            return res.status(403).json({
                error: 'Access denied.'
            }).send();
        }
    } catch(error) {
        Loggerin.error('Error fetcing POST of user auth: ', error);

        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
});

router.get('/api/users', async (
    req: Request,
    res: Response
) => {
    try {
        const users = await prisma.user.findMany();

        const users_serialized = users.map(user => ({
                 id: 
            user.id.toString(),
                 name_forename: 
            user.name_forename,
                 name_cognomen: 
            user.name_cognomen,
                 name_patronim: 
            user.name_patronim,
                 email: 
            user.email,
                 phone: 
            user.phone,
                 id_role: 
            user.id_role.toString(),
                 passp: 
            user.passp,
                 login: 
            user.login,
        }));

        return res.status(200).json(users_serialized);
    } catch (error) {
        return res.status(500).json({ 
            error: 'Internal server error.' 
        });
    }
});

router.post('/api/user', async (
    req: Request,
    res: Response
) => {
    try {
        const {
            id
        } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });

        if(!user) throw new ReferenceError('There is no user with such provided data.');

        var user_parser = {
                 id: 
            user.id.toString(),
                 name_forename: 
            user.name_forename,
                 name_cognomen: 
            user.name_cognomen,
                 name_patronim: 
            user.name_patronim,
                 email: 
            user.email,
                 phone: 
            user.phone,
                 id_role: 
            user.id_role.toString(),
                 passp: 
            user.passp,
                 login: 
            user.login,
        };

        return res.status(200).json(user_parser).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Internal server error.' 
        });
    }
});

export default router;