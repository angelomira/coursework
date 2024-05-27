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
    loggerin_1.default.info('/route-funds/ Prisma is successfully connected to the server, current context.');
})
    .catch(error => {
    loggerin_1.default.error(error);
});
router.post('/funds/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST request about creating fund for user:', req.body.id_user);
    try {
        const { id_user, curr_naming, curr_volume } = req.body;
        const find_fund = yield prisma.fund.findFirst({
            where: {
                id_user: id_user,
                curr_naming: curr_naming,
            }
        });
        if (find_fund !== null) {
            return res.status(404).json('Fund already exists.');
        }
        const fund = yield prisma.fund.create({
            data: {
                id_user: id_user,
                curr_naming: curr_naming,
                curr_volume: curr_volume
            }
        });
        yield prisma.interaction.create({
            data: {
                id_user: id_user,
                id_type: 2
            }
        });
        return res.status(200).json('Success');
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error).send();
    }
}));
router.post('/funds/deposit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, amount } = req.body;
        // Check if the fund exists (you may need to modify this)
        const fund = yield prisma.fund.findUnique({
            where: {
                id: id,
            },
        });
        if (!fund) {
            return res.status(404).json({ error: 'Fund not found.' });
        }
        // Update the fund's current volume
        const updatedFund = yield prisma.fund.update({
            where: {
                id: id,
            },
            data: {
                curr_volume: {
                    // Increment the current volume by the deposited amount
                    increment: amount,
                },
            },
        });
        // Create an operation for the fund deposit
        const operation = yield prisma.operabook.create({
            data: {
                id_user: fund.id_user, // Assuming the fund has a user associated with it
                amount: amount,
                status: 0, // You may need to define the status values
                curr: fund.curr_naming, // Assuming the currency is stored in fund.curr_naming
                curr_sum: updatedFund.curr_volume, // Current total volume of the fund
            },
        });
        // Create a checkbook entry for the operation
        yield prisma.checkbook.create({
            data: {
                id_operation: operation.id,
                is_dup: false, // You may need to define these values
                is_gen: false,
                id_user: fund.id_user
            },
        });
        // Create an interaction entry (assuming it's related to the fund)
        yield prisma.interaction.create({
            data: {
                id_user: fund.id_user,
                id_type: 2, // Assuming the interaction type for fund deposit
            },
        });
        return res.status(200).json({ message: 'Fund deposited successfully.' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}));
router.post('/funds/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    loggerin_1.default.info('Caught POST request about getting funds for user:', req.body.id_user);
    try {
        const { id_user } = req.body;
        const funds = yield prisma.fund.findMany({
            where: {
                id_user: id_user
            }
        });
        const funds_serialized = funds.map(fund => ({
            id: fund.id.toString(),
            id_user: fund.id_user.toString(),
            curr_naming: fund.curr_naming,
            curr_volume: fund.curr_volume
        }));
        res.status(200).json(funds_serialized).send();
    }
    catch (error) {
        console.error(error);
    }
}));
exports.default = router;
