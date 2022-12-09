"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const includo_1 = require("./includo");
const node_process_1 = require("node:process");
const result = (0, includo_1.processRead)(node_process_1.stdin, node_process_1.stdout);
console.log(result);
//# sourceMappingURL=example.js.map