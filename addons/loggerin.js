"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const safe_1 = __importDefault(require("colors/safe"));
class Loggerin {
    static info(...data) {
        const datetime = new Date().toLocaleString();
        console.info(safe_1.default.blue(`[${datetime}] \t - ${data.join(' ')}`));
    }
    static warn(...data) {
        const datetime = Date.now().toLocaleString();
        console.warn(safe_1.default.yellow(`[${datetime}] \t - ${data.join(' ')}`));
    }
    static error(...data) {
        const datetime = Date.now().toLocaleString();
        console.error(safe_1.default.bgRed(safe_1.default.white(`[${datetime}] \t - ${data.join(' ')}`)));
    }
}
exports.default = Loggerin;
