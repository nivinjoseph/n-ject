"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildScope = void 0;
const base_scope_1 = require("./base-scope");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const scope_type_1 = require("./scope-type");
const n_exception_1 = require("@nivinjoseph/n-exception");
// internal
class ChildScope extends base_scope_1.BaseScope {
    constructor(componentRegistry, parentScope) {
        n_defensive_1.given(componentRegistry, "componentRegistry").ensureHasValue();
        n_defensive_1.given(parentScope, "parentScope").ensureHasValue();
        super(scope_type_1.ScopeType.Child, componentRegistry, parentScope);
        this.bootstrap();
    }
    // cannot put this method in the base class due to circular reference issue
    createScope() {
        if (this.isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        if (!this.isBootstrapped)
            throw new n_exception_1.InvalidOperationException("createScope after bootstrap");
        return new ChildScope(this.componentRegistry, this);
    }
}
exports.ChildScope = ChildScope;
//# sourceMappingURL=child-scope.js.map