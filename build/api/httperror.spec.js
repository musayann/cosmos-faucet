"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httperror_1 = require("./httperror");
describe("HttpError", () => {
    it("can be constructed", () => {
        {
            const error = new httperror_1.HttpError(400, "Invalid name field");
            expect(error.message).toEqual("Invalid name field");
            expect(error.status).toEqual(400);
            expect(error.expose).toEqual(true);
        }
        {
            const error = new httperror_1.HttpError(500, "Out of memory", false);
            expect(error.message).toEqual("Out of memory");
            expect(error.status).toEqual(500);
            expect(error.expose).toEqual(false);
        }
    });
});
//# sourceMappingURL=httperror.spec.js.map