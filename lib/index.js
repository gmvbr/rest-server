"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = require("fastify-plugin");
const options_1 = require("@core/options");
exports.default = fastify_plugin_1.default(async (_, options) => {
    options_1.validate(options);
});
//# sourceMappingURL=index.js.map