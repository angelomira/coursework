import { Prisma, PrismaClient } from "@prisma/client";

(async () => {
    const prisma = new PrismaClient();

    prisma.$connect()
        .then(() => {
            console.log('Connected to the server.')
        })
        .catch(async (reason) => {
            console.error(reason);
        });

    await prisma.role.create({
        data: {
            id: 3,
            naming: 'Администатор',
            access: 3
        }
    });

    await prisma.type.create({
        data: {
            id: 0,
            naming: 'Авторизация',
            status: 0
        }
    })

    await prisma.user.create({
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
})();