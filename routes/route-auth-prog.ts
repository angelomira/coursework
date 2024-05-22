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

        const _hash = CryptoJS.MD5(`${passw}`).toString();

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

        return res.status(200).json({
            user: user_parser
        }).send();
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

// router.put('/api/update/user', async (req, res) => {
//     try {
//         const { userId, firstName, lastName, email, phoneNumber } = req.body;
//         // Use Prisma or any other ORM to update user data in the database
//         const updatedUser = await prisma.user.update({
//             where: {
//                 user_id: parseInt(userId)
//             },
//             data: {
//                 user_firstname: firstName,
//                 user_lastname: lastName,
//                 user_mail: email,
//                 user_phone: phoneNumber
//                 // Add other fields you want to update
//             }
//         });
//         return res.status(200).json(updatedUser);
//     } catch (error) {
//         console.error('Error updating user:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });
// router.get('/edit-user/:userId', async (req, res) => {
//     try {
//         const userId = req.params.userId;
        
//         // Fetch user data based on userId from the database
//         const user = await prisma.user.findUnique({
//             where: {
//                 user_id: parseInt(userId) // Assuming userId is an integer
//             }
//         });

//         if (!user) {
//             // If user is not found, return a 404 Not Found error
//             return res.status(404).send('User not found');
//         }

//         // Render the "edit-user.html" page with the user data
//         res.sendFile(path.join(__dirname, './static/pages/edit-user.html'));
//     } catch (error) {
//         // Handle errors
//         console.error('Error fetching user data:', error);
//         res.status(500).send('Internal server error');
//     }
// });

router.get('/api/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        // Преобразуйте значения BigInt в строку
        const serializedUsers = users.map(user => ({
            id: String(user.id),
            name_forename: user.name_forename,
            name_cognomen: user.name_cognomen,
            name_patronim: user.name_patronim,
            email: user.email,
            phone: user.phone,
            id_role: String(user.id_role),
            passp: user.passp,
            login: user.login,
            // Другие поля пользователя
        }));

        res.status(200).json(serializedUsers);
    } catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;