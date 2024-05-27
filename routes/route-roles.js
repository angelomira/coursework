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
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const api = new currencies_1.default();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
prisma.$connect()
    .then(() => {
    loggerin_1.default.info('/route-roles/ Prisma is successfully connected to the server, current context.');
})
    .catch(error => {
    loggerin_1.default.error(error);
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
router.post('/roles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST request about roles list, given id:', `${req.body.roleid}.`);
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }
        const { id_role } = req.body;
        const role = yield prisma.role.findFirst({
            where: {
                id: BigInt(id_role)
            }
        });
        if (!role)
            throw new ReferenceError('There is no user-role with such provided data.');
        const roles = yield prisma.role.findMany({
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
        const roles_json = roles.map(role => (Object.assign(Object.assign({}, role), { id: role.id.toString(), access: role.access.toString() })));
        return res.status(200).json(roles_json).send();
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing POST of role list: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
router.post('/role', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST request about roles list, given id:', `${req.body.roleid}.`);
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'No body to registry or parse in request.'
            });
        }
        const { id_role } = req.body;
        const role = yield prisma.role.findFirst({
            where: {
                id: BigInt(id_role)
            }
        });
        if (!role)
            throw new ReferenceError('There is no user-role with such provided data.');
        const roles_json = {
            id: role.id.toString(),
            access: role.access.toString(),
            naming: role.naming
        };
        return res.status(200).json(roles_json).send();
    }
    catch (error) {
        loggerin_1.default.error('Error fetcing POST of role list: ', error);
        return res.status(500).json({
            error: 'Internal server error.'
        }).send();
    }
}));
exports.default = router;
