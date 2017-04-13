"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lifestyle_js_1 = require("./lifestyle.js");
const n_defensive_1 = require("n-defensive");
require("reflect-metadata");
const inject_1 = require("./inject");
// internal
class ComponentRegistration {
    get key() { return this._key; }
    get component() { return this._component; }
    get lifestyle() { return this._lifestyle; }
    get dependencies() { return this._dependencies; }
    constructor(key, component, lifestyle) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        n_defensive_1.given(component, "component").ensureHasValue().ensure(t => typeof t === "function");
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue();
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this.getDependencies();
    }
    getDependencies() {
        if (this._lifestyle === lifestyle_js_1.Lifestyle.Instance)
            return new Array();
        if (Reflect.hasOwnMetadata(inject_1.injectSymbol, this._component))
            return Reflect.getOwnMetadata(inject_1.injectSymbol, this._component);
        else
            return this.detectDependencies();
    }
    // Borrowed from AngularJS implementation
    detectDependencies() {
        const FN_ARG_SPLIT = /,/;
        const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        let dependencies = new Array();
        let argDecl = this.extractArgs(this._component);
        argDecl[1].split(FN_ARG_SPLIT).forEach(arg => {
            arg.replace(FN_ARG, (all, underscore, name) => {
                dependencies.push(name);
                return undefined;
            });
        });
        return dependencies;
    }
    stringifyFn(fn) {
        return Function.prototype.toString.call(fn);
    }
    extractArgs(fn) {
        const ARROW_ARG = /^([^(]+?)=>/;
        const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        let fnText = this.stringifyFn(fn).replace(STRIP_COMMENTS, "");
        let args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
        return args;
    }
}
exports.ComponentRegistration = ComponentRegistration;
//# sourceMappingURL=component-registration.js.map