"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const currencies_1 = __importDefault(require("./api/currencies"));
const express_session_1 = __importDefault(require("express-session"));
const options = require('./server-options.json');
const loggerin_1 = __importDefault(require("./addons/loggerin"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const SwaggerJS = require("swagger-jsdoc");
const SwaggerUI = require("swagger-ui-express");
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const PORT = 3000;
const app = (0, express_1.default)();
const api = new currencies_1.default();
const swg = SwaggerJS(options);
app.use(express_1.default.static('./static'));
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, 'static', 'resources', 'favicon.ico')));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/swagger', SwaggerUI.serve, SwaggerUI.setup(options));
app.use((0, express_session_1.default)({
    secret: 'JM"/"`Ei4Zme?V+q=O#fDJ!%,%h%GP',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
const route_currencies_1 = __importDefault(require("./routes/route-currencies"));
app.use(route_currencies_1.default);
const route_auth_prog_1 = __importDefault(require("./routes/route-auth-prog"));
app.use(route_auth_prog_1.default);
const route_auth_sess_1 = __importDefault(require("./routes/route-auth-sess"));
app.use(route_auth_sess_1.default);
const route_roles_1 = __importDefault(require("./routes/route-roles"));
app.use(route_roles_1.default);
app.listen(PORT | 3000, () => {
    loggerin_1.default.info('Server is running on port: ', PORT);
});
