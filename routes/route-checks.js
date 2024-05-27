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
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
prisma.$connect()
    .then(() => {
    loggerin_1.default.info('/route-roles/ Prisma is successfully connected to the server, current context.');
})
    .catch(error => {
    loggerin_1.default.error(error);
});
router.get('/api/checks/:user_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        const checkbooks = yield prisma.checkbook.findMany({
            where: {
                id_user: BigInt(user_id),
            },
            include: {
                Operabook: true
            }
        });
        const serializedCheckbooks = checkbooks.map(checkbook => {
            var _a, _b, _c, _d, _e, _f, _g;
            return ({
                id: checkbook.id.toString(),
                id_operation: checkbook.id_operation.toString(),
                checkbook_date: checkbook.date,
                is_dup: checkbook.is_dup,
                is_gen: checkbook.is_gen,
                operabook_id: ((_a = checkbook.Operabook) === null || _a === void 0 ? void 0 : _a.id.toString()) || null,
                id_user: ((_b = checkbook.Operabook) === null || _b === void 0 ? void 0 : _b.id_user.toString()) || null,
                amount: ((_c = checkbook.Operabook) === null || _c === void 0 ? void 0 : _c.amount) || null,
                status: ((_d = checkbook.Operabook) === null || _d === void 0 ? void 0 : _d.status) || null,
                curr: ((_e = checkbook.Operabook) === null || _e === void 0 ? void 0 : _e.curr) || null,
                curr_sum: ((_f = checkbook.Operabook) === null || _f === void 0 ? void 0 : _f.curr_sum) || null,
                operabook_date: ((_g = checkbook.Operabook) === null || _g === void 0 ? void 0 : _g.date) || null,
            });
        });
        // Send the serialized JSON response
        return res.status(200).json(serializedCheckbooks);
    }
    catch (error) {
        console.error('Error fetching checks:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
