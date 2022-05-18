"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = exports.ScopeType = exports.Container = void 0;
require("@nivinjoseph/n-ext");
const container_1 = require("./container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return container_1.Container; } });
const scope_type_1 = require("./scope-type");
Object.defineProperty(exports, "ScopeType", { enumerable: true, get: function () { return scope_type_1.ScopeType; } });
const inject_1 = require("./inject");
Object.defineProperty(exports, "inject", { enumerable: true, get: function () { return inject_1.inject; } });
//# sourceMappingURL=index.js.map