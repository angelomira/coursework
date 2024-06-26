# Теоретические обоснования темы "Обменный пункт"

- [Теоретические обоснования темы "Обменный пункт"](#теоретические-обоснования-темы-обменный-пункт)
  - [Технодокументационная аналитика](#технодокументационная-аналитика)
    - [Аналитика схожих продуктов и базовые требования](#аналитика-схожих-продуктов-и-базовые-требования)
    - [Диаграмма отношений сущностей](#диаграмма-отношений-сущностей)
    - [Диаграмма прецендентов](#диаграмма-прецендентов)
    - [Диаграмма потока данных](#диаграмма-потока-данных)
  - [База данных](#база-данных)
    - [Миграция](#миграция)
      - [Создание демо-данных для запуска](#создание-демо-данных-для-запуска)
    - [Миграция - подключения](#миграция---подключения)
  - [Считывание данных со стороннего API (ЦБ РФ)](#считывание-данных-со-стороннего-api-цб-рф)
    - [ЦБ РФ: считывание](#цб-рф-считывание)
    - [ЦБ РФ: обработка](#цб-рф-обработка)
  - [Сервер](#сервер)
    - [API](#api)
    - [API: Swagger](#api-swagger)
  - [Прототипирование](#прототипирование)
    - [Прототип: базовые функционалы](#прототип-базовые-функционалы)
    - [Прототип: базовые переходящие определения](#прототип-базовые-переходящие-определения)
  - [Дизайн: макет](#дизайн-макет)
    - [Формирование дизайнерского решения](#формирование-дизайнерского-решения)
  - [Дизайн: вёрстка](#дизайн-вёрстка)
  - [Сторонние модули и инфраструктура](#сторонние-модули-и-инфраструктура)

## Технодокументационная аналитика

Прежде чем начать проектирование и соответственно разработку данного программного продукта, был составлен перечень необходимой документации на основании предметной области и схожих продуктов, подробнее в следующих документациях (формат .DOCX):

- [Техническое задание](./docs/data/(КР)%20ТЗ.docx)
  - [Техническое задание: предметная область](./docs/data/(КР)%20Предмет.%20область.docx)
- [Аналитика: схожие продукты](./docs/data/(КР)%20Аналитика%20схожих%20продуктов.docx)
- [Аналитика: функциональные поля](./docs/data/(КР)%20Аналитика%20функциональных%20полей.docx)
- [Логика переходов и самих страниц](./docs/data/(КР)%20Логика%20перехода%20между%20страницами.docx)

### Аналитика схожих продуктов и базовые требования

Есть несколько перечней программных продуктов, которые также реализуют, как минимум, функциональный минимум для конвертации валют, а также способны предоставлять небольшую функциональную надстройку в области функциональной конвертации валют, тем не менее, таковые предоставляют информацию только о конвертации валют и только о ней, подробнее — [в DOCX документе](./docs/data/).

Но говоря не только об публичных продуктах, необходимо понимать, что в первую очередь программный продукт — есть "админ-панель" для сотрудников обменного пункта и только потом уже для клиентов; оттого и необходимо также пытаться ориентироваться на схожие продукты, хоть те и не могут предоставлять возможность к собственному анализу, например (ОДС города Москвы).

- на основании следующих формаций были составлены базовые требования, которые указаны в [техническом задании](./docs/data/(КР)%20ТЗ.docx).

### Диаграмма отношений сущностей

Прежде всего, предметная область подразумевает базу данных (о ней — читать блок об базе данных), та подразумевает планирование и разработку, а также для её понятной репрезентации: диаграмму отношений сущностей ("ERD"), для документации на которой эта основывается, читайте вышеупомянутый блок статьи.

ERD данной базы данных представлена в двух случаях вследствие обновления и реструктуризации самой базы данных, подробнее об документе:

- [Обновление базы данных (.MD)](./docs/data/(КР)%20Обновление%20базы%20данных.md)
- [Обновление базы данных (.DOCX)](./docs/data/(КР)%20Обновление%20базы%20данных.docx)

1. **ERD-1.0:**

![erd1.0](./docs/data/ERD%20Diagramm.drawio.png)

1. **ERD-2.0:**

![erd2.0](./docs/data/ERD%20Diagramm%20-%20NEW.drawio.png)

При необходимости просмотра или анализа и редактирования самих схематик ERD, исходные файлы схем находятся в следующем пути:

- [ERD-1.0](./docs/data/ERD%20Diagramm.drawio)
- [ERD-2.0](./docs/data/ERD%20Diagramm%20-%20NEW.drawio)

### Диаграмма прецендентов

Usecase диаграмма (или диаграмма прецендентов) — это диаграмма, отражающая отношения между акторами и прецедентами и являющаяся составной частью модели прецедентов, позволяющей описать систему на концептуальном уровне.

- **сама диаграмма прецендетов была составлена на основании сразу множества аналитики и схематик и в итоге предоставляет полностное представление об потенциальном продукте и его работе.**

![usecase](./docs/data/Usecase%20Diagramm.drawio.png)

При необходимости просмотра или анализа и редактирования самих схематик Usecase, исходные файлы схем находятся в следующем пути:

- [Usecase](./docs/data/Usecase%20Diagramm.drawio)

### Диаграмма потока данных

DFD (или же "диаграмма потока данных") в отличие от предыдущих диаграмм, является скорее пост-финальной и обозначает внутренний порядок работы приложения и того, как данные между "нодами" этого приложения переходят от одного к другому, представляя поведение в виде машины состояний (конечного автомата).

- **схематика DFD представлена в концептуальном и логическом уровнях вследствие отсутствие рациональных причин углубляться вплоть до физического уровня диаграммы.**

1. **DFD Level 0:**

![dfd0](./docs/data/DFD%20Level%200.drawio.png)

2. **DFD Level 1:**

![dfd1](./docs/data/DFD%20Level%201.drawio.png)

При необходимости просмотра или анализа и редактирования самих схематик DFD, исходные файлы схем находятся в следующем пути:

- [DFD Level 0](./docs/data/DFD%20Level%200.drawio)
- [DFD Level 1](./docs/data/DFD%20Level%201.drawio)

## База данных

База данных была спроектирована на основании специализированного документа что составлялся от предметной области и стека и требований из технического задания:

- [Проектирование базы данных](./docs/data/(КР)%20Проектирование%20базы%20данных.docx)
- **вскоре в ходе разработки и пользования базы данных, та была обновлена и реструктурирована:**
  - [Обновление базы данных (.MD)](./docs/data/(КР)%20Обновление%20базы%20данных.md)
  - [Обновление базы данных (.DOCX)](./docs/data/(КР)%20Обновление%20базы%20данных.docx)

Все программные поля указаны в специализированном строковом формате:
- [/tables.js/](./tables.js)

Все программные интерпретации (SQL) таблиц базы данных указаны в SQL формате:
- [/tables.sql/](./tables.sql)

### Миграция

Сама база данных, разумеется, не находится вместе с репозиторией в публичном доступе, потому встаёт вопрос как её мигрировать и каким образом вообще клонирование базы данных должно происходит для проверки и оценки функциональной части базы данных, для этого существует определенный программный алгоритм.

Проект для взаимодействия и управления базой данных использует Prisma (и Prisma ORM соответственно):
- https://www.prisma.io/

В папке проекта хранятся схематики (модели данных) из базы данных со всеми формациями, отношениями, ограничениями и тому подобными, просмотреть схематику вы можете по пути (следуя из корневой директории репозитории): "→ prisma/ → schema.prisma"; там находятся необходимые для экспорта данные и формации.

- подробно об подключении Prisma ORM к созданному вашему PostgreSQL-серверу прочитайте в документации Prisma\.io:\
https://www.prisma.io/docs/orm/overview/databases/postgresql/

После подключения и следованию гайду от официального дистрибьютора, проследуйте следующим инструкциям, чтобы экспортировать (мигрировать) модели (таблицы) в вашу базу данных:

```powershell
npm i
prisma format
prisma validate
prisma generate
prisma db push
```

\***- миграция моделей (таблиц) из схематики в базу данных может занять**

#### Создание демо-данных для запуска

Репозитория также содержит маленький .TS скрипт для подключения к базе данных (читайте блок "миграция - подключения") и создаёт необходимые данные для запуска программного продукта:

- [/scripts/create-admin.ts/](./scripts/create-admin.ts)

**Ниже представлены данные по которым будет регистрирован пользователь:**

```typescript
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
```

### Миграция - подключения

Вышеупомянутая технология Prisma + Prisma ORM позволяет не только мигрировать базы данных, но и подключать (в данном случае сервер) ПО к базе данных.

- https://www.prisma.io/docs/orm/overview/databases/postgresql#connection-details

В ссылке выше приложена инструкция и формация по подключению к базе данных, для подключения клиента Prisma, следуйте следующей инструкции (с учётом что вы уже следовали и обустроили всё по базовым требованиям самой Prisma):

1. Создайте ".env" файл в котором вы распишите строки подключения к вашей базе данных (серверу), ниже показан пример содержания:

```python
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
DATABASE_URL="postgresql://postgres:admin@localhost:5432/moneycdb?schema=public"
```

2. Напишите следующие команды из Prisma CLI:

```powershell
prisma init
prisma validate
prisma generate
prisma format
```

3. Prisma готова к использованию (к примеру реализации, см. программную реализацию серверной части продукта):\
["server.ts"](./server.ts)

## Считывание данных со стороннего API (ЦБ РФ)

В первую очередь, необходимо понимать, что программный продукт должен брать данные из официального дистрибьютора информации об курсах валют для конвертации в обменном пункте, на территории РФ таковым представляется — ЦБ РФ:

- https://cbr.ru/

### ЦБ РФ: считывание

ЦБ РФ предоставляет для программистов и разработчиков собственный API, но тот представляет собой нагромождённую не только бюрократически, но и программно возможность считывать данные даже не в их полном формате, учитывая их разрешения и стек текущей разработки, потому было принято простое решение — считывать публичную страницу ЦБ РФ со всеми включаемыми данными обо всех валютах, которые даёт ЦБ РФ, за единственным исключением, добавлением автоматическим курса рубля к самому себе (как бы парадоксально это не звучало).

- Ссылка с которых берутся данные:\
  https://cbr.ru/currency_base/daily/

Вопрос встаёт о том, каким и скольким способами можно редактировать и контроллировать получаемую дату и об этом процессе информация предоставлена ниже:

> В-первую очередь, ЦБ РФ по курсам, предоставляется в виде ссылки, которая включает в себя множество параметров, схематика ниже:

![cbr](./docs/res/cbr.png)

- **Бирюзовый:**\
  базовый URL страницы с курсами валют (после неё идёт запросный префикс, который неудостоин выделения);
- **Зелёный:**\
  параметр публичных курсов или не публичных, из определения, всегда равен "ИСТИНА" и в иных случаях не работает;
- **Красный:**\
  параметр, олицетворяющий дату на которой необходимо узнать курс валют, дальше текущего (на момент запроса) дня идти нельзя;

### ЦБ РФ: обработка

ЦБ РФ в том или ином образе предоставил нам "сырые" данные в HTML-формате, которые необходимо обработать, этим занимается серверная часть, что связана конкретно с API ЦБ РФ, подробнее дальше:

1. Получить HTML-разметку страницы по определенным параметрам;
2. Конвертировать при помощи библиотеки JSDOM в текстово-программный способ обращения с данными;
3. Конвертировать полученые данные в спец. модель данных и добавить способы обращения извне;

- в методологии сервера программного продукта, этот "подсервер" внутри глобального сервера называется "CR-API" ("Currencie & Ratio API");

**Общая схематика принципа обработки (в представлении запроса от клиента):**

![cbr-png](./docs/res/Принципы%20обработки%20-%20ЦБ%20РФ.drawio.png)

\*- штрихованные линии обозначают "путь обратно" данных к клиенту;

**Схематика данной диаграммы прилагается:**
- [CR-API](./docs/res/Принципы%20обработки%20-%20ЦБ%20РФ.drawio)

## Сервер

Сервер одновременно представляет сразу обе части: и подтягивание фронтенда (при содействии движка NGINX) и одновременно бекэнда (самостоятельно Express), что объединяет вообще всё приложение одновременно и в монолит, но изнутри разделяет его на множество микросервисов (CR-API, сам сервер, часть клиента или же "фронтенда").

**Подробнее об устройстве сервера, смотрите его программный файл:**

- [/server.ts/](./server.ts)

### API

Сервер предоставляет функционал не только CR-API, но и REST API сразу по нескольким категориям:

1. Маршруты пользовательских нод\ 
   (User end-points)
2. Маршруты пользовательских сессий\
   (Sessions)
3. Машруты валютных курсов\
   (Currency)
4. Маршруты ролей\
   (Role end-points)

- **документация по каждому маршруту API предоставлена в программном коде и в Swagger API Documentation (подробнее в следующем блоке).**

### API: Swagger

Вследствие того что NGROK, как и прочие продукты предоставляющие аналогичный функционал заблокировали свою деятельность на территории РФ, Swagger на данный момент представлен через локальное подключение:

1. Запустите сервер Express.js при помощи:
```powershell-interactive
npm i
npm start
```
2. Перейдите на `https://localhost:3000/swagger` и вам будет представлен функционал Swagger для сервера;
   - Для просмотра содержимого и настройки Swagger и экспериментирования с его документацией, смотрите файл спецификаций;

![swagger](./docs/res/swagger.png)

## Прототипирование

Прототипирование было начато сразу же после составления предметной области, проектирования базы данных и технического задания: в-первую очередь, были зарисованы базовые скетчи страниц, составлена логика перехода между страницами и подготовлена база к разработке продукта.

**Этапы прототипирования продукта (на данный момент):**

1. CR-API (подробнее в вышеупомянутом заголовке);
   1. внутренний парсер;
2. Была составлена базовая разметка в HTML формате:

![alt text](./docs/res/prototype.png)

Для просмотра той версии проекта в полной мере, существует архив: [d0722254d](./history/d0722254d61c51ca482a8b673f546f9914fb1f14.zip) (Git LFS), перейдите в директорию "project → server.ts" и откройте "project/static → index.html" и вы сможете просмотреть прототип.

### Прототип: базовые функционалы

Если рассматривать прототип в текущей его версии (на момент публикации) и общий процесс разработки, то базовый функционал из себя составляет:

1. Авторизация и регистрация (при правах) пользователей;
2. Система контроля прав доступа;
3. Система сессий и- авторизаций;
4. Главное меню для конвертации валют;
5. Меню поиска и взаимодействия с перечнем клиентуры обменного пункта;

### Прототип: базовые переходящие определения

Проектный прототип уже включает в себя не только реализацию дизайна и макета согласно выбранной методологии, но также имеет отработанную документацию, стабильную инфраструктуру и систему, готовую к расширению; всё это служит основой для дальнейшей разработки и реализации оставшегося функционала и требований, связанных с предметной областью проекта.

Проект находится на полпути к его итоговой реализации и подготовке к показу продукта заказчику.

## Дизайн: макет

В ходе принятия решений о составлении макета на стадии параллельной разработки прототипирования и технических документаций, было решено перейти на методологию дизайна и вёрстка "In-browser Design (Ib-D)" (или "Design in the Browser (D-B)"): этот метод позволяет дизайнерам и разработчикам более гибко работать над проектом, обеспечивая более быструю итерацию и возможность непосредственно видеть, как выглядит и взаимодействует дизайн на реальной веб-странице, он также способствует более эффективному сотрудничеству между дизайнерами и разработчиками, так как оба специалиста могут одновременно работать над проектом, улучшая его по мере необходимости.

### Формирование дизайнерского решения

Отсутствует вследствие принятия общей методологии, но были приняты следующие следственные обустройства:

1. Цветовая палитра (чёрно-бело-оранжевый);
2. Общая стилизация (резкий и яркий дизайн);

## Дизайн: вёрстка

- для коллекции изображений, отображающих дизайн, смотрите файл: 
  - [DESIGN.md](./DESIGN.md)
  - [DESIGN.pdf](./DESIGN.pdf)

## Сторонние модули и инфраструктура

Проект также включает в себя множество другой второстепенной инфраструктуры, которая образует проект как полноценный продукт, по каждому модулю смотреть их исходные файлы соответственно.