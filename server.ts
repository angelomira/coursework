import API from './api/currencies';

import express from 'express';
import session from 'express-session';

const options = require('./server-options.json');

import Currency from './models/currency';
import Loggerin from './addons/loggerin';

import cors from 'cors';
import path from 'path';

import SwaggerJS = require('swagger-jsdoc');
import SwaggerUI = require('swagger-ui-express');

import favicon from 'serve-favicon';

const PORT: number = 3000;

const app = express();
const api = new API();

const swg = SwaggerJS(options);

app.use(express.static('./static'));

app.use(favicon(path.join(__dirname, 'static', 'resources', 'favicon.ico')));

app.use(express.json());
app.use(cors());

app.use(
    '/swagger', 
    SwaggerUI.serve,
    SwaggerUI.setup(options),
);

app.use(
    session({
        secret: 'JM"/"`Ei4Zme?V+q=O#fDJ!%,%h%GP',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }),
);

import  route_currencies from './routes/route-currencies';
app.use(route_currencies);
import  route_auth_prog from './routes/route-auth-prog';
app.use(route_auth_prog);
import  route_auth_sess from './routes/route-auth-sess';
app.use(route_auth_sess);
import  route_exchange from './routes/route-exchange';
app.use(route_exchange);
import  route_roles from './routes/route-roles';
app.use(route_roles);
import  route_funds from './routes/route-funds';
app.use(route_funds);
import  route_checks from './routes/route-checks';
app.use(route_checks);
// import  route_operas from './routes/route-operas';
// app.use(route_operas);

app.listen(PORT | 3000, () => {
    Loggerin.info('Server is running on port: ', PORT);
});
