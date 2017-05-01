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
        n_defensive_1.given(component, "component").ensureHasValue();
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue();
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this.getDependencies();
    }
    getDependencies() {
        if (this._lifestyle === lifestyle_js_1.Lifestyle.Instance)
            return new Array();
        // if (Reflect.hasOwnMetadata(injectSymbol, this._component))
        //     return Reflect.getOwnMetadata(injectSymbol, this._component);
        // else
        //     return this.detectDependencies();    
        return Reflect.hasOwnMetadata(inject_1.injectSymbol, this._component)
            ? Reflect.getOwnMetadata(inject_1.injectSymbol, this._component)
            : new Array();
    }
}
exports.ComponentRegistration = ComponentRegistration;
//# sourceMappingURL=component-registration.js.map