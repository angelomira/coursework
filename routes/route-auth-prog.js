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
const server_context_1 = __importDefault(require("../server-context"));
const sessionizer_1 = __importDefault(require("../addons/sessionizer"));
const client_1 = require("@prisma/client");
const crypto_js_1 = __importDefault(require("crypto-js"));
const app = (0, express_1.default)();
const api = new currencies_1.default();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
prisma.$connect()
    .then(() => {
    loggerin_1.default.info('/route-auth-prog/ Prisma is successfully connected to the server, current context.');
})
    .catch(error => {
    loggerin_1.default.error(error);
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
router.post('/api/registry/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST registry API request.');
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }
        const { forename, cognomen, patronim, id_role, email, phone, passp, login, passw, } = req.body;
        console.log(forename, cognomen, patronim, id_role, email, phone, passp, login, passw);
        const _hash = crypto_js_1.default.MD5(`${passw}`).toString();
        if (!(yield prisma.user.findMany({
            where: {
                passp: passp,
                login: login
            }
        })))
            throw new Error('User with same credentials already exists in the database.');
        yield prisma.user.create({
            data: {
                id_role: id_role,
                name_forename: forename,
                name_cognomen: cognomen,
                name_patronim: patronim,
                email: email,
                phone: phone,
                passp: passp,
                login: login,
                passw: _hash
            }
        });
        loggerin_1.default.info('Successfully registered new user.');
        res.status(200).json({
            message: 'Successfully registered user.'
        }).send();
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing POST of user registry: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
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
router.post('/api/auth/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST authorization API request.');
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }
        let _session = crypto_js_1.default.MD5(new Date().toUTCString()).toString();
        const { login, passw } = req.body;
        const _hash = crypto_js_1.default.MD5(passw).toString();
        const user = yield prisma.user.findFirst({
            where: {
                login: login,
                passw: _hash
            }
        });
        if (!user)
            throw new ReferenceError('There is no user with such provided data.');
        var user_parser = {
            id: user.id.toString(),
            name_forename: user.name_forename,
            name_cognomen: user.name_cognomen,
            name_patronim: user.name_patronim,
            email: user.email,
            phone: user.phone,
            id_role: user.id_role.toString(),
            passp: user.passp,
            login: user.login,
            'session': _session,
        };
        (0, sessionizer_1.default)(_session, 'write');
        yield prisma.interaction.create({
            data: {
                id_user: user.id,
                id_type: 0
            }
        });
        return res.status(200).json(user_parser).send();
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing POST of user auth: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
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
router.post('/api/auth/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST authorization API request: information about yourself.');
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }
        const { login, passp, paging } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                login: login,
                passp: passp
            }
        });
        if (!user)
            throw new ReferenceError('There is no user with such provided data.');
        const role = yield prisma.role.findFirst({
            where: {
                id: user.id_role
            }
        });
        if (!role)
            throw new ReferenceError('There is no user-role with such provided data.');
        const access_check = server_context_1.default.find(route => route['paging'] === paging);
        if (!access_check) {
            return res.status(404).json({
                error: 'Page not found in routes map.'
            });
        }
        if (role.access >= access_check['access']) {
            return res.status(200).json({
                message: 'Success'
            }).send();
        }
        else {
            return res.status(403).json({
                error: 'Access denied.'
            }).send();
        }
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing POST of user auth: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
router.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        const users_serialized = users.map(user => ({
            id: user.id.toString(),
            name_forename: user.name_forename,
            name_cognomen: user.name_cognomen,
            name_patronim: user.name_patronim,
            email: user.email,
            phone: user.phone,
            id_role: user.id_role.toString(),
            passp: user.passp,
            login: user.login,
        }));
        return res.status(200).json(users_serialized);
    }
    catch (error) {
        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
}));
router.post('/api/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                id: id
            }
        });
        if (!user)
            throw new ReferenceError('There is no user with such provided data.');
        var user_parser = {
            id: user.id.toString(),
            name_forename: user.name_forename,
            name_cognomen: user.name_cognomen,
            name_patronim: user.name_patronim,
            email: user.email,
            phone: user.phone,
            id_role: user.id_role.toString(),
            passp: user.passp,
            login: user.login,
        };
        return res.status(200).json(user_parser).send();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Internal server error.'
        });
    }
}));
exports.default = router;
