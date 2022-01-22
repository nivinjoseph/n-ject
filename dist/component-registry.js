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
exports.ComponentRegistry = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const lifestyle_1 = require("./lifestyle");
const n_exception_1 = require("@nivinjoseph/n-exception");
const component_registration_1 = require("./component-registration");
const reserved_keys_1 = require("./reserved-keys");
// internal
class ComponentRegistry {
    constructor() {
        this._registrations = new Array();
        // private readonly _registry: { [index: string]: ComponentRegistration } = {};
        this._registry = new Map();
        this._isDisposed = false;
    }
    register(key, component, lifestyle, ...aliases) {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        n_defensive_1.given(key, "key").ensureHasValue();
        n_defensive_1.given(component, "component").ensureHasValue();
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue().ensureIsNumber();
        n_defensive_1.given(aliases, "aliases").ensureHasValue().ensureIsArray()
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.distinct().length, "duplicates detected");
        key = key.trim();
        if (this._registry.has(key))
            throw new n_exception_1.ApplicationException(`Duplicate registration for key '${key}'`);
        aliases.forEach(t => {
            const alias = t.trim();
            if (this._registry.has(alias))
                throw new n_exception_1.ApplicationException(`Duplicate registration for alias '${alias}'`);
        });
        let registration = new component_registration_1.ComponentRegistration(key, component, lifestyle, ...aliases);
        this._registrations.push(registration);
        this._registry.set(registration.key, registration);
        registration.aliases.forEach(t => this._registry.set(t, registration));
    }
    verifyRegistrations() {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        for (let registration of this._registrations)
            this.walkDependencyGraph(registration);
    }
    find(key) {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        n_defensive_1.given(key, "key").ensureHasValue();
        key = key.trim();
        return this._registry.get(key);
        // FIXME: do we still need the code below
        // let result = this._registry[key];
        // if (!result)
        // {
        //     result = this._registrations.find(t => t.key === key || t.aliases.some(u => u === key));
        //     if (!result)
        //         console.log("COULD NOT FIND IN COMPONENT REGISTRY", key);
        // }
        // return result;
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            yield Promise.all(this._registrations.map(t => t.dispose()));
        });
    }
    walkDependencyGraph(registration, visited = {}) {
        // check if current is in visited
        // add current to visited
        // check if the dependencies are registered
        // walk the dependencies reusing the visited
        // remove current from visited
        if (visited[registration.key] || registration.aliases.some(t => !!visited[t]))
            throw new n_exception_1.ApplicationException(`Circular dependency detected with registration '${registration.key}'.`);
        visited[registration.key] = registration;
        registration.aliases.forEach(t => visited[t] = registration);
        for (const dependency of registration.dependencies) {
            if (dependency === reserved_keys_1.ReservedKeys.serviceLocator)
                continue;
            if (!this._registry.has(dependency))
                throw new n_exception_1.ApplicationException(`Unregistered dependency '${dependency}' detected.`);
            const dependencyRegistration = this._registry.get(dependency);
            // rules
            // singleton --> singleton ==> good (child & root)
            // singleton --> scoped =====> bad
            // singleton --> transient ==> good (child & root)
            // scoped -----> singleton ==> good (child only)
            // scoped -----> scoped =====> good (child only)
            // scoped -----> transient ==> good (child only)
            // transient --> singleton ==> good (child & root)
            // transient --> scoped =====> good (child only)
            // transient --> transient ==> good (child & root)
            if (registration.lifestyle === lifestyle_1.Lifestyle.Singleton && dependencyRegistration.lifestyle === lifestyle_1.Lifestyle.Scoped)
                throw new n_exception_1.ApplicationException("Singleton with a scoped dependency detected.");
            this.walkDependencyGraph(dependencyRegistration, visited);
        }
        visited[registration.key] = null;
        registration.aliases.forEach(t => visited[t] = null);
    }
}
exports.ComponentRegistry = ComponentRegistry;
//# sourceMappingURL=component-registry.js.map