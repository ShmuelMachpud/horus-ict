"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const pino_1 = __importDefault(require("pino"));
const environments_1 = require("../utils/environments");
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const time_helpers_1 = require("./time.helpers");
const setLogColorByLevel = (level) => {
    if (level === 30)
        return "blue";
    if (level === 35)
        return "green";
    return "red";
};
const stream = (0, pino_pretty_1.default)({
    ignore: "pid,hostname,time,label,tag,user_id,step,status,err",
    messageFormat(log, _messageKey, _levelLabel, extras) {
        const { tag, level, msg, user_id, step, status } = log;
        const { colors } = extras;
        return (`${colors.yellow(tag ? `[${tag}]` : "")}${colors.white(`${(0, time_helpers_1.loggerTime)()} -`)}${colors[setLogColorByLevel(level)](`${msg || ""} ${status || ""}`)}` +
            `${user_id && step ? `${colors[setLogColorByLevel(level)](`\n${step || ""}\n${user_id || ""}`)}` : ""}`);
    },
});
exports.log = (0, pino_1.default)({
    customLevels: {
        success: 35,
    },
}, environments_1.NODE_ENV === "development" ? stream : undefined);
global.log = exports.log;
