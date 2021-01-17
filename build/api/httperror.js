"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, text, expose = true) {
        super(text);
        this.status = status;
        this.expose = expose;
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=httperror.js.map