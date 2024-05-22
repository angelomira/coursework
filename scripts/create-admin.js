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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new client_1.PrismaClient();
    prisma.$connect()
        .then(() => {
        console.log('Connected to the server.');
    })
        .catch((reason) => __awaiter(void 0, void 0, void 0, function* () {
        console.error(reason);
    }));
    yield prisma.role.create({
        data: {
            id: 3,
            naming: 'Администатор',
            access: 3
        }
    });
    yield prisma.type.create({
        data: {
            id: 0,
            naming: 'Авторизация',
            status: 0
        }
    });
    yield prisma.user.create({
        data: {
            id: 0,
            id_role: 3,
            name_forename: 'Админ1',
            name_cognomen: 'Админ2',
            name_patronim: 'Админ3',
            email: 'admin@admin.com',
            phone: '+00000000000',
            passp: '0000000000',
            login: 'admin',
            passw: CryptoJS.MD5('admin').toString()
        }
    });
    console.log('Пользователь создан для взаимодействия с системой.');
    console.log('Данные для входа:\nЛогин: admin\nПароль: admin');
}))();
