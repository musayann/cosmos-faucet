"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const actions_1 = require("./actions");
function main(args) {
    if (args.length < 1) {
        actions_1.help();
        process.exit(1);
    }
    const action = args[0];
    const restArgs = args.slice(1);
    switch (action) {
        case "generate":
            actions_1.generate(restArgs).catch((error) => {
                console.error(error);
                process.exit(1);
            });
            break;
        case "help":
            actions_1.help();
            break;
        case "version":
            actions_1.version().catch((error) => {
                console.error(error);
                process.exit(1);
            });
            break;
        case "start":
            actions_1.start(restArgs).catch((error) => {
                console.error(error);
                process.exit(1);
            });
            break;
        default:
            throw new Error("Unexpected action argument");
    }
}
exports.main = main;
//# sourceMappingURL=cli.js.map