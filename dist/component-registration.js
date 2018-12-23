"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lifestyle_js_1 = require("./lifestyle.js");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
require("reflect-metadata");
const inject_1 = require("./inject");
class ComponentRegistration {
    get key() { return this._key; }
    get component() { return this._component; }
    get lifestyle() { return this._lifestyle; }
    get dependencies() { return this._dependencies; }
    get aliases() { return this._aliases; }
    constructor(key, component, lifestyle, ...aliases) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(t => !t.isEmptyOrWhiteSpace());
        n_defensive_1.given(component, "component").ensureHasValue();
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        n_defensive_1.given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this.getDependencies();
        this._aliases = [...aliases.map(t => t.trim())];
    }
    getDependencies() {
        if (this._lifestyle === lifestyle_js_1.Lifestyle.Instance)
            return new Array();
        return Reflect.hasOwnMetadata(inject_1.injectSymbol, this._component)
            ? Reflect.getOwnMetadata(inject_1.injectSymbol, this._component)
            : new Array();
    }
}
exports.ComponentRegistration = ComponentRegistration;
//# sourceMappingURL=component-registration.js.map