"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentRegistration = void 0;
const lifestyle_js_1 = require("./lifestyle.js");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
require("reflect-metadata");
const inject_1 = require("./inject");
// internal
class ComponentRegistration {
    constructor(key, component, lifestyle, ...aliases) {
        this._isDisposed = false;
        n_defensive_1.given(key, "key").ensureHasValue();
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
    get key() { return this._key; }
    get component() { return this._component; }
    get lifestyle() { return this._lifestyle; }
    get dependencies() { return this._dependencies; }
    get aliases() { return this._aliases; }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            if (typeof (this._component) !== "function" && this._component.dispose) {
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