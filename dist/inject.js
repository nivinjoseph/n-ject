"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.injectSymbol = Symbol("inject");
// public
function inject() {
    var dependencies = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dependencies[_i] = arguments[_i];
    }
    return function (target) { return Reflect.defineMetadata(exports.injectSymbol, dependencies, target); };
}
exports.inject = inject;
//# sourceMappingURL=inject.js.map