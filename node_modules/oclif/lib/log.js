"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = void 0;
exports.log = log;
const core_1 = require("@oclif/core");
const node_util_1 = require("node:util");
const util_1 = require("./util");
exports.debug = require('debug')('oclif');
exports.debug.new = (name) => require('debug')(`oclif:${name}`);
function log(format, ...args) {
    args = args.map((arg) => (0, util_1.prettifyPaths)(arg));
    return exports.debug.enabled ? (0, exports.debug)(format, ...args) : core_1.ux.stdout(`oclif: ${(0, node_util_1.format)(format, ...args)}`);
}
