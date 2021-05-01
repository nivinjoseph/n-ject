"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inject = exports.injectSymbol = void 0;
require("reflect-metadata");
exports.injectSymbol = Symbol("inject");
// public
function inject(...dependencies) {
    return (target) => Reflect.defineMetadata(exports.injectSymbol, dependencies, target);
}
exports.inject = inject;
//# sourceMappingURL=inject.js.map