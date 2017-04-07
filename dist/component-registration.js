"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lifestyle_js_1 = require("./lifestyle.js");
var n_defensive_1 = require("n-defensive");
require("reflect-metadata");
var inject_1 = require("./inject");
// internal
var ComponentRegistration = (function () {
    function ComponentRegistration(key, component, lifestyle) {
        n_defensive_1.given(key, "key").ensureHasValue().ensure(function (t) { return !t.isEmptyOrWhiteSpace(); });
        n_defensive_1.given(component, "component").ensureHasValue().ensure(function (t) { return typeof t === "function"; });
        n_defensive_1.given(lifestyle, "lifestyle").ensureHasValue();
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this.getDependencies();
    }
    Object.defineProperty(ComponentRegistration.prototype, "key", {
        get: function () { return this._key; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRegistration.prototype, "component", {
        get: function () { return this._component; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRegistration.prototype, "lifestyle", {
        get: function () { return this._lifestyle; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ComponentRegistration.prototype, "dependencies", {
        get: function () { return this._dependencies; },
        enumerable: true,
        configurable: true
    });
    ComponentRegistration.prototype.getDependencies = function () {
        if (this._lifestyle === lifestyle_js_1.Lifestyle.Instance)
            return new Array();
        if (Reflect.hasOwnMetadata(inject_1.injectSymbol, this._component))
            return Reflect.getOwnMetadata(inject_1.injectSymbol, this._component);
        else
            return this.detectDependencies();
    };
    // Borrowed from AngularJS implementation
    ComponentRegistration.prototype.detectDependencies = function () {
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var dependencies = new Array();
        var argDecl = this.extractArgs(this._component);
        argDecl[1].split(FN_ARG_SPLIT).forEach(function (arg) {
            arg.replace(FN_ARG, function (all, underscore, name) {
                dependencies.push(name);
                return undefined;
            });
        });
        return dependencies;
    };
    ComponentRegistration.prototype.stringifyFn = function (fn) {
        return Function.prototype.toString.call(fn);
    };
    ComponentRegistration.prototype.extractArgs = function (fn) {
        var ARROW_ARG = /^([^(]+?)=>/;
        var FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var fnText = this.stringifyFn(fn).replace(STRIP_COMMENTS, "");
        var args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
        return args;
    };
    return ComponentRegistration;
}());
exports.ComponentRegistration = ComponentRegistration;
//# sourceMappingURL=component-registration.js.map