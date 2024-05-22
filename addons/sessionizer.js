"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
function sessionize(data, mode) {
    if (mode === undefined)
        mode = 'write';
    let sessions_json = fs_extra_1.default.readFileSync('server-sessions.json', { encoding: 'utf-8' });
    let sessions_data = JSON.parse(sessions_json);
    switch (mode) {
        case 'write':
            sessions_data.push(data);
            break;
        case 'slice':
            sessions_data.splice(sessions_data.indexOf(data), 1);
            break;
        case 'read':
            return sessions_data.includes(data);
    }
    fs_extra_1.default.writeFileSync('server-sessions.json', JSON.stringify(sessions_data, undefined, 2));
    return false;
}
exports.default = sessionize;
