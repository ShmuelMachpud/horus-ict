"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.POSTGRES_CONNECTION_STRING = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.POSTGRES_CONNECTION_STRING = process.env.POSTGRES_CONNECTION_STRING;
exports.NODE_ENV = process.env.NODE_ENV;
