"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRegistration = void 0;
const tslib_1 = require("tslib");
const lifestyle_js_1 = require("./lifestyle.js");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
require("reflect-metadata");
const inject_1 = require("./inject");
// internal
class ComponentRegistration {
    constructor(key, component, lifestyle, ...aliases) {
        this._isDisposed = false;
        (0, n_defensive_1.given)(key, "key").ensureHasValue().ensureIsString();
        (0, n_defensive_1.given)(component, "component").ensureHasValue();
        (0, n_defensive_1.given)(lifestyle, "lifestyle").ensureHasValue().ensureIsEnum(lifestyle_js_1.Lifestyle);
        (0, n_defensive_1.given)(aliases, "aliases").ensureHasValue().ensureIsArray()
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => t.every(u => u != null), "alias cannot null")
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.map(u => u.trim()).distinct().length, "duplicates detected");
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this._getDependencies();
        this._aliases = [...aliases.map(t => t.trim())];
    }
    get key() { return this._key; }
    get component() { return this._component; }
    get lifestyle() { return this._lifestyle; }
    get dependencies() { return this._dependencies; }
    get aliases() { return this._aliases; }
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (typeof this._component !== "function" && this._component.dispose) {
                try {
                    yield this._component.dispose();
                }
                catch (error) {
                    console.error(`Error: Failed to dispose component with key '${this._key}' of type '${this._component.getTypeName()}'.`);
                    console.error(error);
                }
            }
        });
    }
    _getDependencies() {
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