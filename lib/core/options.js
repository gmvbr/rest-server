"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const assert = require("assert");
function validate(options) {
    assert(options, 'require options');
    assert(options.name, 'require options.name');
}
exports.validate = validate;
//# sourceMappingURL=options.js.map