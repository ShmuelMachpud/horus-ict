"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.CustomError = void 0;
class CustomError {
    status;
    tag;
    message;
    name;
    constructor(message, tag, status, name) {
        this.message = message;
        this.tag = tag;
        this.status = status;
        this.name = name ?? message;
    }
}
exports.CustomError = CustomError;
const handleError = (error, message, tag = 'HTTP') => {
    message += error.message ? ` ${error.message}` : ` #{error}`;
    tag = error.tag ? error.tag : tag;
    global.log.error({ tag }, message);
};
exports.handleError = handleError;
