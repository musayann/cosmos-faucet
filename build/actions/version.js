"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
const fs_1 = __importDefault(require("fs"));
async function version() {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(__dirname + "/../../package.json", { encoding: "utf8" }, (error, data) => {
            if (error) {
                reject(error);
            }
            else {
                const packagejson = JSON.parse(data);
                process.stdout.write(`${packagejson.version}\n`);
                resolve();
            }
        });
    });
}
exports.version = version;
//# sourceMappingURL=version.js.map